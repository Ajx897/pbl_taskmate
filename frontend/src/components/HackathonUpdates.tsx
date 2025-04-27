
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Code, Globe, Users, Calendar, ExternalLink } from "lucide-react";

interface Hackathon {
  id: string;
  title: string;
  date: string;
  location: string;
  type: "online" | "in-person" | "hybrid";
  participantsCount: number;
  organizer: string;
  registrationUrl: string;
  tags: string[];
  bgColor: string;
}

const hackathons: Hackathon[] = [
  {
    id: "1",
    title: "AI Innovation Challenge",
    date: "2023-11-15",
    location: "Virtual",
    type: "online",
    participantsCount: 1200,
    organizer: "TechSolutions",
    registrationUrl: "#",
    tags: ["AI", "Machine Learning", "Big Data"],
    bgColor: "from-blue-500/20 to-violet-500/20",
  },
  {
    id: "2",
    title: "Campus Coding Marathon",
    date: "2023-11-25",
    location: "Main University Campus",
    type: "in-person",
    participantsCount: 75,
    organizer: "CS Department",
    registrationUrl: "#",
    tags: ["Web Development", "Code Challenge", "Prizes"],
    bgColor: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "3",
    title: "Sustainability Hackfest",
    date: "2023-12-10",
    location: "Hybrid - Innovation Center & Online",
    type: "hybrid",
    participantsCount: 320,
    organizer: "GreenTech Partners",
    registrationUrl: "#",
    tags: ["Environment", "IoT", "Clean Energy"],
    bgColor: "from-green-500/20 to-emerald-500/20",
  },
];

const typeIcons = {
  online: <Globe className="w-4 h-4" />,
  "in-person": <Users className="w-4 h-4" />,
  hybrid: <Code className="w-4 h-4" />,
};

export function HackathonUpdates() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="glassmorphism rounded-xl animate-enter animate-delay-500">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Hackathon Updates</h2>
        <Button variant="outline" size="sm" className="text-xs">
          View All
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        {hackathons.map((hackathon) => (
          <div 
            key={hackathon.id}
            className={cn(
              "rounded-lg p-4 relative overflow-hidden transition-all hover:translate-y-[-2px]",
              "bg-gradient-to-r border border-gray-100", 
              hackathon.bgColor
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-sm">{hackathon.title}</h3>
              <div className="flex items-center gap-1 text-xs bg-white/50 px-2 py-0.5 rounded-full">
                {typeIcons[hackathon.type]}
                <span className="capitalize">{hackathon.type}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 space-y-1 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(hackathon.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{hackathon.participantsCount} participants</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{hackathon.location}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {hackathon.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-white/70 text-[10px] px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <Button 
                size="sm" 
                className="text-xs gap-1"
                onClick={() => window.open(hackathon.registrationUrl, '_blank')}
              >
                Register
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center">
        <a href="#" className="text-xs text-taskbuddy-blue font-medium hover:underline">
          Submit Your Hackathon
        </a>
      </div>
    </div>
  );
}
