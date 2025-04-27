
import { useState } from "react";
import { Navbar } from "@/components/teacher/TeacherNavbar";
import { DeadlineBroadcastForm } from "@/components/teacher/DeadlineBroadcastForm";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { TeacherCommunitiesSection } from "@/components/teacher/TeacherCommunitiesSection";

const TeacherDeadlinePage = () => {
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);

  return (
    <div className="min-h-screen bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      <div className="md:pl-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Deadline Management</h1>
              
          </div>
          
          {showDeadlineForm ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold">Create New Deadline</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeadlineForm(false)}
                >
                  Back to Communities
                </Button>
              </div>
              <DeadlineBroadcastForm onComplete={() => setShowDeadlineForm(false)} />
            </div>
          ) : (
            <TeacherCommunitiesSection onAddDeadline={() => setShowDeadlineForm(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDeadlinePage;
