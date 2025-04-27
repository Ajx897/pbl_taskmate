
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CommunityList } from "@/components/community/CommunityList";
import { ChatSection } from "@/components/community/ChatSection";
import { initialCommunities, initialMessages } from "@/components/community/mockData";
import { Community, Message } from "@/components/community/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const handleSendMessage = (messageText: string) => {
    if (!selectedCommunity) return;
    
    const newMessage: Message = {
      id: String(messages.length + 1),
      senderId: "currentUser",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isOwn: true
    };
    
    setMessages([...messages, newMessage]);
    handleUserTyping();
  };

  const handleUserTyping = () => {
    if (messages.length > 0 && messages[messages.length - 1].isOwn) {
      setTimeout(() => {
        setTypingUsers(["Alex Johnson"]);
        
        setTimeout(() => {
          setTypingUsers([]);
          const newMessage: Message = {
            id: String(messages.length + 1),
            senderId: "user1",
            text: "Thanks for your message! I'll respond shortly.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            isOwn: false
          };
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          setTimeout(() => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === newMessage.id 
                  ? { ...msg, isRead: true }
                  : msg
              )
            );
          }, 2000);
        }, 2000);
      }, 1000);
    }
  };

  const togglePinCommunity = (id: string) => {
    setCommunities(prev =>
      prev.map(community =>
        community.id === id
          ? { ...community, isPinned: !community.isPinned }
          : community
      )
    );
  };

  const handleBackToList = () => {
    setSelectedCommunity(null);
  };

  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 flex flex-col md:flex-row ml-0 md:ml-64 transition-all duration-300 overflow-hidden h-screen">
        {/* Community List - hide on mobile when chat is selected */}
        {(!isMobile || (isMobile && !selectedCommunity)) && (
          <CommunityList 
            communities={communities}
            selectedCommunity={selectedCommunity}
            onSelectCommunity={setSelectedCommunity}
            onTogglePinCommunity={togglePinCommunity}
          />
        )}
        
        {/* Chat Section - show full width on mobile when chat is selected */}
        {(!isMobile || (isMobile && selectedCommunity)) && (
          <div className="flex-1 flex flex-col h-full">
            {isMobile && selectedCommunity && (
              <div className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBackToList} 
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium">Back to chats</span>
              </div>
            )}
            <ChatSection 
              selectedCommunity={selectedCommunity}
              messages={messages}
              onSendMessage={handleSendMessage}
              onTogglePinCommunity={togglePinCommunity}
              typingUsers={typingUsers}
            />
          </div>
        )}
      </main>
    </div>
  );
}
