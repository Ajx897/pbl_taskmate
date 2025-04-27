
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, MessageSquare } from "lucide-react";

interface ItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  condition: string;
  category: string;
  postedTime: string;
  onViewDetails?: (id: string) => void;
  onMessageSeller?: (id: string) => void;
  isSelected?: boolean;
}

export function ItemCard({ 
  id, 
  title, 
  price, 
  image, 
  seller, 
  condition, 
  category,
  postedTime,
  onViewDetails,
  onMessageSeller,
  isSelected
}: ItemProps) {
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Use card view for both mobile and desktop
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${isSelected ? 'border-primary border-2' : ''}`}>
      <div className="relative h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded text-sm font-medium">
        ₹{price.toFixed(2)}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium truncate">{title}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{getInitials(seller)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-500 dark:text-gray-400">{seller}</span>
          </div>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{condition}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{postedTime}</div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewDetails?.(id)}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Details
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onMessageSeller?.(id);
          }}
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1" /> Chat
        </Button>
      </CardFooter>
    </Card>
  );
}
