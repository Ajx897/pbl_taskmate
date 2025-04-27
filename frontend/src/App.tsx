import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import { Dashboard } from "@/components/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Landing Page
import LandingPage from "./pages/LandingPage";

// Student Pages
import Index from "./pages/students/Index";
import TasksPage from "./pages/TasksPage";
import MarketplacePage from "./pages/MarketplacePage";
import CommunityPage from "./pages/students/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import HackathonsPage from "./pages/HackathonsPage";
import BuddyUpPage from "./pages/BuddyUpPage";
import NotFound from "./pages/NotFound";

// Teacher Pages
import TeacherDashboardPage from "./pages/teacher/TeacherDashboardPage";
import TeacherAttendancePage from "./pages/teacher/TeacherAttendancePage";
import TeacherDeadlinePage from "./pages/teacher/TeacherDeadlinePage";
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage";
import AddStudentPage from "./pages/teacher/AddStudentPage";

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient();

// Function to check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem("token");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Toaster />
            <Sonner />
            <ToastContainer />
            <Routes>
              {/* Redirect to Sign-In if not logged in */}
              <Route path="/" element={isAuthenticated() ? <Index /> : <Navigate to="/sign-in" />} />

              {/* Authentication Routes */}
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />

              {/* Protected Student Routes */}
              {isAuthenticated() && (
                <>
                  <Route path="/student" element={<Index />} />
                  <Route path="/student/tasks" element={<TasksPage />} />
                  <Route path="/student/marketplace" element={<MarketplacePage />} />
                  <Route path="/student/community" element={<CommunityPage />} />
                  <Route path="/student/profile" element={<ProfilePage />} />
                  <Route path="/student/settings" element={<SettingsPage />} />
                  <Route path="/student/calendar" element={<TasksPage />} />
                  <Route path="/student/buddy-up" element={<BuddyUpPage />} />
                  <Route path="/student/hackathons" element={<HackathonsPage />} />
                  <Route path="/student/help" element={<NotFound />} />
                </>
              )}

              {/* Protected Teacher Routes */}
              {isAuthenticated() && (
                <>
                  <Route path="/teacher" element={<TeacherDashboardPage />} />
                  <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
                  <Route path="/teacher/deadlines" element={<TeacherDeadlinePage />} />
                  <Route path="/teacher/profile" element={<TeacherProfilePage />} />
                  <Route path="/teacher/add-students" element={<AddStudentPage />} />
                </>
              )}

              {/* Protected Dashboard Route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={['student', 'teacher', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
