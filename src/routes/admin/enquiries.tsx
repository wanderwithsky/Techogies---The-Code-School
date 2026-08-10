import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Trash2, MessageSquare, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiriesPage,
});

function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
    
    const channel = supabase
      .channel('schema-db-changes-enquiries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enquiries' },
        (payload) => {
          fetchEnquiries(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching enquiries:", error);
    } else {
      setEnquiries(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(enquiry: any, newStatus: string) {
    await supabase.from("enquiries").update({ status: newStatus }).eq("id", enquiry.id);

    if (newStatus === "Converted") {
      // Check if student exists
      const { data: existingStudent } = await supabase
        .from("students")
        .select("*")
        .or(`email.eq.${enquiry.email},phone.eq.${enquiry.phone}`)
        .limit(1)
        .single();

      if (!existingStudent) {
        // Create new student
        await supabase.from("students").insert({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          city: enquiry.city,
          qualification: enquiry.qualification,
          latest_course: enquiry.course,
          status: "Active",
        });
      } else {
        // Update existing student with latest info (optional, but good practice)
        await supabase.from("students").update({
          latest_course: enquiry.course || existingStudent.latest_course,
          city: enquiry.city || existingStudent.city,
          qualification: enquiry.qualification || existingStudent.qualification,
        }).eq("id", existingStudent.id);
      }
    }
  }

  async function deleteEnquiry(id: string) {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      await supabase.from("enquiries").delete().eq("id", id);
    }
  }

  const statusColors: Record<string, string> = {
    "New": "bg-blue-500/10 text-blue-500",
    "Contacted": "bg-yellow-500/10 text-yellow-500",
    "Follow-up": "bg-orange-500/10 text-orange-500",
    "Converted": "bg-green-500/10 text-green-500",
    "Closed": "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enquiries Management</h2>
          <p className="text-muted-foreground">
            Manage contact form submissions and leads.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course Interest</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Message</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading enquiries...</td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No enquiries found.</td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{enquiry.name}</div>
                        {enquiry.internal_notes?.includes('[Source: techie_live_chat]') && (
                          <span className="inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-[color:var(--brand)]">
                            Techie Chat
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" /> {enquiry.phone}
                      </div>
                      {enquiry.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {enquiry.email}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-middle font-medium">{enquiry.course || "-"}</td>
                    <td className="p-4 align-middle max-w-[300px] truncate text-muted-foreground" title={enquiry.message}>
                      {enquiry.message || "-"}
                    </td>
                    <td className="p-4 align-middle">
                      <select 
                        value={enquiry.status}
                        onChange={(e) => updateStatus(enquiry, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-none focus:ring-2 focus:ring-ring ${statusColors[enquiry.status] || "bg-secondary text-secondary-foreground"}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => deleteEnquiry(enquiry.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-destructive hover:text-destructive-foreground"
                          title="Delete Enquiry"
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
