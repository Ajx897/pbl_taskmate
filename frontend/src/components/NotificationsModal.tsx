
import { Bell, BookOpen, Award, Calendar, ShoppingBag, Clock, MessageSquare, Trophy } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NotificationType = "assignment" | "deadline" | "grade" | "marketplace" | "hackathon" | "chat";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "assignment",
    message: "New assignment posted in CS202",
    time: "1h ago",
    read: false,
    link: "/tasks"
  },
  {
    id: "2",
    type: "deadline",
    message: "Physics report due tomorrow",
    time: "3h ago",
    read: true,
    link: "/tasks"
  },
  {
    id: "3",
    type: "grade",
    message: "You received an A on your Math quiz",
    time: "Yesterday",
    read: true,
  },
  {
    id: "4",
    type: "marketplace",
    message: "Someone is interested in your Calculus textbook",
    time: "2 days ago",
    read: false,
    link: "/marketplace"
  },
  {
    id: "5",
    type: "hackathon",
    message: "AI Innovation Challenge starts in 3 days",
    time: "3 days ago",
    read: true,
    link: "/hackathons"
  },
  {
    id: "6",
    type: "chat",
    message: "New message from Alex in CS Study Group",
    time: "4 days ago",
    read: true,
    link: "/community"
  },
  {
    id: "7",
    type: "marketplace",
    message: "Price reduced on TI-84 Calculator",
    time: "5 days ago",
    read: true,
    link: "/marketplace"
  },
  {
    id: "8",
    type: "hackathon",
    message: "New hackathon: Mobile App Innovation",
    time: "1 week ago",
    read: true,
    link: "/hackathons"
  },
];

const notificationIcons: Record<NotificationType, JSX.Element> = {
  assignment: <BookOpen className="w-4 h-4" />,
  deadline: <Calendar className="w-4 h-4" />,
  grade: <Award className="w-4 h-4" />,
  marketplace: <ShoppingBag className="w-4 h-4" />,
  hackathon: <Trophy className="w-4 h-4" />,
  chat: <MessageSquare className="w-4 h-4" />
};

interface NotificationsModalProps {
  trigger?: React.ReactNode;
}

export function NotificationsModal({ trigger }: NotificationsModalProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getNotificationIcon = (type: NotificationType) => {
    return notificationIcons[type] || <Bell className="w-4 h-4" />;
  };
  
  const getNotificationColorClass = (type: NotificationType) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "deadline":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "grade":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "marketplace":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "hackathon":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "chat":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="relative p-2 rounded-full bg-white/10 dark:bg-gray-700 hover:bg-white/20 dark:hover:bg-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] p-[2px] bg-red-500 rounded-full border-2 border-white dark:border-gray-800 text-[10px] font-medium text-white">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ScrollArea className="max-h-[60vh]">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors flex gap-3",
                      !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                    )}
                    onClick={() => {
                      notification.link && window.location.pathname !== notification.link && 
                      (window.location.href = notification.link);
                    }}
                    style={{ cursor: notification.link ? 'pointer' : 'default' }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      getNotificationColorClass(notification.type)
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm",
                        !notification.read && "font-medium"
                      )}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-taskbuddy-purple flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread">
            <ScrollArea className="max-h-[60vh]">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.filter(n => !n.read).map((notification) => (
                  <div 
                    key={notification.id}
                    className="p-4 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors flex gap-3"
                    onClick={() => {
                      notification.link && window.location.pathname !== notification.link && 
                      (window.location.href = notification.link);
                    }}
                    style={{ cursor: notification.link ? 'pointer' : 'default' }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      getNotificationColorClass(notification.type)
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                    </div>
                    
                    <div className="w-2 h-2 rounded-full bg-taskbuddy-purple flex-shrink-0 mt-2" />
                  </div>
                ))}
                
                {notifications.filter(n => !n.read).length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No unread notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
