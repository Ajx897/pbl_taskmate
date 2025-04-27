
import { cn } from "@/lib/utils";
import { UserPlus, Users } from "lucide-react";

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  maxMembers: number;
  avatars: string[];
}

const studyGroups: StudyGroup[] = [
  {
    id: "1",
    name: "Algorithm Masters",
    subject: "Computer Science",
    members: 4,
    maxMembers: 5,
    avatars: ["JD", "AR", "TS", "MK"],
  },
  {
    id: "2",
    name: "Calculus Study Group",
    subject: "Mathematics",
    members: 3,
    maxMembers: 6,
    avatars: ["PL", "RS", "KC"],
  },
  {
    id: "3",
    name: "Physics Lab Partners",
    subject: "Physics",
    members: 2,
    maxMembers: 3,
    avatars: ["AJ", "BT"],
  },
];

const avatarColors = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
];

export function BuddyUpSection() {
  // Generate consistent avatar color based on initials
  const getAvatarColor = (initials: string) => {
    const charCodeSum = initials.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return avatarColors[charCodeSum % avatarColors.length];
  };

  return (
    <div className="glassmorphism rounded-xl animate-enter animate-delay-500">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Buddy Up</h2>
        <button 
          className="text-xs bg-taskbuddy-purple text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-opacity-90 transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Create Group
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {studyGroups.map((group) => (
          <div 
            key={group.id}
            className="p-4 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">{group.name}</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {group.subject}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {group.avatars.map((initials, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white",
                      getAvatarColor(initials)
                    )}
                  >
                    {initials}
                  </div>
                ))}
                {group.members < group.maxMembers && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                    <UserPlus className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {group.members}/{group.maxMembers}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
        <a href="#" className="text-xs text-taskbuddy-blue font-medium hover:underline">
          Find More Groups
        </a>
      </div>
    </div>
  );
}
