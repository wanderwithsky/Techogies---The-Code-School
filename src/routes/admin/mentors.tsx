import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2, Plus, User, X, Loader2 } from "lucide-react";
import { ImageUpload } from "../../components/admin/ImageUpload";

export const Route = createFileRoute("/admin/mentors")({
  component: AdminMentorsPage,
});

function AdminMentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    linkedin_url: "",
    image_url: "",
  });

  useEffect(() => {
    fetchMentors();
    
    const channel = supabase
      .channel('schema-db-changes-mentors')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mentors' },
        (payload) => {
          fetchMentors(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMentors() {
    setLoading(true);
    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching mentors:", error);
    } else {
      setMentors(data || []);
    }
    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await supabase.from("mentors").update({ status: newStatus }).eq("id", id);
  }

  async function deleteMentor(id: string) {
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      await supabase.from("mentors").delete().eq("id", id);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setFormData({ name: "", role: "", experience: "", linkedin_url: "", image_url: "" });
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function openEditModal(mentor: any) {
    setEditingId(mentor.id);
    setFormData({
      name: mentor.name,
      role: mentor.role,
      experience: mentor.experience || "",
      linkedin_url: mentor.linkedin_url || "",
      image_url: mentor.image_url || "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    if (!formData.name || !formData.role) {
      setErrorMsg("Name and Role are required.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name,
      role: formData.role,
      experience: formData.experience,
      linkedin_url: formData.linkedin_url,
      image_url: formData.image_url,
    };

    if (editingId) {
      const { error } = await supabase.from("mentors").update(payload).eq("id", editingId);
      if (error) setErrorMsg(error.message);
      else setIsModalOpen(false);
    } else {
      const { error } = await supabase.from("mentors").insert(payload);
      if (error) setErrorMsg(error.message);
      else setIsModalOpen(false);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mentors Management</h2>
          <p className="text-muted-foreground">
            Manage the mentors displayed in the Meet Our Mentors section.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Mentor
        </button>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Mentor</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Experience</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading mentors...</td>
                </tr>
              ) : mentors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No mentors found. Add your first mentor!</td>
                </tr>
              ) : (
                mentors.map((mentor) => (
                  <tr key={mentor.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        {mentor.image_url ? (
                          <img src={mentor.image_url} alt={mentor.name} className="h-10 w-10 rounded-full object-cover border" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{mentor.name}</div>
                          {mentor.linkedin_url && (
                            <a href={mentor.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">{mentor.role}</td>
                    <td className="p-4 align-middle text-muted-foreground">{mentor.experience}</td>
                    <td className="p-4 align-middle">
                      <button 
                        onClick={() => toggleStatus(mentor.id, mentor.status)}
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          mentor.status === 'active' 
                            ? 'border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                            : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {mentor.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(mentor)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button 
                          onClick={() => deleteMentor(mentor.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-destructive hover:text-destructive-foreground"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingId ? "Edit Mentor" : "Add Mentor"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">{errorMsg}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Experience (e.g. 5+ yrs)</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mentor Image</label>
                <ImageUpload 
                  folder="mentors"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Create Mentor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
