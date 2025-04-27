import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AttendanceStats {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  weeklyTrend: {
    date: string;
    present: number;
    absent: number;
  }[];
  monthlyTrend: {
    date: string;
    present: number;
    absent: number;
  }[];
}

export function AttendanceSummary() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/teacher/attendance-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading || !stats) {
    return (
      <Card>
        <CardHeader>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Summary</CardTitle>
        <CardDescription>Overview of attendance statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.presentCount}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{stats.absentCount}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Overall Attendance</p>
              <p className="text-sm font-medium">{stats.attendancePercentage.toFixed(1)}%</p>
            </div>
            <Progress value={stats.attendancePercentage} className="h-2" />
          </div>

          <Tabs defaultValue="weekly">
            <TabsList>
              <TabsTrigger value="weekly">Weekly Trend</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="present" stroke="#22c55e" name="Present" />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="monthly" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="present" stroke="#22c55e" name="Present" />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
