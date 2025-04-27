import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Edit3,
  LogOut,
  UserRound,
  Mail,
  Clock,
  ShieldCheck,
  Smartphone
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/sign-in"; // Redirect to login page
  };
  return (
    <div className="min-h-screen flex bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 p-6 ml-0 md:ml-64 transition-all duration-300">
        <header className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your preferences and account settings</p>
        </header>
        
        <div className="max-w-3xl mx-auto">
          {/* Theme Settings */}
          <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-taskbuddy-blue/10 dark:bg-taskbuddy-purple/20 text-taskbuddy-blue dark:text-taskbuddy-purple">
                <Sun className={`h-6 w-6 ${theme === 'dark' ? 'hidden' : 'block'}`} />
                <Moon className={`h-6 w-6 ${theme === 'light' ? 'hidden' : 'block'}`} />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold dark:text-white">Appearance</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Switch between light and dark themes based on your preference
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-500" />
                    <span className="text-sm dark:text-gray-300">Light Mode</span>
                  </div>
                  
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-indigo-400 dark:text-indigo-300" />
                    <span className="text-sm dark:text-gray-300">Dark Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500">
                <Bell className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold dark:text-white">Notifications</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Configure how you want to be notified about activities and updates
                </p>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Task Reminders</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify me about upcoming deadlines</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Community Messages</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Marketplace Updates</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new listings and price changes</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Hackathon Announcements</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Stay updated on new hackathons and events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Email Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Send email for important updates</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Settings */}
          <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500">
                <UserRound className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold dark:text-white">Account Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Manage your account details and preferences
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="dark:text-white">Email Address</Label>
                      <div className="flex mt-1">
                        <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md">
                          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md py-2 px-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-taskbuddy-blue dark:focus:ring-taskbuddy-purple focus:border-transparent"
                          value="suresh@dypvp.edu.in"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="dark:text-white">Change Password</Label>
                      <Button variant="outline" className="mt-1 w-full gap-2 dark:border-gray-600 dark:text-gray-300">
                        <Lock className="h-4 w-4" />
                        <span>Update Password</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="dark:text-white">Time Zone</Label>
                      <div className="flex mt-1">
                        <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md">
                          <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <select
                          className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md py-2 px-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-taskbuddy-blue dark:focus:ring-taskbuddy-purple focus:border-transparent"
                        >
                          <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                          <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                          <option>(GMT+00:00) UTC</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="dark:text-white">Connected Devices</Label>
                      <Button variant="outline" className="mt-1 w-full gap-2 dark:border-gray-600 dark:text-gray-300">
                        <Smartphone className="h-4 w-4" />
                        <span>Manage Devices</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold dark:text-white">Privacy & Data</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Control your privacy settings and data preferences
                </p>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Show Online Status</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Let others see when you're active</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Share Task Progress</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow buddies to see your task completion status</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Usage Analytics</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Help improve TaskBuddy with anonymous usage data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex justify-between">
                  <Button variant="outline" className="gap-2 text-red-600 dark:text-red-500 dark:border-gray-700">
                    <Edit3 className="h-4 w-4" />
                    <span>Request Data Export</span>
                  </Button>
                  
                  <Button variant="outline" className="gap-2 text-red-600 dark:text-red-500 dark:border-gray-700" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Other Settings */}
          <div className="glassmorphism dark:bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-500">
                <Clock className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-semibold dark:text-white">Productivity Preferences</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Customize your task management and productivity settings
                </p>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Task Sorting</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Default sort order for tasks</p>
                    </div>
                    <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-taskbuddy-blue dark:focus:ring-taskbuddy-purple focus:border-transparent">
                      <option>Due Date (Earliest First)</option>
                      <option>Priority (Highest First)</option>
                      <option>Recently Added</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Default Task View</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose list or calendar as default view</p>
                    </div>
                    <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-taskbuddy-blue dark:focus:ring-taskbuddy-purple focus:border-transparent">
                      <option>List View</option>
                      <option>Calendar View</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base dark:text-white">Automatic Reminders</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get reminders for upcoming tasks</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
