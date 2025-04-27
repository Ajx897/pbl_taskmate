import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy data for messages
const initialMessages = [
  { id: 1, text: "Hi, is this item still available?", sender: "user", timestamp: "10:30 AM" },
  { id: 2, text: "Yes, it's still available. Are you interested?", sender: "seller", timestamp: "10:32 AM" },
  { id: 3, text: "I am! What's the condition of the item?", sender: "user", timestamp: "10:33 AM" },
  { id: 4, text: "It's in excellent condition, barely used.", sender: "seller", timestamp: "10:35 AM" },
];

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sellerName?: string;
  sellerImage?: string;
}

export function ChatModal({ isOpen, onOpenChange, sellerName = "Alex Johnson", sellerImage }: ChatModalProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: timeString
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Force scroll to bottom after sending a message
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => onOpenChange(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={sellerImage} alt={sellerName} />
              <AvatarFallback>{sellerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <DialogTitle className="text-lg">{sellerName}</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Chat with {sellerName} about their marketplace item
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 