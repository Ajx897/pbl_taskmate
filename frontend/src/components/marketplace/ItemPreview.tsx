
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, User, Calendar, Tag, CircleDollarSign, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItemPreviewProps {
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
  onMessageSeller?: (id: string) => void;
  onSaveItem?: (id: string) => void;
  isSaved?: boolean;
}

export function ItemPreview({ item, onMessageSeller, onSaveItem, isSaved = false }: ItemPreviewProps) {
  if (!item) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Select an item to view details</p>
      </div>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <div className="h-64 relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
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
      
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <div className="flex items-center mt-1">
            <CircleDollarSign className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-gray-500" />
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
      </CardContent>
    </Card>
  );
}
