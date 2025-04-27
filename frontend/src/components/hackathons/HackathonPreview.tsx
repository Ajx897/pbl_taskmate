
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, User, Calendar, Tag, Globe, Clock, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HackathonPreviewProps {
  hackathon: {
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
    daysLeft?: number;
    description?: string;
    imageUrl?: string;
  } | null;
}

export function HackathonPreview({ hackathon }: HackathonPreviewProps) {
  if (!hackathon) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Select a hackathon to view details</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const typeIcons = {
    online: <Globe className="w-4 h-4" />,
    "in-person": <Users className="w-4 h-4" />,
    hybrid: <Users className="w-4 h-4" />,
  };

  return (
    <Card className="h-full overflow-auto">
      {hackathon.imageUrl ? (
        <div className="h-48 relative">
          <img
            src={hackathon.imageUrl}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/50`}></div>
        </div>
      ) : (
        <div className={`h-4 ${hackathon.bgColor}`}></div>
      )}
      
      <CardContent className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{hackathon.title}</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              {typeIcons[hackathon.type]}
              <span className="capitalize">{hackathon.type}</span>
            </Badge>
          </div>
          
          {hackathon.daysLeft !== undefined && (
            <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 mt-2">
              <Clock className="w-4 h-4 mr-1" />
              {hackathon.daysLeft === 0 ? (
                <span>Registration closes today!</span>
              ) : hackathon.daysLeft === 1 ? (
                <span>Registration closes tomorrow!</span>
              ) : (
                <span>{hackathon.daysLeft} days left to register</span>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{formatDate(hackathon.date)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{hackathon.location}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">Organized by: {hackathon.organizer}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{hackathon.participantsCount} participants</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Technologies
          </h3>
          <div className="flex gap-2 flex-wrap">
            {hackathon.tags.map((tag, index) => (
              <Badge 
                key={index}
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {hackathon.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">About this hackathon</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {hackathon.description}
            </p>
          </div>
        )}
        
        <Button 
          className="w-full"
          onClick={() => window.open(hackathon.registrationUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Register Now
        </Button>
      </CardContent>
    </Card>
  );
}
