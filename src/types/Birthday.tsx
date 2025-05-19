export interface Birthday {
  id: string;
  name: string;
  date: string;
  avatar: string;
  wish?: string;
  giftIdeas?: string;
  notificationIds?: {
    birthday: string;
    headsUp: string;
  };
}
