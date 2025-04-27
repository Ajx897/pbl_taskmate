
import { useState } from "react";
import { Pin, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Community {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isPinned: boolean;
}

interface CommunityListProps {
  communities: Community[];
  selectedCommunity: Community | null;
  onSelectCommunity: (community: Community) => void;
  onTogglePinCommunity: (id: string) => void;
}

export function CommunityList({
  communities,
  selectedCommunity,
  onSelectCommunity,
  onTogglePinCommunity
}: CommunityListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <aside className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-[calc(100vh-64px)]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button className="w-full gap-2" onClick={() => alert("Create new community")}>
          <Plus className="h-4 w-4" />
          <span>New Community</span>
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {sortedCommunities.map(community => (
          <div
            key={community.id}
            className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
              selectedCommunity?.id === community.id ? "bg-gray-50 dark:bg-gray-700" : ""
            }`}
            onClick={() => onSelectCommunity(community)}
          >
            <div className="relative">
              <img
                src={community.avatar}
                alt={community.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {community.unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-taskbuddy-blue dark:bg-taskbuddy-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {community.unread}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium truncate dark:text-white">
                  {community.name}
                </h3>
                <div className="flex items-center">
                  {community.isPinned && <Pin className="h-3 w-3 text-gray-400 mr-1" />}
                  <span className="text-xs text-gray-500 dark:text-gray-400">{community.time}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                {community.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
