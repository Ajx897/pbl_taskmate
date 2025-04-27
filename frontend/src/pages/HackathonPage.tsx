
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Globe, 
  Code, 
  CheckCircle, 
  Clock, 
  Bookmark, 
  BookmarkPlus,
  ArrowUpDown,
  ArrowDownAZ
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Hackathon {
  id: string;
  title: string;
  date: string;
  registrationDeadline: string;
  location: string;
  type: "online" | "in-person" | "hybrid";
  participantsCount: number;
  organizer: string;
  registrationUrl: string;
  tags: string[];
  techStack: string[];
  prize: string;
  description: string;
  bgColor: string;
  isBookmarked: boolean;
}

const hackathons: Hackathon[] = [
  {
    id: "1",
    title: "AI Innovation Challenge",
    date: "2023-11-15",
    registrationDeadline: "2023-10-30",
    location: "Virtual",
    type: "online",
    participantsCount: 1200,
    organizer: "TechSolutions",
    registrationUrl: "#",
    tags: ["AI", "Machine Learning", "Big Data"],
    techStack: ["Python", "TensorFlow", "PyTorch", "AWS"],
    prize: "$10,000",
    description: "Develop innovative AI solutions to address real-world problems in healthcare, education, or sustainability.",
    bgColor: "from-blue-500/20 to-violet-500/20",
    isBookmarked: false
  },
  {
    id: "2",
    title: "Campus Coding Marathon",
    date: "2023-11-25",
    registrationDeadline: "2023-11-10",
    location: "Main University Campus",
    type: "in-person",
    participantsCount: 75,
    organizer: "CS Department",
    registrationUrl: "#",
    tags: ["Web Development", "Code Challenge", "Prizes"],
    techStack: ["JavaScript", "React", "Node.js", "MongoDB"],
    prize: "$2,500",
    description: "A 48-hour coding marathon where teams compete to build innovative web applications.",
    bgColor: "from-amber-500/20 to-orange-500/20",
    isBookmarked: true
  },
  {
    id: "3",
    title: "Sustainability Hackfest",
    date: "2023-12-10",
    registrationDeadline: "2023-12-01",
    location: "Hybrid - Innovation Center & Online",
    type: "hybrid",
    participantsCount: 320,
    organizer: "GreenTech Partners",
    registrationUrl: "#",
    tags: ["Environment", "IoT", "Clean Energy"],
    techStack: ["Arduino", "React", "Python", "IoT"],
    prize: "$5,000",
    description: "Build innovative tech solutions addressing environmental challenges and promoting sustainability.",
    bgColor: "from-green-500/20 to-emerald-500/20",
    isBookmarked: false
  },
  {
    id: "4",
    title: "BlockChain Challenge",
    date: "2023-12-20",
    registrationDeadline: "2023-12-05",
    location: "Virtual",
    type: "online",
    participantsCount: 550,
    organizer: "CryptoInnovate",
    registrationUrl: "#",
    tags: ["Blockchain", "Web3", "DeFi"],
    techStack: ["Solidity", "Ethereum", "JavaScript", "React"],
    prize: "$8,000",
    description: "Create decentralized applications that leverage blockchain technology to solve real-world problems.",
    bgColor: "from-purple-500/20 to-pink-500/20",
    isBookmarked: false
  },
  {
    id: "5",
    title: "Mobile App Innovation",
    date: "2024-01-15",
    registrationDeadline: "2024-01-05",
    location: "Tech Hub Downtown",
    type: "in-person",
    participantsCount: 200,
    organizer: "AppDevs Association",
    registrationUrl: "#",
    tags: ["Mobile", "UI/UX", "Innovation"],
    techStack: ["Swift", "Kotlin", "Flutter", "Firebase"],
    prize: "$6,000",
    description: "Design and develop mobile applications that provide innovative solutions to everyday problems.",
    bgColor: "from-sky-500/20 to-indigo-500/20",
    isBookmarked: true
  }
];

const typeIcons = {
  online: <Globe className="w-4 h-4" />,
  "in-person": <Users className="w-4 h-4" />,
  hybrid: <Code className="w-4 h-4" />,
};

