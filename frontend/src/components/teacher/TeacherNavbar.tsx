import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationsModal } from "@/components/NotificationsModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/teacher" },
  { name: "Attendance", icon: <Calendar className="h-5 w-5" />, path: "/teacher/attendance" },
  { name: "Deadlines", icon: <Clock className="h-5 w-5" />, path: "/teacher/deadlines" },
  { name: "Add Students", icon: <UserPlus className="h-5 w-5" />, path: "/teacher/add-students" },
  { name: "Profile", icon: <User className="h-5 w-5" />, path: "/teacher/profile" },
  { name: "Logout", icon: <LogOut className="h-5 w-5" />, path: "#logout" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { toast } = useToast();

  // Keep active state in sync with URL path
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  // Close sidebar when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    try {
      // Clear all auth-related data
      logout();
      
      // Show success message
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to login page
      navigate('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-lg font-bold ml-2">TaskBuddy Teacher</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsModal />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar/Navbar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-teal-600 dark:bg-gray-800 text-white transition-transform duration-300 flex flex-col",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          isMobile && "pt-14"
        )}
      >
        {!isMobile && (
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/10 dark:border-gray-700">
            <h1 className="text-xl font-bold">TaskBuddy Teacher</h1>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.path === "#logout" ? (
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left",
                      "hover:bg-white/5 dark:hover:bg-gray-700/70 text-white/80"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      item.path === isActive
                        ? "bg-white/10 dark:bg-gray-700 text-white font-medium"
                        : "hover:bg-white/5 dark:hover:bg-gray-700/70 text-white/80"
                    )}
                    onClick={() => {
                      if (isMobile) setIsOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 dark:bg-gray-700 hover:bg-white/20 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <NotificationsModal />
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-white/70">Mathematics Teacher</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
