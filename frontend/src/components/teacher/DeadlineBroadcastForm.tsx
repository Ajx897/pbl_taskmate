
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Paperclip, Send, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { initialCommunities } from "@/components/community/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DeadlineBroadcastFormProps {
  onComplete?: () => void;
  preselectedCommunityId?: string;
}

export function DeadlineBroadcastForm({ onComplete, preselectedCommunityId }: DeadlineBroadcastFormProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [targetCommunity, setTargetCommunity] = useState(preselectedCommunityId || "");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendType, setSendType] = useState(preselectedCommunityId ? "community" : "class"); // "class" or "community"
  const { toast } = useToast();

  // Get communities for the dropdown
  const communities = initialCommunities;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !subject || !date || !time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (sendType === "class" && !targetClass) {
      toast({
        title: "Missing Information",
        description: "Please select a class",
        variant: "destructive",
      });
      return;
    }
    
    if (sendType === "community" && !targetCommunity) {
      toast({
        title: "Missing Information",
        description: "Please select a community",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Combine date and time
    const deadlineDate = date ? new Date(date) : new Date();
    if (time) {
      const [hours, minutes] = time.split(":");
      deadlineDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }
    
    // Simulate API call
    setTimeout(() => {
      const recipient = sendType === "community"
        ? `community: ${communities.find(c => c.id === targetCommunity)?.name}` 
        : `class: ${targetClass}`;
      
      toast({
        title: "Deadline Broadcast Sent",
        description: `Successfully sent to ${recipient}`,
      });
      
      // Reset form
      setTitle("");
      setSubject("");
      setDescription("");
      setDate(undefined);
      setTime("");
      setTargetClass("");
      setTargetCommunity("");
      setFiles(null);
      setIsSubmitting(false);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          placeholder="Assignment Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="History">History</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description / Instructions</Label>
        <Textarea 
          id="description" 
          placeholder="Detailed instructions for the assignment..." 
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Deadline Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Deadline Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="time" 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>Send to</Label>
        <Tabs value={sendType} onValueChange={setSendType} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="class" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Class/Group</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Community Chat</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="class">
            <Select value={targetClass} onValueChange={setTargetClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Class-9A">Class 9-A</SelectItem>
                <SelectItem value="Class-9B">Class 9-B</SelectItem>
                <SelectItem value="Class-10A">Class 10-A</SelectItem>
                <SelectItem value="Class-10B">Class 10-B</SelectItem>
                <SelectItem value="Math Club">Math Club</SelectItem>
                <SelectItem value="Science Club">Science Club</SelectItem>
              </SelectContent>
            </Select>
          </TabsContent>
          
          <TabsContent value="community">
            <Select value={targetCommunity} onValueChange={setTargetCommunity}>
              <SelectTrigger>
                <SelectValue placeholder="Select Community" />
              </SelectTrigger>
              <SelectContent>
                {communities.map(community => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {targetCommunity && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This deadline will appear as a special message in the community chat and can be added to students' calendars.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments (Optional)</Label>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Attach Files
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setFiles(e.target.files)}
          />
          <span className="text-sm text-muted-foreground">
            {files ? `${files.length} file(s) selected` : "No files selected"}
          </span>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Deadline Broadcast
          </>
        )}
      </Button>
    </form>
  );
}
