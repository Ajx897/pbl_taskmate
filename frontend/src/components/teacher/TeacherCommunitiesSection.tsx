
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Plus, Users, MessageSquare, Copy, CalendarDays, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initialCommunities } from "@/components/community/mockData";
import { Community } from "@/components/community/types";
import { CreateCommunityModal } from "@/components/teacher/CreateCommunityModal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/ChatInput";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isTeacher: boolean;
}

interface TeacherCommunitiesSectionProps {
  onAddDeadline?: (communityId?: string) => void;
}

export function TeacherCommunitiesSection({ onAddDeadline }: TeacherCommunitiesSectionProps) {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const { toast } = useToast();

  const handleCreateCommunity = (newCommunity: {
    name: string;
    subject?: string;
    joiningCode: string;
  }) => {
    const communityToAdd: Community = {
      id: `comm-${Date.now()}`,
      name: newCommunity.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newCommunity.name)}&background=random`,
      lastMessage: "Community created",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      isPinned: false,
      joiningCode: newCommunity.joiningCode,
      subject: newCommunity.subject
    };

    setCommunities(prev => [communityToAdd, ...prev]);
    
    toast({
      title: "Community created",
      description: `${newCommunity.name} has been created successfully`
    });
  };

  const copyJoiningCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "You can now share this code with your students"
    });
  };

  const handleAddDeadline = (communityId?: string) => {
    if (onAddDeadline) {
      onAddDeadline(communityId);
    }
  };

  const handleViewChat = (community: Community) => {
    setSelectedCommunity(community);
    
    // Initialize messages for this community if they don't exist
    if (!messages[community.id]) {
      setMessages(prev => ({
        ...prev,
        [community.id]: [
          {
            id: `msg-${Date.now()}-1`,
            senderId: "teacher",
            senderName: "Teacher",
            text: "Welcome to the community chat! This is where you can communicate with your students and share important updates.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isTeacher: true
          }
        ]
      }));
    }
  };

  const handleSendMessage = (text: string) => {
    if (!selectedCommunity) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "teacher",
      senderName: "Teacher",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: true
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedCommunity.id]: [...(prev[selectedCommunity.id] || []), newMessage]
    }));
    
    // Update the community's last message
    setCommunities(prev => 
      prev.map(c => 
        c.id === selectedCommunity.id 
          ? { ...c, lastMessage: text, time: newMessage.timestamp } 
          : c
      )
    );
  };

  const backToCommunitiesList = () => {
    setSelectedCommunity(null);
  };

  if (selectedCommunity) {
    return (
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={backToCommunitiesList} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Communities
          </Button>
          <h2 className="text-xl font-semibold">{selectedCommunity.name}</h2>
          {selectedCommunity.subject && (
            <Badge variant="outline">{selectedCommunity.subject}</Badge>
          )}
        </div>
        
        <Card className="flex-1 flex flex-col">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedCommunity.avatar} alt={selectedCommunity.name} />
                <AvatarFallback>{selectedCommunity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{selectedCommunity.name}</CardTitle>
                <CardDescription>
                  Code: {selectedCommunity.joiningCode}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              {messages[selectedCommunity.id]?.map((message) => (
                <div key={message.id} className={`mb-4 flex ${message.isTeacher ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.isTeacher
                        ? 'bg-taskbuddy-blue text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {message.senderName}
                    </div>
                    <p className="text-sm">{message.text}</p>
                    <div className="text-xs mt-1">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <ChatInput 
              onSendMessage={handleSendMessage}
              placeholder="Type a message..."
              onTyping={() => {}}
              onStopTyping={() => {}}
            />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Communities</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Community
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
          <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={community.avatar} 
                    alt={community.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div>{community.name}</div>
                  {community.subject && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {community.subject}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              {community.joiningCode && (
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Joining Code: <span className="font-mono font-medium">{community.joiningCode}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyJoiningCode(community.joiningCode!)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>32 members</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>15 messages</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>3 deadlines</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex gap-2">
              <Button 
                variant="secondary" 
                className="gap-2 flex-1"
                onClick={() => handleViewChat(community)}
              >
                <MessageSquare className="h-4 w-4" />
                View Chat
              </Button>
              <Button 
                className="gap-2 flex-1" 
                onClick={() => handleAddDeadline(community.id)}
              >
                <CalendarDays className="h-4 w-4" />
                Add Deadline
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No communities yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
            Create a community to start sharing deadlines and communicating with your students.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Community
          </Button>
        </div>
      )}

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCommunity={handleCreateCommunity}
      />
    </div>
  );
}
