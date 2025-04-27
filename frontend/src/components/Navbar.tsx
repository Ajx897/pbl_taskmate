import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  BookOpenCheck, 
  MessageSquare, 
  Users, 
  Menu,
  X,
  ShoppingBag,
  User,
  Sun,
  Moon,
  LogOut,
  Trophy
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationsModal } from "@/components/NotificationsModal";

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/student" },
  { name: "Tasks", icon: <BookOpenCheck className="h-5 w-5" />, path: "/student/tasks" },
  { name: "Marketplace", icon: <ShoppingBag className="h-5 w-5" />, path: "/student/marketplace" },
  { name: "Hackathons", icon: <Trophy className="h-5 w-5" />, path: "/student/hackathons" },
  { name: "Community", icon: <MessageSquare className="h-5 w-5" />, path: "/student/community" },
  { name: "Buddy Up", icon: <Users className="h-5 w-5" />, path: "/student/buddy-up" },
  { name: "Profile", icon: <User className="h-5 w-5" />, path: "/student/profile" },
  { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/student/settings" },
  { name: "Logout", icon: <LogOut className="h-5 w-5" />, path: "#logout" },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const location = useLocation();
  const [isActive, setIsActive] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/";
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-lg font-bold ml-2">TaskBuddy</h1>
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

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-taskbuddy-blue dark:bg-gray-800 text-white transition-transform duration-300 flex flex-col",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          isMobile && "pt-14",
          className
        )}
      >
        {!isMobile && (
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/10 dark:border-gray-700">
            <h1 className="text-xl font-bold">TaskBuddy</h1>
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
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Suresh Ramesh</p>
            </div>
          </div>
        </div>
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
