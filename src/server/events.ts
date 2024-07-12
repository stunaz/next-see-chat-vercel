import { EventEmitter, on } from "node:events";
import type { PostType } from "~/server/db/schema";

interface MyEvents {
  add: (data: PostType) => void;
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
