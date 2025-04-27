
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Plus, Search, Users, ListTodo, UserPlus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample group data
const groups = [
  {
    id: "1",
    name: "Algorithm Masters",
    subject: "Computer Science",
    members: [
      { id: "1", name: "John Doe", avatar: "JD", role: "Leader" },
      { id: "2", name: "Alice Ray", avatar: "AR", role: "Member" },
      { id: "3", name: "Tom Smith", avatar: "TS", role: "Member" },
      { id: "4", name: "Maya Kim", avatar: "MK", role: "Member" },
    ],
    tasks: [
      { id: "1", title: "Implement quicksort algorithm", assignedTo: "1", dueDate: "2023-11-15", status: "completed" },
      { id: "2", title: "Research time complexity analysis", assignedTo: "2", dueDate: "2023-11-18", status: "in-progress" },
      { id: "3", title: "Create presentation slides", assignedTo: "3", dueDate: "2023-11-20", status: "not-started" },
      { id: "4", title: "Prepare code examples", assignedTo: "4", dueDate: "2023-11-19", status: "not-started" },
    ]
  },
  {
    id: "2",
    name: "Calculus Study Group",
    subject: "Mathematics",
    members: [
      { id: "5", name: "Peter Lee", avatar: "PL", role: "Leader" },
      { id: "6", name: "Rachel Smith", avatar: "RS", role: "Member" },
      { id: "7", name: "Kevin Chan", avatar: "KC", role: "Member" },
    ],
    tasks: [
      { id: "5", title: "Solve integration problems", assignedTo: "5", dueDate: "2023-11-16", status: "completed" },
      { id: "6", title: "Review calculus formulas", assignedTo: "6", dueDate: "2023-11-17", status: "in-progress" },
      { id: "7", title: "Write study guide", assignedTo: "7", dueDate: "2023-11-22", status: "not-started" },
    ]
  },
  {
    id: "3",
    name: "Physics Lab Partners",
    subject: "Physics",
    members: [
      { id: "8", name: "Alex Johnson", avatar: "AJ", role: "Leader" },
      { id: "9", name: "Brandon Thompson", avatar: "BT", role: "Member" },
    ],
    tasks: [
      { id: "8", title: "Conduct pendulum experiment", assignedTo: "8", dueDate: "2023-11-14", status: "completed" },
      { id: "9", title: "Record data and observations", assignedTo: "9", dueDate: "2023-11-15", status: "in-progress" },
      { id: "10", title: "Write lab report", assignedTo: "8", dueDate: "2023-11-21", status: "not-started" },
    ]
  },
];

const avatarColors = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
];

export default function BuddyUpPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>("1"); // Default select first group
  const [searchTerm, setSearchTerm] = useState("");
  const [taskView, setTaskView] = useState<"all" | "my-tasks" | "completed" | "pending">("all");
  const isMobile = useIsMobile();
  
  // Generate consistent avatar color based on initials
  const getAvatarColor = (initials: string) => {
    const charCodeSum = initials.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return avatarColors[charCodeSum % avatarColors.length];
  };
  
  const selectedGroup = groups.find(g => g.id === selectedGroupId) || null;
  
  const filteredGroups = groups.filter(group => {
    return group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           group.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const filteredTasks = selectedGroup?.tasks.filter(task => {
    if (taskView === "my-tasks") return task.assignedTo === "1"; // Assuming current user is id "1"
    if (taskView === "completed") return task.status === "completed";
    if (taskView === "pending") return task.status === "in-progress" || task.status === "not-started";
    return true; // "all" view
  }) || [];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-amber-100 text-amber-800";
      case "not-started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getMemberById = (memberId: string) => {
    return selectedGroup?.members.find(m => m.id === memberId);
  };

  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300 pt-16 md:pt-0">
        {/* Header */}
        <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">Buddy Up</h1>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 md:w-[240px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 py-2"
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Study Group</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right">
                        Name
                      </label>
                      <Input id="name" placeholder="Group name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="subject" className="text-right">
                        Subject
                      </label>
                      <Input id="subject" placeholder="Subject or course" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="description" className="text-right">
                        Description
                      </label>
                      <Input id="description" placeholder="Group description" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Group</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1">
          {/* Groups List - First Column */}
          <div className="col-span-1 border-r border-gray-200 dark:border-gray-700">
            <div className="overflow-auto h-full">
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Your Groups</h2>
                <div className="space-y-3">
                  {filteredGroups.map((group) => (
                    <Card 
                      key={group.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${group.id === selectedGroupId ? 'border-primary border-2' : ''}`}
                      onClick={() => setSelectedGroupId(group.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{group.name}</h3>
                          <Badge className="text-xs">{group.subject}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 4).map((member) => (
                              <Avatar key={member.id} className="h-7 w-7 border-2 border-white">
                                <AvatarFallback className={`text-xs ${getAvatarColor(member.avatar)}`}>
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {group.members.length > 4 && (
                              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                                +{group.members.length - 4}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {group.tasks.length} tasks
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredGroups.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No groups found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Group Details and Tasks - Second and Third Columns */}
          <div className="col-span-1 lg:col-span-2">
            {selectedGroup ? (
              <div className="h-full flex flex-col">
                {/* Group Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                      <div className="flex items-center mt-1">
                        <Badge className="mr-2">{selectedGroup.subject}</Badge>
                        <span className="text-sm text-gray-500">
                          {selectedGroup.members.length} members
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Group Member</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <Input placeholder="Search users..." className="mb-4" />
                            <div className="max-h-[300px] overflow-y-auto">
                              {/* Sample user list */}
                              {Array.from({length: 5}).map((_, index) => (
                                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback>U{index+1}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">User {index+1}</p>
                                      <p className="text-xs text-gray-500">user{index+1}@example.com</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Group Task</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="title" className="text-right">
                                Title
                              </label>
                              <Input id="title" placeholder="Task title" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="assignedTo" className="text-right">
                                Assign to
                              </label>
                              <select 
                                id="assignedTo" 
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {selectedGroup.members.map(member => (
                                  <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="dueDate" className="text-right">
                                Due Date
                              </label>
                              <Input id="dueDate" type="date" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="description" className="text-right">
                                Description
                              </label>
                              <Input id="description" placeholder="Task description" className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Create Task</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Tabs defaultValue="all" onValueChange={(value) => setTaskView(value as any)}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">All Tasks</TabsTrigger>
                        <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                {/* Tasks List */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-3">
                    {filteredTasks.map((task) => {
                      const member = getMemberById(task.assignedTo);
                      return (
                        <Card key={task.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                {task.status === "completed" ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                ) : task.status === "in-progress" ? (
                                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                                ) : (
                                  <ListTodo className="h-5 w-5 text-gray-400 mt-0.5" />
                                )}
                                <div>
                                  <h3 className="font-medium">{task.title}</h3>
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-500 mr-2">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                    <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                                      {task.status === "completed" ? "Completed" : 
                                        task.status === "in-progress" ? "In Progress" : "Not Started"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              {member && (
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className={`text-xs ${getAvatarColor(member.avatar)}`}>
                                      {member.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs ml-2">{member.name}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="p-2 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-7">Edit</Button>
                            {task.status !== "completed" && (
                              <Button variant="default" size="sm" className="h-7">
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Mark Complete
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })}
                    
                    {filteredTasks.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <ListTodo className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No tasks found</p>
                        <p className="text-sm mt-1">Create a new task to get started</p>
                        <Button className="mt-4" onClick={() => {}}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Task
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium">No group selected</h3>
                  <p className="text-sm text-gray-500 mt-1">Select a group from the list or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
