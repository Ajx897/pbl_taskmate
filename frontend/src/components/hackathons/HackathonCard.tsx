
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, Calendar, Globe, Users, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HackathonProps {
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
  imageUrl?: string;
  onViewDetails?: (id: string) => void;
  isSelected?: boolean;
}

export function HackathonCard({ 
  id, 
  title, 
  date, 
  location, 
  type,
  participantsCount,
  organizer,
  registrationUrl,
  tags,
  bgColor,
  daysLeft,
  imageUrl,
  onViewDetails,
  isSelected
}: HackathonProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const typeIcons = {
    online: <Globe className="w-4 h-4" />,
    "in-person": <Users className="w-4 h-4" />,
    hybrid: <Users className="w-4 h-4" />,
  };
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-shadow ${isSelected ? 'border-primary border-2' : ''}`}
    >
      {imageUrl ? (
        <div className="h-36 relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80">
              {typeIcons[type]}
              <span className="capitalize">{type}</span>
            </Badge>
          </div>
        </div>
      ) : (
        <div className={`h-2 ${bgColor}`}>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {typeIcons[type]}
              <span className="capitalize">{type}</span>
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className="p-4">
        <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>{formatDate(date)}</span>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {participantsCount} participants
          </Badge>
        </div>
        
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
          <Globe className="w-3.5 h-3.5 mr-1" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex gap-1 flex-wrap mt-2">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="text-[10px] px-1.5 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{tags.length - 3}
            </span>
          )}
        </div>
        
        {daysLeft !== undefined && (
          <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 mt-2">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {daysLeft === 0 ? (
              <span>Deadline is today!</span>
            ) : daysLeft === 1 ? (
              <span>Deadline is tomorrow!</span>
            ) : (
              <span>{daysLeft} days left</span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(id);
          }}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Details
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            window.open(registrationUrl, '_blank');
          }}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Register
        </Button>
      </CardFooter>
    </Card>
  );
}
