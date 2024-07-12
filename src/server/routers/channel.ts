import { EventEmitter, on } from "node:events";
import type { TRPCRouterRecord } from "@trpc/server";
import type { PostType } from "~/server/db/schema";
import { publicProcedure } from "~/server/trpc";
import { z } from "zod";
import { db } from "../db/client";

interface MyEvents {
  add: (channelId: string, data: PostType) => void;
}
declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

// @ts-ignore
class MyEventEmitter extends EventEmitter {
  public toIterable<TEv extends keyof MyEvents>(
    event: TEv,
  ): AsyncIterable<Parameters<MyEvents[TEv]>> {
    return on(this, event) as AsyncIterable<Parameters<MyEvents[TEv]>>;
  }
}

// In a real app, you'd probably use Redis or something
export const ee = new MyEventEmitter();

export const channelRouter = {
  list: publicProcedure.query(() => {
    return db.channels;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const channel = db.insertChannel(input.name);

      return channel.id;
    }),
} satisfies TRPCRouterRecord;
