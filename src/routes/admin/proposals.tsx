import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Trash2, Building2, Phone, Mail, Clock, Users } from "lucide-react";

export const Route = createFileRoute("/admin/proposals")({
  component: AdminProposalsPage,
});

function AdminProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
    
    const channel = supabase
      .channel('schema-db-changes-proposals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        (payload) => {
          fetchProposals(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchProposals() {
    setLoading(true);
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching proposals:", error);
    } else {
      setProposals(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(proposal: any, newStatus: string) {
    await supabase.from("proposals").update({ status: newStatus }).eq("id", proposal.id);
  }

  async function deleteProposal(id: string) {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      await supabase.from("proposals").delete().eq("id", id);
    }
  }

  const statusColors: Record<string, string> = {
    "New": "bg-blue-500/10 text-blue-500",
    "Contacted": "bg-yellow-500/10 text-yellow-500",
    "Proposal Sent": "bg-orange-500/10 text-orange-500",
    "Converted": "bg-green-500/10 text-green-500",
    "Closed": "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proposals Management</h2>
          <p className="text-muted-foreground">
            Manage B2B enquiries from colleges and universities.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Institution & Contact</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Requirements</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Program Required</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading proposals...</td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No proposals found.</td>
                </tr>
              ) : (
                proposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-top whitespace-nowrap text-muted-foreground">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-primary" />
                        <div className="font-semibold text-foreground">{proposal.institution_name}</div>
                      </div>
                      <div className="font-medium mb-2">{proposal.contact_person}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" /> {proposal.phone_number}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" /> {proposal.institutional_email}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-medium text-muted-foreground w-16">Mode:</span> 
                          <span>{proposal.delivery_mode}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-medium text-muted-foreground w-16">Duration:</span> 
                          <span>{proposal.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-medium text-muted-foreground w-16">Students:</span> 
                          <span>{proposal.expected_participants}</span>
                        </div>
                      </div>
                      {proposal.additional_requirements && (
                        <div className="mt-3 text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2">
                          "{proposal.additional_requirements}"
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top max-w-[250px]">
                      <span className="inline-flex rounded-md bg-secondary/50 border border-border px-2 py-1 text-xs font-medium text-muted-foreground">
                        {proposal.program_training_required}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <select 
                        value={proposal.status}
                        onChange={(e) => updateStatus(proposal, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-none focus:ring-2 focus:ring-ring ${statusColors[proposal.status] || "bg-secondary text-secondary-foreground"}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4 align-top text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => deleteProposal(proposal.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          title="Delete Proposal"
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
