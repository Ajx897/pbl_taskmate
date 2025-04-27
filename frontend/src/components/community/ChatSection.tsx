
import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Bell,
  Users,
  MoreVertical,
  Pin,
  Plus
} from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageList } from "./MessageList";
import { ResourcesList } from "./ResourcesList";

interface Community {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isPinned: boolean;
}

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

interface ChatSectionProps {
  selectedCommunity: Community | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onTogglePinCommunity: (id: string) => void;
  typingUsers: string[];
}

export function ChatSection({
  selectedCommunity,
  messages,
  onSendMessage,
  onTogglePinCommunity,
  typingUsers
}: ChatSectionProps) {
  if (!selectedCommunity) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Community Selected</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            Select a community from the list or create a new one to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={selectedCommunity.avatar}
            alt={selectedCommunity.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold dark:text-white">{selectedCommunity.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">32 members</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onTogglePinCommunity(selectedCommunity.id)}>
            <Pin className={`h-5 w-5 ${selectedCommunity.isPinned ? 'text-taskbuddy-blue dark:text-taskbuddy-purple' : 'text-gray-500'}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Mute notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>View members</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Files & media</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="p-2 w-full justify-start bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-none gap-2">
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Resources</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col mt-0 pt-0 p-0">
          <MessageList messages={messages} typingUsers={typingUsers} />
          <ChatInput 
            onSendMessage={onSendMessage}
            placeholder="Type a message..."
            onTyping={() => {}} 
            onStopTyping={() => {}}
          />
        </TabsContent>
        
        <TabsContent value="resources" className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 mt-0">
          <ResourcesList />
        </TabsContent>
        
        <TabsContent value="tasks" className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 mt-0">
          <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold dark:text-white">Group Tasks</h3>
              <Button className="gap-2" size="sm">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </Button>
            </div>
            
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No tasks created yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Create tasks for your study group
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
