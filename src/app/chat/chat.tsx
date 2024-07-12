"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/button";
import { Textarea } from "~/components/input";
import { trpc } from "~/lib/trpc";
import { format, formatDistanceToNow, isToday } from "date-fns";
import * as React from "react";
import { useLivePosts } from "./hooks";

export function Chat() {
  const livePosts = useLivePosts();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="flex h-full flex-col">
        <div
          className="flex flex-1 flex-col-reverse overflow-y-scroll p-4 sm:p-6 lg:p-8"
          ref={scrollRef}
        >
          {/* Inside this div things will not be reversed. */}
          <div>
            <div className="grid gap-4">
              {livePosts.messages?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 justify-end"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="rounded-lg  p-3 text-sm bg-gray-300 dark:bg-gray-800">
                        <p>{item.text}</p>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {isToday(item.createdAt)
                          ? `${formatDistanceToNow(item.createdAt)} ago`
                          : format(item.createdAt, "MMM d, yyyy h:mm a")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="border-t bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
          <AddMessageForm
            onMessagePost={() => {
              scrollRef.current?.scroll({
                // `top: 0` is actually the bottom of the chat due to `flex-col-reverse`
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        </div>
      </div>
    </main>
  );
}

function AddMessageForm(props: { onMessagePost: () => void }) {
  const addPost = trpc.post.add.useMutation({
    onSuccess: () => {
      setMessage("");
      props.onMessagePost();
    },
  });

  const [message, setMessage] = React.useState("");

  async function postMessage() {
    addPost.mutate({
      text: message,
    });
  }

  return (
    <div className="relative">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          /**
           * In a real app you probably don't want to use this manually
           * Checkout React Hook Form - it works great with tRPC
           * @link https://react-hook-form.com/
           */
          await postMessage();
        }}
      >
        <Textarea
          className="pr-12"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={message.split(/\r|\n/).length}
        />
        <Button
          className="absolute right-2 top-2"
          size="icon"
          type="submit"
          variant="ghost"
        >
          <PaperAirplaneIcon className="size-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
