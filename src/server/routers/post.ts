import { sse } from "@trpc/server";
import { streamToAsyncIterable } from "~/lib/stream-to-async-iterator";
import type { PostType } from "~/server/db/schema";
import { z } from "zod";
import { db } from "../db/client";
import { publicProcedure, router } from "../trpc";
import { ee } from "./channel";

export const postRouter = router({
  list: publicProcedure.query(() => {
    return db.posts;
  }),
  add: publicProcedure
    .input(
      z.object({
        channelId: z.string().uuid(),
        author: z.string().trim().min(1),
        text: z.string().trim().min(1),
      }),
    )
    .mutation(async (opts) => {
      const { channelId } = opts.input;

      const post = db.insertPost(opts.input.author, channelId, opts.input.text);

      ee.emit("add", channelId, post);

      return post;
    }),

  onAdd: publicProcedure
    .input(
      z.object({
        channelId: z.string().uuid(),
        // lastEventId is the last event id that the client has received
        // On the first call, it will be whatever was passed in the initial setup
        // If the client reconnects, it will be the last event id that the client received
        lastEventId: z.string().nullish(),
      }),
    )
    .subscription(async function* (opts) {
      let lastMessageCursor: Date | null = null;

      const eventId = opts.input.lastEventId;
      if (eventId) {
        const itemById = db.posts.filter((post) => post.id === eventId)[0];
        lastMessageCursor = itemById?.createdAt ?? null;
      }

      let unsubscribe = () => {
        //
      };

      // We use a readable stream here to prevent the client from missing events
      const stream = new ReadableStream<PostType>({
        async start(controller) {
          const onAdd = (channelId: string, data: PostType) => {
            if (channelId === opts.input.channelId) {
              controller.enqueue(data);
            }
          };
          ee.on("add", onAdd);
          unsubscribe = () => {
            ee.off("add", onAdd);
          };

          const newItemsSinceCursor = db.posts.filter(
            (post) =>
              post.channelId === opts.input.channelId &&
              (!lastMessageCursor || post.createdAt > lastMessageCursor),
          );

          for (const item of newItemsSinceCursor) {
            controller.enqueue(item);
          }
        },
        cancel() {
          unsubscribe();
        },
      });

      for await (const post of streamToAsyncIterable(stream)) {
        yield sse({
          // yielding the post id ensures the client can reconnect at any time and get the latest events this id
          id: post.id,
          data: post,
        });
      }
    }),
});
