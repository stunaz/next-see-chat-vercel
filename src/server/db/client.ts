import type { PostType } from "./schema";

class InMemoryDb {
  private static instance: InMemoryDb;
  public posts: PostType[];

  private constructor() {
    this.posts = [];
  }

  public static getInstance(): InMemoryDb {
    if (!InMemoryDb.instance) {
      InMemoryDb.instance = new InMemoryDb();
    }
    return InMemoryDb.instance;
  }

  public insertPost(text: string): PostType {
    const post: PostType = {
      createdAt: new Date(),
      id: crypto.randomUUID(),
      text: text,
    };

    this.posts.push(post);
    return post;
  }

  public getPosts(): PostType[] {
    return this.posts;
  }
}

const db = InMemoryDb.getInstance();
export { db };
