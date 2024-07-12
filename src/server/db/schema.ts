export interface PostType {
  id: string;
  channelId: string;
  author: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
