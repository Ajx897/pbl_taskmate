
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const [hoverStudent, setHoverStudent] = useState(false);
  const [hoverTeacher, setHoverTeacher] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            TaskBuddy
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your all-in-one productivity platform for students and teachers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card 
            className={`overflow-hidden transition-all duration-300 ${
              hoverStudent ? "transform -translate-y-2 shadow-lg" : "shadow"
            }`}
            onMouseEnter={() => setHoverStudent(true)}
            onMouseLeave={() => setHoverStudent(false)}
          >
            <CardContent className="p-0">
              <div className="bg-blue-600 h-2 w-full"></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6 mx-auto">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">Student Portal</h2>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manage tasks and assignments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Connect with study buddies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Join hackathons and communities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access marketplace for resources</span>
                  </li>
                </ul>
                <Link to="/student">
                  <Button className="w-full">
                    Continue as Student
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`overflow-hidden transition-all duration-300 ${
              hoverTeacher ? "transform -translate-y-2 shadow-lg" : "shadow"
            }`}
            onMouseEnter={() => setHoverTeacher(true)}
            onMouseLeave={() => setHoverTeacher(false)}
          >
            <CardContent className="p-0">
              <div className="bg-teal-600 h-2 w-full"></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">Teacher Portal</h2>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Track student attendance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Broadcast deadlines and announcements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Monitor student submissions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckSquare className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Generate attendance reports</span>
                  </li>
                </ul>
                <Link to="/teacher">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Continue as Teacher
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} TaskBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
