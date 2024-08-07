/**
 * This file contains the root router of your tRPC-backend
 */
import { observable } from "@trpc/server/observable";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";
import { cache } from "react";
import type { Context } from "../context";
import { publicProcedure, router } from "../trpc";
import { postRouter } from "./post";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  post: postRouter,

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;

const createCallerContext = cache(async (): Promise<Context> => ({}));

export const caller = createCallerFactory()(appRouter)(createCallerContext);
