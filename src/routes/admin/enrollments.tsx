import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Trash2, GraduationCap, Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/admin/enrollments")({
  component: AdminEnrollmentsPage,
});

function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
    
    const channel = supabase
      .channel('schema-db-changes-enrollments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments' },
        (payload) => {
          fetchEnrollments(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchEnrollments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching enrollments:", error);
    } else {
      setEnrollments(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(enrollment: any, newStatus: string) {
    await supabase.from("enrollments").update({ status: newStatus }).eq("id", enrollment.id);

    if (newStatus === "Converted") {
      // Check if student exists
      const { data: existingStudent } = await supabase
        .from("students")
        .select("*")
        .or(`email.eq.${enrollment.email},phone.eq.${enrollment.phone}`)
        .limit(1)
        .single();

      if (!existingStudent) {
        // Create new student
        await supabase.from("students").insert({
          name: enrollment.student_name,
          email: enrollment.email,
          phone: enrollment.phone,
          city: enrollment.city,
          qualification: enrollment.qualification,
          latest_course: enrollment.course_name,
          status: "Active",
        });
      } else {
        // Update existing student with latest info
        await supabase.from("students").update({
          latest_course: enrollment.course_name || existingStudent.latest_course,
          city: enrollment.city || existingStudent.city,
          qualification: enrollment.qualification || existingStudent.qualification,
        }).eq("id", existingStudent.id);
      }
    }
  }

  async function updatePaymentStatus(id: string, newStatus: string) {
    await supabase.from("enrollments").update({ payment_status: newStatus }).eq("id", id);
  }

  async function deleteEnrollment(id: string) {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      await supabase.from("enrollments").delete().eq("id", id);
    }
  }

  const statusColors: Record<string, string> = {
    "New": "bg-blue-500/10 text-blue-500",
    "Contacted": "bg-yellow-500/10 text-yellow-500",
    "Converted": "bg-emerald-500/10 text-emerald-500",
    "Enrolled": "bg-green-500/10 text-green-500",
    "Active": "bg-emerald-500/10 text-emerald-500",
    "Completed": "bg-purple-500/10 text-purple-500",
    "Cancelled": "bg-red-500/10 text-red-500",
  };

  const paymentColors: Record<string, string> = {
    "Pending": "bg-yellow-500/10 text-yellow-500",
    "Paid": "bg-green-500/10 text-green-500",
    "Failed": "bg-red-500/10 text-red-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enrollments Management</h2>
          <p className="text-muted-foreground">
            Manage course enrollments and student payment statuses.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student Info</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Payment</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading enrollments...</td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No enrollments found.</td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">
                      {new Date(enrollment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium">{enrollment.student_name}</div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {enrollment.phone}</div>
                        {enrollment.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {enrollment.email}</div>}
                        {enrollment.city && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {enrollment.city}</div>}
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">{enrollment.course_name || "-"}</td>
                    <td className="p-4 align-middle">
                      <select 
                        value={enrollment.status}
                        onChange={(e) => updateStatus(enrollment, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-none focus:ring-2 focus:ring-ring ${statusColors[enrollment.status] || "bg-secondary text-secondary-foreground"}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle">
                      <select 
                        value={enrollment.payment_status}
                        onChange={(e) => updatePaymentStatus(enrollment.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-none focus:ring-2 focus:ring-ring ${paymentColors[enrollment.payment_status] || "bg-secondary text-secondary-foreground"}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => deleteEnrollment(enrollment.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-destructive hover:text-destructive-foreground"
                          title="Delete Enrollment"
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
