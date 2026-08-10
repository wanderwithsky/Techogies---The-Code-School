import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Users, Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    
    // Using enrollments table to derive students since they submit enrollments
    const channel = supabase
      .channel('schema-db-changes-students')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments' },
        (payload) => {
          fetchStudents(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchStudents() {
    setLoading(true);
    // In a real DB we'd have a distinct students table, but for now we aggregate from enrollments
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching students:", error);
    } else {
      // Deduplicate by email/phone
      const uniqueStudents = Array.from(new Map(data?.map(item => [item.phone, item])).values());
      setStudents(uniqueStudents || []);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Students Directory</h2>
          <p className="text-muted-foreground">
            View all enrolled and prospective students.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">City</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Latest Course</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{student.student_name}</div>
                          <div className="text-xs text-muted-foreground">Added {new Date(student.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {student.phone}</div>
                        {student.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {student.email}</div>}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {student.city ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3" /> {student.city}
                        </div>
                      ) : "-"}
                    </td>
                    <td className="p-4 align-middle font-medium">{student.course_name || "N/A"}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground">
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
