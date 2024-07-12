import type { ChannelType, PostType } from "./schema";

class InMemoryDb {
  private static instance: InMemoryDb;
  public channels: ChannelType[];
  public posts: PostType[];

  private constructor() {
    this.channels = [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        id: "32d90f1f-0353-469d-8bfb-922fe18bc2cd",
        name: "general",
      },
    ];
    this.posts = [];
  }

  public static getInstance(): InMemoryDb {
    if (!InMemoryDb.instance) {
      InMemoryDb.instance = new InMemoryDb();
    }
    return InMemoryDb.instance;
  }

  public insertPost(author: string, channelId: string, text: string): PostType {
    const post: PostType = {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: crypto.randomUUID(),
      author: author,
      channelId: channelId,
      text: text,
    };

    this.posts.push(post);
    return post;
  }

  public insertChannel(name: string): ChannelType {
    const channel: ChannelType = {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: crypto.randomUUID(),
      name: name,
    };

    this.channels.push(channel);
    return channel;
  }

  public getChannels(): ChannelType[] {
    return this.channels;
  }

  public getPosts(): PostType[] {
    return this.posts;
  }
}

const db = InMemoryDb.getInstance();
export { db };
