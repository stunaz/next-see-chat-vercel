import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
