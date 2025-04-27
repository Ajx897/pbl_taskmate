
import { Community, Message } from "./types";

export const initialCommunities: Community[] = [
  {
    id: "1",
    name: "Computer Science 101",
    avatar: "https://i.pravatar.cc/150?img=10",
    lastMessage: "Don't forget the assignment due tonight!",
    time: "12:45 PM",
    unread: 3,
    isPinned: true
  },
  {
    id: "2",
    name: "Mathematics Study Group",
    avatar: "https://i.pravatar.cc/150?img=11",
    lastMessage: "I've shared some practice problems",
    time: "Yesterday",
    unread: 0,
    isPinned: true
  },
  {
    id: "3",
    name: "Physics Lab Partners",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Let's meet at the library at 5pm",
    time: "Yesterday",
    unread: 2,
    isPinned: false
  },
  {
    id: "4",
    name: "Design Project Team",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastMessage: "Updated the prototypes, please review",
    time: "2 days ago",
    unread: 0,
    isPinned: false
  },
  {
    id: "5",
    name: "Campus Events",
    avatar: "https://i.pravatar.cc/150?img=14",
    lastMessage: "New hackathon announced for next month!",
    time: "3 days ago",
    unread: 0,
    isPinned: false
  }
];

export const initialMessages: Message[] = [
  {
    id: "1",
    senderId: "user1",
    text: "Hey everyone! Has anyone started the programming assignment yet?",
    timestamp: "10:30 AM",
    isRead: true,
    isOwn: false
  },
  {
    id: "2",
    senderId: "user2",
    text: "I've just started looking at it. Seems challenging!",
    timestamp: "10:32 AM",
    isRead: true,
    isOwn: false
  },
  {
    id: "3",
    senderId: "user3",
    text: "I found some helpful resources on the topic. Let me share them with you all.",
    timestamp: "10:35 AM",
    isRead: true,
    isOwn: false,
    attachments: [
      { type: "pdf", name: "CS101_Resources.pdf", url: "#" }
    ]
  },
  {
    id: "4",
    senderId: "currentUser",
    text: "Thanks for sharing! I was struggling with the first problem.",
    timestamp: "10:40 AM",
    isRead: true,
    isOwn: true
  },
  {
    id: "5",
    senderId: "user1",
    text: "No problem! Let's meet at the library tonight if anyone wants to work together.",
    timestamp: "10:42 AM",
    isRead: true,
    isOwn: false,
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "🙌", count: 2 }
    ]
  },
  {
    id: "6",
    senderId: "currentUser",
    text: "That sounds great! What time were you thinking?",
    timestamp: "10:45 AM",
    isRead: true,
    isOwn: true
  },
  {
    id: "7",
    senderId: "user2",
    text: "How about 7pm? That gives us enough time to grab dinner first.",
    timestamp: "10:50 AM",
    isRead: true,
    isOwn: false
  },
  {
    id: "8",
    senderId: "user3",
    text: "Works for me! I'll reserve a study room.",
    timestamp: "10:55 AM",
    isRead: true,
    isOwn: false
  },
  {
    id: "9",
    senderId: "user1",
    text: "Perfect! See you all at 7pm then.",
    timestamp: "11:00 AM",
    isRead: true,
    isOwn: false,
    reactions: [
      { emoji: "👍", count: 4 }
    ]
  }
];
