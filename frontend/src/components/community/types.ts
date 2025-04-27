
export interface Community {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isPinned: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isOwn: boolean;
  reactions?: { emoji: string; count: number }[];
  attachments?: { type: string; name: string; url: string }[];
}
