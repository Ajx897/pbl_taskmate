
import { Navbar } from "@/components/Navbar";
import { TaskPanel } from "@/components/TaskPanel";
import { DeadlineTracker } from "@/components/DeadlineTracker";
import { AttendanceCard } from "@/components/AttendanceCard";
import { BuddyUpSection } from "@/components/BuddyUpSection";
import { ProfileSection } from "@/components/ProfileSection";
import { HackathonUpdates } from "@/components/HackathonUpdates";
import { NotificationsModal } from "@/components/NotificationsModal";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-taskbuddy-bg">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 ml-0 md:ml-64 transition-all duration-300 pt-16 md:pt-6">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, Suresh</p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Welcome
            </Button>
          </Link>
        </header>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks & Attendance */}
          <div className="space-y-6">
            <TaskPanel />
            <AttendanceCard />
          </div>
          
          {/* Middle Column - Deadlines & Hackathons */}
          <div className="space-y-6">
            <DeadlineTracker />
            <HackathonUpdates />
          </div>
          
          {/* Right Column - Profile & Buddy Up */}
          <div className="space-y-6">
            <ProfileSection />
            <BuddyUpSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
