import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Users, Mail, Phone, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    
    const channel = supabase
      .channel('schema-db-changes-students')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
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
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  }

  async function deleteStudent(id: string) {
    if (window.confirm("Are you sure you want to remove this student from the Students Directory? This action cannot be undone.")) {
      const { error } = await supabase.from("students").delete().eq("id", id);
      
      if (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student: " + error.message);
      } else {
        toast.success("Student removed successfully.");
      }
    }
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
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No students found.</td>
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
                          <div className="font-medium">{student.name}</div>
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
                    <td className="p-4 align-middle font-medium">{student.latest_course || "N/A"}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground">
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-destructive hover:text-destructive-foreground"
                          title="Delete Student"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
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
