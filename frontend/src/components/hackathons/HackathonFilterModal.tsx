
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, Check, SlidersHorizontal } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface HackathonFilterModalProps {
  onApplyFilters: (filters: {
    techStack: string[];
    mode: "all" | "online" | "in-person" | "hybrid";
    deadlineSoon: boolean;
  }) => void;
}

const techOptions = [
  "AI", "Machine Learning", "Web Development", "Mobile Apps", 
  "Blockchain", "Cloud", "IoT", "Gaming", "AR/VR",
  "Big Data", "Cybersecurity", "DevOps"
];

export function HackathonFilterModal({ onApplyFilters }: HackathonFilterModalProps) {
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [mode, setMode] = useState<"all" | "online" | "in-person" | "hybrid">("all");
  const [deadlineSoon, setDeadlineSoon] = useState(false);
  const isMobile = useIsMobile();

  const handleTechStackChange = (tech: string) => {
    setSelectedTechStack(current => 
      current.includes(tech)
        ? current.filter(t => t !== tech)
        : [...current, tech]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      techStack: selectedTechStack,
      mode,
      deadlineSoon,
    });
  };

  const handleClearFilters = () => {
    setSelectedTechStack([]);
    setMode("all");
    setDeadlineSoon(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
        <SheetHeader>
          <SheetTitle>Filter Hackathons</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Hackathon Mode</h3>
            <Select value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online Only</SelectItem>
                <SelectItem value="in-person">In-Person Only</SelectItem>
                <SelectItem value="hybrid">Hybrid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="deadline-soon" className="text-sm font-medium">Deadline Soon</Label>
              <Switch 
                id="deadline-soon" 
                checked={deadlineSoon}
                onCheckedChange={setDeadlineSoon}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Show hackathons with registration closing in less than 7 days</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Tech Stack</h3>
              {selectedTechStack.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedTechStack([])}>
                  Clear
                </Button>
              )}
            </div>
            
            {selectedTechStack.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTechStack.map(tech => (
                  <Badge 
                    key={tech} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleTechStackChange(tech)}
                  >
                    {tech} <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              {techOptions.map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tech-${tech}`} 
                    checked={selectedTechStack.includes(tech)}
                    onCheckedChange={() => handleTechStackChange(tech)}
                  />
                  <Label htmlFor={`tech-${tech}`} className="text-sm">{tech}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleClearFilters}
            >
              Reset
            </Button>
            <Button 
              onClick={handleApplyFilters} 
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" /> Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
