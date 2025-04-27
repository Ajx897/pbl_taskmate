
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, Copy, Users } from "lucide-react";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCommunity: (community: {
    name: string;
    subject?: string;
    joiningCode: string;
  }) => void;
}

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Geography",
  "Economics",
  "Other"
];

export function CreateCommunityModal({ isOpen, onClose, onCreateCommunity }: CreateCommunityModalProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [joiningCode, setJoiningCode] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a community name",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Generate a random joining code (department code + random string)
    const prefix = subject ? subject.substring(0, 2).toUpperCase() : "CM";
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const generatedCode = `${prefix}-${randomCode}`;
    
    setJoiningCode(generatedCode);

    // Create the community
    onCreateCommunity({
      name,
      subject: subject || undefined,
      joiningCode: generatedCode
    });

    setIsCreating(false);
  };

  const handleClose = () => {
    setName("");
    setSubject("");
    setJoiningCode("");
    onClose();
  };

  const copyJoiningCode = () => {
    navigator.clipboard.writeText(joiningCode);
    toast({
      title: "Copied to clipboard",
      description: "You can now share this code with your students"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{joiningCode ? "Community Created!" : "Create New Community"}</DialogTitle>
          <DialogDescription>
            {joiningCode 
              ? "Share this code with your students to let them join the community." 
              : "Create a new community for your students to join and interact."}
          </DialogDescription>
        </DialogHeader>
        
        {!joiningCode ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <Input 
                  id="name" 
                  placeholder="e.g., CS101 Class Community" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full flex items-center gap-2">
                  {subject && <Book className="h-4 w-4" />}
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="py-6">
            <div className="rounded-lg border p-4 flex flex-col items-center justify-center space-y-3">
              <div className="text-sm text-gray-500">Joining Code</div>
              <div className="text-2xl font-bold tracking-wider">{joiningCode}</div>
              <Button variant="outline" size="sm" onClick={copyJoiningCode} className="mt-2">
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          {!joiningCode ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                Create Community
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
