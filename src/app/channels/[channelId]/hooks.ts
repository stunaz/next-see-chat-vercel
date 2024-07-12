import { skipToken } from "@tanstack/react-query";
import { trpc } from "~/lib/trpc";
import * as React from "react";

export function useLivePosts(channelId: string) {
  const [data] = trpc.post.list.useSuspenseQuery(undefined, {
    // No need to refetch as we have a subscription
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const utils = trpc.useUtils();
  const [messages, setMessages] = React.useState(data);
  type Post = NonNullable<typeof messages>[number];

  /**
   * fn to add and dedupe new messages onto state
   */
  const addMessages = React.useCallback((incoming?: Post[]) => {
    setMessages((current) => {
      const map: Record<Post["id"], Post> = {};
      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
    });
  }, []);

  const [lastEventId, setLastEventId] = React.useState<
    // Query has not been run yet
    | false
    // Empty list
    | null
    // Event id
    | string
  >(false);
  if (messages && lastEventId === false) {
    // We should only set the lastEventId once, if the SSE-connection is lost, it will automatically reconnect and continue from the last event id
    // Changing this value will trigger a new subscription
    setLastEventId(messages.at(-1)?.id ?? null);
  }
  trpc.post.onAdd.useSubscription(
    lastEventId === false ? skipToken : { channelId, lastEventId },
    {
      onData(event) {
        addMessages([event.data]);
      },
      onError(err) {
        console.error("Subscription error:", err);
        utils.post.list.invalidate();
      },
    },
  );
  return {
    data,
    messages,
  };
}
