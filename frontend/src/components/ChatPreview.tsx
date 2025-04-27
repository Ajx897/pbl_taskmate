
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  message: string;
  time: string;
  unread: boolean;
}

const messages: ChatMessage[] = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      avatar: "AJ",
      isOnline: true,
    },
    message: "Has anyone started on the database assignment yet?",
    time: "10:45 AM",
    unread: true,
  },
  {
    id: "2",
    user: {
      name: "Sophia Lee",
      avatar: "SL",
      isOnline: false,
    },
    message: "I could use some help with the physics problem set, specifically question 4.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    user: {
      name: "Programming Study Group",
      avatar: "PSG",
      isOnline: true,
    },
    message: "Meeting today at 5pm in the library to go over the upcoming project.",
    time: "Yesterday",
    unread: true,
  },
];

const avatarColors = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
];

export function ChatPreview() {
  // Function to generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return avatarColors[charCodeSum % avatarColors.length];
  };

  return (
    <div className="glassmorphism rounded-xl animate-enter animate-delay-400">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-3"
          >
            <div className="relative flex-shrink-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                getAvatarColor(msg.user.name)
              )}>
                {msg.user.avatar}
              </div>
              {msg.user.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium truncate">{msg.user.name}</h3>
                <span className="text-xs text-gray-500 flex-shrink-0">{msg.time}</span>
              </div>
              <p className={cn(
                "text-xs truncate mt-0.5",
                msg.unread ? "text-taskbuddy-text font-medium" : "text-gray-500"
              )}>
                {msg.message}
              </p>
            </div>
            
            {msg.unread && (
              <div className="w-2 h-2 rounded-full bg-taskbuddy-blue flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
        <a href="#" className="text-xs text-taskbuddy-blue font-medium hover:underline">
          Open Chat
        </a>
      </div>
    </div>
  );
}
