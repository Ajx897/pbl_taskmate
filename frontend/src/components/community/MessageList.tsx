
import { Check, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isOwn: boolean;
  reactions?: { emoji: string; count: number }[];
  attachments?: { type: string; name: string; url: string }[];
}

interface MessageListProps {
  messages: Message[];
  typingUsers: string[];
}

export function MessageList({ messages, typingUsers }: MessageListProps) {
  const getSenderName = (senderId: string): string => {
    if (senderId === "user1") return "Alex Johnson";
    if (senderId === "user2") return "Taylor Smith";
    if (senderId === "user3") return "Jordan Lee";
    return senderId;
  };

  return (
    <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                message.isOwn
                  ? 'bg-taskbuddy-blue dark:bg-taskbuddy-purple text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
              }`}
            >
              {!message.isOwn && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {getSenderName(message.senderId)}
                </div>
              )}
              <p className="text-sm">{message.text}</p>
              
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 p-2 bg-white/20 dark:bg-black/20 rounded flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{message.attachments[0].name}</span>
                </div>
              )}
              
              {message.reactions && message.reactions.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {message.reactions.map((reaction, index) => (
                    <div key={index} className="bg-white/20 dark:bg-black/20 rounded-full px-2 py-0.5 text-xs flex items-center">
                      <span>{reaction.emoji}</span>
                      <span className="ml-1">{reaction.count}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={`text-xs mt-1 flex items-center gap-1 ${message.isOwn ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                {message.timestamp}
                {message.isOwn && (
                  <span className="ml-1">
                    {message.isRead ? (
                      <Check className="h-3 w-3 text-white/70" />
                    ) : (
                      <Check className="h-3 w-3 text-white/50" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {typingUsers.length > 0 && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <span>{typingUsers.join(", ")} is typing</span>
              <span className="flex">
                <span className="animate-bounce mx-0.5">.</span>
                <span className="animate-bounce animation-delay-200 mx-0.5">.</span>
                <span className="animate-bounce animation-delay-400 mx-0.5">.</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
