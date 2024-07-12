import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = (opts: FetchCreateContextFnOptions) => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
