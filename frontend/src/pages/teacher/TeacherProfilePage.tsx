
import { Navbar } from "@/components/teacher/TeacherNavbar";
import { TeacherProfileForm } from "@/components/teacher/TeacherProfileForm";

const TeacherProfilePage = () => {
  return (
    <div className="min-h-screen bg-taskbuddy-bg dark:bg-gray-900">
      <Navbar />
      <div className="md:pl-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 pt-16 md:pt-8">
          <h1 className="text-3xl font-bold mb-6">Teacher Profile</h1>
          <TeacherProfileForm />
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
