import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Trash2, Phone, Mail, GraduationCap, Target, Clock, Code2 } from "lucide-react";

export const Route = createFileRoute("/admin/callbacks")({
  component: AdminCallbacksPage,
});

function AdminCallbacksPage() {
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCallbacks();
    
    const channel = supabase
      .channel('schema-db-changes-callbacks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'callback_requests' },
        (payload) => {
          fetchCallbacks(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchCallbacks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("callback_requests")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching callback requests:", error);
    } else {
      setCallbacks(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(cb: any, newStatus: string) {
    await supabase.from("callback_requests").update({ status: newStatus }).eq("id", cb.id);

    if (newStatus === "Converted") {
      // Check if student exists
      const { data: existingStudent } = await supabase
        .from("students")
        .select("*")
        .or(`email.eq.${cb.email},phone.eq.${cb.phone}`)
        .limit(1)
        .single();

      if (!existingStudent) {
        // Create new student
        await supabase.from("students").insert({
          name: cb.full_name,
          email: cb.email,
          phone: cb.phone,
          city: null, // Callbacks don't have city
          qualification: cb.qualification,
          latest_course: cb.interested_course,
          status: "Active",
        });
      } else {
        // Update existing student with latest info
        await supabase.from("students").update({
          latest_course: cb.interested_course || existingStudent.latest_course,
          qualification: cb.qualification || existingStudent.qualification,
        }).eq("id", existingStudent.id);
      }
    }
  }

  async function deleteCallback(id: string) {
    if (window.confirm("Are you sure you want to delete this callback request?")) {
      await supabase.from("callback_requests").delete().eq("id", id);
    }
  }

  const statusColors: Record<string, string> = {
    "New": "bg-blue-500/10 text-blue-500",
    "Contacted": "bg-yellow-500/10 text-yellow-500",
    "Converted": "bg-emerald-500/10 text-emerald-500",
    "In Progress": "bg-orange-500/10 text-orange-500",
    "Completed": "bg-green-500/10 text-green-500",
    "Cancelled": "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Callback Requests</h2>
          <p className="text-muted-foreground">
            Manage free career callback requests from students.
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
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Career Profile</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Pref. Time</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading callback requests...</td>
                </tr>
              ) : callbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No callback requests found.</td>
                </tr>
              ) : (
                callbacks.map((cb) => (
                  <tr key={cb.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">
                      {new Date(cb.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium">{cb.full_name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" /> {cb.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Mail className="h-3 w-3" /> {cb.email}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <GraduationCap className="h-3 w-3" /> <span className="font-medium text-foreground">Qual:</span> {cb.qualification}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Code2 className="h-3 w-3" /> <span className="font-medium text-foreground">Course:</span> {cb.interested_course} ({cb.skill_level})
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="h-3 w-3" /> <span className="font-medium text-foreground">Goal:</span> {cb.career_goal}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Clock className="h-3 w-3 text-muted-foreground" /> {cb.preferred_contact_time}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <select 
                        value={cb.status}
                        onChange={(e) => updateStatus(cb, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-none focus:ring-2 focus:ring-ring outline-none ${statusColors[cb.status] || "bg-secondary text-secondary-foreground"}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => deleteCallback(cb.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          title="Delete Request"
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
