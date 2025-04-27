import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Search, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { HackathonCard } from "@/components/hackathons/HackathonCard";
import { HackathonFilterModal } from "@/components/hackathons/HackathonFilterModal";
import { HackathonDetailsModal } from "@/components/hackathons/HackathonDetailsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample hackathon data
const hackathons = [
  {
    id: "1",
    title: "AI Innovation Challenge",
    date: "2023-11-15",
    location: "Virtual",
    type: "online" as const,
    participantsCount: 1200,
    organizer: "TechSolutions",
    registrationUrl: "#",
    tags: ["AI", "Machine Learning", "Big Data"],
    bgColor: "bg-gradient-to-r from-blue-500/20 to-violet-500/20",
    daysLeft: 5,
    description: "Join our AI Innovation Challenge and solve real-world problems using artificial intelligence and machine learning. Prizes worth $10,000 to be won!",
    imageUrl: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    title: "Campus Coding Marathon",
    date: "2023-11-25",
    location: "Main University Campus",
    type: "in-person" as const,
    participantsCount: 75,
    organizer: "CS Department",
    registrationUrl: "#",
    tags: ["Web Development", "Code Challenge", "Prizes"],
    bgColor: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
    daysLeft: 2,
    description: "A 24-hour coding marathon at the university campus. Form teams of 2-4 members and build something awesome. Food and energy drinks provided!"
  },
  {
    id: "3",
    title: "Sustainability Hackfest",
    date: "2023-12-10",
    location: "Hybrid - Innovation Center & Online",
    type: "hybrid" as const,
    participantsCount: 320,
    organizer: "GreenTech Partners",
    registrationUrl: "#",
    tags: ["Environment", "IoT", "Clean Energy"],
    bgColor: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
    daysLeft: 15,
    description: "Build solutions for a sustainable future. This hackathon focuses on environmental challenges and using technology to address climate change.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "4",
    title: "Blockchain Challenge",
    date: "2023-12-18",
    location: "Online - Discord Community",
    type: "online" as const,
    participantsCount: 450,
    organizer: "CryptoDevs",
    registrationUrl: "#",
    tags: ["Blockchain", "Web3", "Smart Contracts", "Cryptocurrency"],
    bgColor: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20",
    daysLeft: 21,
    description: "Develop innovative applications using blockchain technology. Whether you're a blockchain expert or just getting started, this hackathon welcomes all skill levels."
  },
  {
    id: "5",
    title: "Mobile App Innovation",
    date: "2024-01-05",
    location: "Tech Hub Downtown",
    type: "in-person" as const,
    participantsCount: 120,
    organizer: "AppDevelopers Association",
    registrationUrl: "#",
    tags: ["Mobile Apps", "Android", "iOS", "UI/UX"],
    bgColor: "bg-gradient-to-r from-red-500/20 to-pink-500/20",
    daysLeft: 30,
    description: "Create cutting-edge mobile applications that solve real user problems. Expert mentors will be available throughout the event to help you build and refine your app.",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export default function HackathonsPage() {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    techStack: [] as string[],
    mode: "all" as "all" | "online" | "in-person" | "hybrid",
    deadlineSoon: false
  });
  const isMobile = useIsMobile();
  
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  const handleViewDetails = (id: string) => {
    setSelectedHackathonId(id);
    setIsDetailsModalOpen(true);
  };
  
  const selectedHackathon = hackathons.find(h => h.id === selectedHackathonId) || null;
  
  const filteredHackathons = hackathons.filter(hackathon => {
    // Filter by search term
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         hackathon.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by mode
    const matchesMode = filters.mode === "all" || hackathon.type === filters.mode;
    
    // Filter by tech stack
    const matchesTechStack = filters.techStack.length === 0 || 
                           hackathon.tags.some(tag => filters.techStack.includes(tag));
    
    // Filter by deadline
    const matchesDeadline = !filters.deadlineSoon || 
                          (hackathon.daysLeft !== undefined && hackathon.daysLeft <= 7);
    
    return matchesSearch && matchesMode && matchesTechStack && matchesDeadline;
  });
  
  // Sort hackathons by deadline (closest first)
  const sortedHackathons = [...filteredHackathons].sort((a, b) => {
    if (a.daysLeft === undefined) return 1;
    if (b.daysLeft === undefined) return -1;
    return a.daysLeft - b.daysLeft;
  });

  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300 pt-16 md:pt-0">
        {/* Header */}
        <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">Hackathons</h1>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 md:w-[240px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hackathons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 py-2"
                />
              </div>
              
              <HackathonFilterModal onApplyFilters={handleApplyFilters} />
            </div>
          </div>
          
          {filters.techStack.length > 0 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
              <span className="text-xs text-gray-500">Filters:</span>
              {filters.techStack.map(tech => (
                <div key={tech} className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {tech}
                </div>
              ))}
              {filters.mode !== "all" && (
                <div className="text-xs bg-secondary px-2 py-1 rounded-full capitalize">
                  {filters.mode}
                </div>
              )}
              {filters.deadlineSoon && (
                <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                  Deadline Soon
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2"
                onClick={() => setFilters({
                  techStack: [],
                  mode: "all",
                  deadlineSoon: false
                })}
              >
                Clear All
              </Button>
            </div>
          )}
        </header>
        
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedHackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                {...hackathon}
                onViewDetails={handleViewDetails}
                isSelected={hackathon.id === selectedHackathonId}
              />
            ))}
            
            {sortedHackathons.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <p className="text-gray-500 dark:text-gray-400 mb-2">No hackathons found</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    techStack: [],
                    mode: "all",
                    deadlineSoon: false
                  });
                }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <HackathonDetailsModal
        hackathon={selectedHackathon}
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
    </div>
  );
}
