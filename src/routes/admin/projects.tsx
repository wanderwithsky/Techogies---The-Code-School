import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2, Plus, Briefcase, X, Loader2 } from "lucide-react";
import { ImageUpload } from "../../components/admin/ImageUpload";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage,
});

function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    technologies: "", // comma separated string for ease of entry
    image_url: "",
  });

  useEffect(() => {
    fetchProjects();
    
    const channel = supabase
      .channel('schema-db-changes-projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          fetchProjects(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await supabase.from("projects").update({ status: newStatus }).eq("id", id);
  }

  async function deleteProject(id: string) {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await supabase.from("projects").delete().eq("id", id);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setFormData({ title: "", slug: "", category: "", description: "", technologies: "", image_url: "" });
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function openEditModal(project: any) {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category || "",
      description: project.description || project.short_description || "",
      technologies: (project.technologies || []).join(", "),
      image_url: project.image_url || "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    if (!formData.title || !formData.slug) {
      setErrorMsg("Title and Slug are required.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      description: formData.description,
      technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
      image_url: formData.image_url,
    };

    if (editingId) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editingId);
      if (error) setErrorMsg(error.message);
      else setIsModalOpen(false);
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) setErrorMsg(error.message);
      else setIsModalOpen(false);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects Management</h2>
          <p className="text-muted-foreground">
            Manage the real-world projects displayed in the portfolio section.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tech Stack</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading projects...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No projects found. Add your first project!</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="h-10 w-16 rounded-md object-cover border" />
                        ) : (
                          <div className="h-10 w-16 rounded-md bg-muted flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-xs text-muted-foreground">{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">{project.category || "-"}</td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {(project.technologies || []).slice(0, 3).map((tech: string, i: number) => (
                          <span key={i} className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            {tech}
                          </span>
                        ))}
                        {project.technologies?.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{project.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <button 
                        onClick={() => toggleStatus(project.id, project.status)}
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          project.status === 'published' 
                            ? 'border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                            : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {project.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(project)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button 
                          onClick={() => deleteProject(project.id)}
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
          <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-lg sm:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingId ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">{errorMsg}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Slug (URL) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Postgres"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project Image</label>
                <ImageUpload 
                  folder="projects"
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
                  {editingId ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
