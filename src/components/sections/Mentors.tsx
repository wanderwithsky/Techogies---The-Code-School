import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function Mentors() {
  const queryClient = useQueryClient();

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentors")
        .select("*")
        .eq("status", "active")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('public-mentors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentors' }, () => {
        queryClient.invalidateQueries({ queryKey: ["mentors"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <section id="mentors" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Meet Our Mentors"
          title="Learn from engineers who ship"
          subtitle="Every session is led by senior engineers with real production experience."
        />
        
        {isLoading ? (
          <div className="mt-14 flex justify-center py-12 text-muted-foreground">
            Loading mentors...
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={m.image_url}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground">{m.experience}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">{m.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                  {m.linkedin_url && (
                    <a
                      href={m.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-accent"
                    >
                      <Linkedin size={13} /> LinkedIn
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}