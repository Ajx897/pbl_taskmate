
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  CheckSquare,
  Award
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and preferences</p>
          </div>
          
          <Button 
            variant={isEditing ? "default" : "outline"} 
            className="gap-2"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <CheckSquare className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </Button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Info */}
          <div className="col-span-1">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-taskbuddy-blue to-taskbuddy-purple flex items-center justify-center text-white text-3xl font-bold">
                      JS
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 rounded-full bg-taskbuddy-blue dark:bg-taskbuddy-purple text-white p-2">
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold dark:text-white">Suresh Ramesh</h2>
                  <p className="text-gray-500 dark:text-gray-400">Computer Science</p>
                  
                  <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>
                  
                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <Input defaultValue="suresh@dypvp.edu.in" className="h-9" />
                      ) : (
                        <span className="text-sm dark:text-gray-300">suresh@dypvp.edu.in</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <Input defaultValue="+91 1238975236" className="h-9" />
                      ) : (
                        <span className="text-sm dark:text-gray-300">+91 1238975236</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      {isEditing ? (
                        <Input defaultValue="DYP DPU" className="h-9" />
                      ) : (
                        <span className="text-sm dark:text-gray-300">DYP DPU</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-sm dark:text-gray-300">Junior Year, 3rd Semester</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Study Stats */}
            <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 dark:text-white">Study Stats</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm dark:text-gray-300">Task Completion</span>
                      <span className="text-sm font-medium dark:text-gray-300">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm dark:text-gray-300">Attendance</span>
                      <span className="text-sm font-medium dark:text-gray-300">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm dark:text-gray-300">Study Hours</span>
                      <span className="text-sm font-medium dark:text-gray-300">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Achievements & Badges */}
          <div className="col-span-1 lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 dark:text-white">Achievements & Badges</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[
                    { name: "Early Bird", desc: "Complete 5 tasks before their deadline", icon: "🌅", unlocked: true },
                    { name: "Perfect Attendance", desc: "100% attendance for a month", icon: "🏆", unlocked: true },
                    { name: "Study Guru", desc: "Log 50+ hours of study time", icon: "📚", unlocked: true },
                    { name: "Team Player", desc: "Join 3 group study sessions", icon: "👥", unlocked: false },
                    { name: "Question Master", desc: "Answer 20 community questions", icon: "❓", unlocked: false },
                    { name: "Resource Champion", desc: "Share 10 study resources", icon: "📂", unlocked: false },
                    { name: "Task Machine", desc: "Complete 100 tasks", icon: "✅", unlocked: false },
                    { name: "Hackathon Hero", desc: "Participate in a hackathon", icon: "💻", unlocked: true }
                  ].map((badge, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border flex flex-col items-center text-center ${
                        badge.unlocked 
                          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                          : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 opacity-60'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="text-sm font-medium mb-1 dark:text-white">{badge.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
