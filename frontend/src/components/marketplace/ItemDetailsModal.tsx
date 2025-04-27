
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User, Calendar, Tag, CircleDollarSign, Heart } from "lucide-react";

interface ItemDetailsModalProps {
  item: {
    id: string;
    title: string;
    price: number;
    image: string;
    seller: string;
    condition: string;
    category: string;
    postedTime: string;
    description?: string;
  } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMessageSeller?: (id: string) => void;
  onSaveItem?: (id: string) => void;
  isSaved?: boolean;
}

export function ItemDetailsModal({
  item,
  isOpen,
  onOpenChange,
  onMessageSeller,
  onSaveItem,
  isSaved = false,
}: ItemDetailsModalProps) {
  if (!item) return null;

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>

        <div className="h-64 relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded-md"
          />
          {onSaveItem && (
            <Button
              className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white"
              size="icon"
              variant="ghost"
              onClick={() => onSaveItem(item.id)}
            >
              <Heart 
                className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
              />
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center mt-1">
              <CircleDollarSign className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-lg font-bold">₹{item.price.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center text-sm">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{getInitials(item.seller)}</AvatarFallback>
              </Avatar>
              <span className="text-gray-700 dark:text-gray-300">Seller: {item.seller}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Tag className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Condition: {item.condition}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Tag className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Category: {item.category}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Posted: {item.postedTime}</span>
            </div>
          </div>
          
          {item.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          )}
          
          <Button 
            className="w-full"
            onClick={() => item && onMessageSeller?.(item.id)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Seller
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
