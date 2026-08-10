import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Users, BookOpen, MessageSquare, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardHome,
});

function AdminDashboardHome() {
  const [stats, setStats] = useState({
    enquiries: 0,
    students: 0,
    courses: 0,
    enrollments: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [enquiriesRes, studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("id", { count: "exact", head: true }), // Assuming students and enrollments are similar for now
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        enquiries: enquiriesRes.count || 0,
        students: studentsRes.count || 0, 
        courses: coursesRes.count || 0,
        enrollments: enrollmentsRes.count || 0,
      });
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Enquiries", value: stats.enquiries, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Courses", value: stats.courses, icon: BookOpen, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Total Enrollments", value: stats.enrollments, icon: GraduationCap, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Total Students", value: stats.students, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome to the Techogies admin dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{stat.title}</h3>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-4 p-6">
          <div className="flex flex-col space-y-1.5 mb-4">
            <h3 className="font-semibold leading-none tracking-tight">Recent Enquiries</h3>
            <p className="text-sm text-muted-foreground">Latest leads from the contact form.</p>
          </div>
          <div className="text-sm text-muted-foreground text-center py-8">
            Loading recent data...
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-3 p-6">
          <div className="flex flex-col space-y-1.5 mb-4">
            <h3 className="font-semibold leading-none tracking-tight">Recent Enrollments</h3>
            <p className="text-sm text-muted-foreground">Latest student enrollments.</p>
          </div>
          <div className="text-sm text-muted-foreground text-center py-8">
             Loading recent data...
          </div>
        </div>
      </div>
    </div>
  );
}