export default function HackathonPage() {
  const [hackathonData, setHackathonData] = useState<Hackathon[]>(hackathons);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"deadline" | "recent" | "prize">("deadline");

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateDaysLeft = (deadlineDate: string) => {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleBookmark = (id: string) => {
    setHackathonData(prev => 
      prev.map(hackathon => 
        hackathon.id === id 
          ? { ...hackathon, isBookmarked: !hackathon.isBookmarked } 
          : hackathon
      )
    );
  };

  const handleTechStackFilter = (tech: string) => {
    setSelectedTechStack(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech) 
        : [...prev, tech]
    );
  };

  const handleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Generate a unique list of all tech stacks from all hackathons
  const allTechStacks = Array.from(
    new Set(hackathons.flatMap(h => h.techStack))
  ).sort();

  // Filter and sort hackathons
  const filteredHackathons = hackathonData
    .filter(hackathon => 
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(hackathon => 
      selectedTechStack.length === 0 || 
      hackathon.techStack.some(tech => selectedTechStack.includes(tech))
    )
    .filter(hackathon => 
      selectedTypes.length === 0 || 
      selectedTypes.includes(hackathon.type)
    )
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
      } else if (sortBy === "recent") {
        // Assuming id is sequential based on creation time
        return parseInt(b.id) - parseInt(a.id);
      } else if (sortBy === "prize") {
        // Extract numeric value from prize string
        const aValue = parseInt(a.prize.replace(/[^0-9]/g, ''));
        const bValue = parseInt(b.prize.replace(/[^0-9]/g, ''));
        return bValue - aValue;
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Hackathon Updates</h1>
          <p className="text-gray-500 mt-1">Discover and join upcoming hackathons</p>
        </header>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search hackathons by title, description or tags..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs">Event Type</DropdownMenuLabel>
                  {["online", "in-person", "hybrid"].map((type) => (
                    <DropdownMenuItem key={type} onSelect={(e) => {
                      e.preventDefault();
                      handleTypeFilter(type);
                    }} className="flex items-center gap-2">
                      <div className="w-4 h-4 border rounded flex items-center justify-center">
                        {selectedTypes.includes(type) && <CheckCircle className="h-3 w-3 text-taskbuddy-blue" />}
                      </div>
                      <span className="capitalize">{type}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs">Tech Stack</DropdownMenuLabel>
                  <div className="max-h-40 overflow-y-auto">
                    {allTechStacks.map((tech) => (
                      <DropdownMenuItem key={tech} onSelect={(e) => {
                        e.preventDefault();
                        handleTechStackFilter(tech);
                      }} className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded flex items-center justify-center">
                          {selectedTechStack.includes(tech) && <CheckCircle className="h-3 w-3 text-taskbuddy-blue" />}
                        </div>
                        <span>{tech}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setSortBy("deadline")} className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Deadline Soon</span>
                  {sortBy === "deadline" && <CheckCircle className="h-3 w-3 ml-auto text-taskbuddy-blue" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy("recent")} className="flex items-center gap-2">
                  <ArrowDownAZ className="h-4 w-4" />
                  <span>Recently Added</span>
                  {sortBy === "recent" && <CheckCircle className="h-3 w-3 ml-auto text-taskbuddy-blue" />}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy("prize")} className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Prize Amount</span>
                  {sortBy === "prize" && <CheckCircle className="h-3 w-3 ml-auto text-taskbuddy-blue" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Filter Pills */}
        {(selectedTechStack.length > 0 || selectedTypes.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedTypes.map(type => (
              <Badge 
                key={type} 
                variant="outline" 
                className="flex items-center gap-1 px-3 py-1"
                onClick={() => handleTypeFilter(type)}
              >
                <span className="capitalize">{type}</span>
                <button className="ml-1">×</button>
              </Badge>
            ))}
            
            {selectedTechStack.map(tech => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="flex items-center gap-1 px-3 py-1"
                onClick={() => handleTechStackFilter(tech)}
              >
                <span>{tech}</span>
                <button className="ml-1">×</button>
              </Badge>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => {
                setSelectedTechStack([]);
                setSelectedTypes([]);
              }}
            >
              Clear all
            </Button>
          </div>
        )}
        
        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Hackathons</TabsTrigger>
            <TabsTrigger value="bookmarked">Interested</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {filteredHackathons.length === 0 ? (
              <div className="text-center py-12 glassmorphism rounded-xl">
                <Code className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No hackathons found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHackathons.map((hackathon) => (
                  <HackathonCard 
                    key={hackathon.id} 
                    hackathon={hackathon} 
                    onBookmark={toggleBookmark} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bookmarked" className="mt-4">
            {filteredHackathons.filter(h => h.isBookmarked).length === 0 ? (
              <div className="text-center py-12 glassmorphism rounded-xl">
                <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No bookmarked hackathons</h3>
                <p className="text-gray-500 mt-2">Mark hackathons as interested to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHackathons
                  .filter(hackathon => hackathon.isBookmarked)
                  .map((hackathon) => (
                    <HackathonCard 
                      key={hackathon.id} 
                      hackathon={hackathon} 
                      onBookmark={toggleBookmark} 
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

interface HackathonCardProps {
  hackathon: Hackathon;
  onBookmark: (id: string) => void;
}

function HackathonCard({ hackathon, onBookmark }: HackathonCardProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const daysLeft = calculateDaysLeft(hackathon.registrationDeadline);
  
  function calculateDaysLeft(deadlineDate: string) {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return (
    <div 
      className={cn(
        "glassmorphism rounded-xl p-5 relative overflow-hidden transition-all hover:translate-y-[-2px]",
        "bg-gradient-to-r border border-gray-100", 
        hackathon.bgColor
      )}
    >
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/50 hover:bg-white/70"
          onClick={() => onBookmark(hackathon.id)}
        >
          {hackathon.isBookmarked ? (
            <Bookmark className="h-4 w-4 fill-taskbuddy-blue text-taskbuddy-blue" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg pr-6">{hackathon.title}</h3>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs bg-white/50 px-2 py-1 rounded-full w-fit mb-3">
        {typeIcons[hackathon.type]}
        <span className="capitalize">{hackathon.type}</span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {hackathon.description}
      </p>
      
      <div className="text-xs text-gray-600 space-y-1 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Event Date: {formatDate(hackathon.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span className="flex items-center">
            Registration Deadline: {formatDate(hackathon.registrationDeadline)}
            {daysLeft <= 7 && (
              <Badge variant="destructive" className="ml-2 text-[10px] px-1.5 py-0">
                {daysLeft <= 0 ? "Closed" : `${daysLeft} days left`}
              </Badge>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>{hackathon.participantsCount} participants</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span>{hackathon.location}</span>
        </div>
      </div>
      
      <div className="flex gap-1 flex-wrap mb-4">
        {hackathon.tags.map((tag, index) => (
          <span 
            key={index}
            className="bg-white/70 text-xs px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex gap-1 flex-wrap mb-4">
        {hackathon.techStack.map((tech, index) => (
          <span 
            key={index}
            className="bg-black/10 text-xs px-2 py-0.5 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200/30">
        <div className="text-sm font-medium">
          Prize: {hackathon.prize}
        </div>
        
        <Button 
          size="sm" 
          className="text-xs gap-1"
          onClick={() => window.open(hackathon.registrationUrl, '_blank')}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
