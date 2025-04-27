import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/pages/teacher/TeacherAttendancePage";

interface StudentExcelUploadProps {
  onUploadSuccess: (students: Student[]) => void;
}

export function StudentExcelUpload({ onUploadSuccess }: StudentExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select an Excel or CSV file",
        variant: "destructive",
      });
      return;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'csv') {
      toast({
        title: "Invalid File Type",
        description: "Please select an Excel (.xlsx) or CSV (.csv) file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const mockStudents: Student[] = [
        { id: "1", name: "Alex Johnson", rollNumber: "A001", email: "alex@example.com", batch: "A" },
        { id: "2", name: "Beth Smith", rollNumber: "A002", email: "beth@example.com", batch: "A" },
        { id: "3", name: "Carlos Rodriguez", rollNumber: "B001", email: "carlos@example.com", batch: "B" },
        { id: "4", name: "Dana Williams", rollNumber: "B002", email: "dana@example.com", batch: "B" },
        { id: "5", name: "Ethan Brown", rollNumber: "C001", email: "ethan@example.com", batch: "C" },
        { id: "6", name: "Fiona Davis", rollNumber: "C002", email: "fiona@example.com", batch: "C" },
        { id: "7", name: "George Wilson", rollNumber: "A003", email: "george@example.com", batch: "A" },
        { id: "8", name: "Hannah Martinez", rollNumber: "B003", email: "hannah@example.com", batch: "B" },
      ];

      onUploadSuccess(mockStudents);
      setIsUploading(false);
      setUploadSuccess(true);

      toast({
        title: "Upload Successful",
        description: `${mockStudents.length} students imported from ${file.name}`,
      });
    }, 1500);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center pb-4">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">Upload Student Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload an Excel (.xlsx) or CSV (.csv) file containing student details
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <div className="flex items-center gap-3">
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
            {file && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>
          
          <div className="pt-2">
            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={!file || isUploading || uploadSuccess}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : uploadSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Upload Complete
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Student Data
                </>
              )}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
            <p className="font-medium">Your Excel file should contain these columns:</p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              <li>Name (Student's full name)</li>
              <li>Roll Number (Unique ID)</li>
              <li>Email (Optional)</li>
              <li>Batch/Division (e.g., A, B, C)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
