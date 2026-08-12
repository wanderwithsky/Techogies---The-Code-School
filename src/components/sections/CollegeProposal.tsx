import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type ProposalFormValues = {
  institutionName: string;
  contactPerson: string;
  institutionalEmail: string;
  phoneNumber: string;
  programTrainingRequired: string;
  deliveryMode: string;
  expectedParticipants: string;
  duration: string;
  additionalRequirements: string;
};

const PROGRAMS = [
  "Cyber Security & Ethical Hacking",
  "Python, AI & Machine Learning",
  "SPSS & Research Data Analysis",
  "Power BI & Data Analytics",
  "MS Office + AI Productivity",
  "Next Gen Digital Marketing using AI",
  "Full Stack / Web Development",
  "Custom programs aligned with your syllabus & credits",
];

export function CollegeProposal() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormValues>({
    defaultValues: {
      programTrainingRequired: "",
      deliveryMode: "",
      expectedParticipants: "",
      duration: "",
    },
  });

  const onSubmit = async (v: ProposalFormValues) => {
    try {
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      if (!v.programTrainingRequired) {
        toast.error("Please select a program.");
        return;
      }
      
      const { error, status } = await supabase.from("proposals").insert({
        institution_name: v.institutionName,
        contact_person: v.contactPerson,
        institutional_email: v.institutionalEmail,
        phone_number: v.phoneNumber,
        program_training_required: v.programTrainingRequired,
        delivery_mode: v.deliveryMode,
        expected_participants: parseInt(v.expectedParticipants, 10) || 0,
        duration: v.duration,
        additional_requirements: v.additionalRequirements,
        status: "New",
      });

      if (error) {
        console.error("Proposal submission error:", error);
        
        if (import.meta.env.DEV) {
          toast.error(`Dev Error [${status || error.code}]: ${error.message}`);
        } else {
          toast.error("Failed to submit proposal. Please try again.");
        }
        return;
      }

      toast.success("Proposal requested! Our team will contact you shortly.");
      reset();
    } catch (err: any) {
      console.error(err);
      if (import.meta.env.DEV) {
        toast.error(`Unexpected Dev Error: ${err?.message || "Unknown error"}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const inputCls =
    "w-full rounded-[10px] border border-orange-500/20 dark:border-orange-500/30 bg-white/70 dark:bg-orange-950/20 px-3 py-2 h-[38px] text-[12px] text-slate-900 dark:text-foreground outline-none transition backdrop-blur-md placeholder:text-slate-400 dark:placeholder:text-muted-foreground/70 focus:border-orange-500/50 dark:focus:border-orange-500/70 focus:bg-white/90 dark:focus:bg-orange-950/40 focus:ring-1 focus:ring-orange-500/50 focus:shadow-[0_0_15px_-3px_rgba(249,115,22,0.15)] dark:focus:shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)] hover:border-orange-500/40 dark:hover:border-orange-500/50";

  return (
    <section className="relative bg-[#FFF4EA] dark:bg-muted/20 py-12 sm:py-16 overflow-hidden border-t border-b border-orange-900/5 dark:border-border/50">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12 items-start">
          
          {/* Left Column: Description */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4 w-fit">
              <Building2 size={14} />
              B2B / Institutional
            </div>
            
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl">
              Quote Your Proposal for Colleges & Universities
            </h2>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-muted-foreground sm:text-base leading-relaxed">
              Bring industry-ready tech programs to your campus. Tell us what you need and our team will prepare a customized proposal.
            </p>

            <div className="mt-5 rounded-[20px] border border-orange-500/20 dark:border-border bg-white/60 dark:bg-card backdrop-blur-md p-4 shadow-sm">
              <h3 className="font-semibold text-[13px] text-slate-900 dark:text-foreground mb-2">What can we deliver?</h3>
              <ul className="space-y-1">
                {PROGRAMS.map((prog, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] leading-snug text-slate-700 dark:text-muted-foreground">
                    <CheckCircle2 size={12} className="text-primary mt-[2px] shrink-0" />
                    <span>{prog}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2.5 border-t border-orange-900/5 dark:border-border flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-primary">
                <span>On-campus</span> • <span>Online</span> • <span>Hybrid</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="rounded-3xl border border-orange-500/30 dark:border-orange-500/40 bg-white/60 dark:bg-orange-950/20 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_8_30px_rgb(249,115,22,0.08)] dark:shadow-[0_0_40px_-10px_rgba(249,115,22,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-orange-500/20 dark:bg-orange-500/10 blur-[80px] pointer-events-none" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
              <div className="grid gap-y-2.5 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Institution Name *</label>
                  <input {...register("institutionName", { required: true })} placeholder="College or University Name" className={inputCls} />
                  {errors.institutionName && <p className="mt-0.5 text-[10px] text-destructive">Required</p>}
                </div>
                
                <div>
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Contact Person *</label>
                  <input {...register("contactPerson", { required: true })} placeholder="Full Name" className={inputCls} />
                  {errors.contactPerson && <p className="mt-0.5 text-[10px] text-destructive">Required</p>}
                </div>
                
                <div>
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Phone Number *</label>
                  <input {...register("phoneNumber", { required: true, pattern: /^[0-9+\s-]{7,}$/ })} placeholder="+91 …" className={inputCls} />
                  {errors.phoneNumber && <p className="mt-0.5 text-[10px] text-destructive">Enter a valid phone number</p>}
                </div>
                
                <div className="sm:col-span-2">
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Institutional Email *</label>
                  <input type="email" {...register("institutionalEmail", { required: true })} placeholder="email@university.edu" className={inputCls} />
                  {errors.institutionalEmail && <p className="mt-0.5 text-[10px] text-destructive">Required</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Program / Training Required *</label>
                  <select {...register("programTrainingRequired", { required: true })} className={inputCls}>
                    <option value="" className="text-slate-900 dark:text-foreground">Select a program…</option>
                    {PROGRAMS.map((prog, i) => (
                      <option key={i} value={prog} className="text-slate-900 dark:text-foreground">{prog}</option>
                    ))}
                  </select>
                  {errors.programTrainingRequired && <p className="mt-0.5 text-[10px] text-destructive">Required</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Delivery Mode *</label>
                  <select {...register("deliveryMode", { required: true })} className={inputCls}>
                    <option value="" className="text-slate-900 dark:text-foreground">Select mode…</option>
                    <option className="text-slate-900 dark:text-foreground">On Campus</option>
                    <option className="text-slate-900 dark:text-foreground">Online</option>
                    <option className="text-slate-900 dark:text-foreground">Hybrid</option>
                  </select>
                  {errors.deliveryMode && <p className="mt-0.5 text-[10px] text-destructive">Required</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Duration *</label>
                  <select {...register("duration", { required: true })} className={inputCls}>
                    <option value="" className="text-slate-900 dark:text-foreground">Select duration…</option>
                    <option className="text-slate-900 dark:text-foreground">One Day Workshop</option>
                    <option className="text-slate-900 dark:text-foreground">2-3 Days</option>
                    <option className="text-slate-900 dark:text-foreground">1 Week</option>
                    <option className="text-slate-900 dark:text-foreground">2-4 Weeks</option>
                    <option className="text-slate-900 dark:text-foreground">Custom</option>
                  </select>
                  {errors.duration && <p className="mt-0.5 text-[10px] text-destructive">Required</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Expected Participants *</label>
                  <input type="number" min="1" {...register("expectedParticipants", { required: true })} placeholder="e.g., 50" className={inputCls} />
                  {errors.expectedParticipants && <p className="mt-0.5 text-[10px] text-destructive">Required</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-0.5 block text-[10px] font-semibold text-slate-700 dark:text-orange-100/90 uppercase tracking-wider">Additional Requirements (Optional)</label>
                  <textarea
                    {...register("additionalRequirements")}
                    rows={1}
                    placeholder="Any specific syllabus, budget expectations, or preferred dates?"
                    className={inputCls + " resize-none min-h-[38px] py-2"}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-400 px-6 h-[38px] text-[12px] font-bold text-white shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)] transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Request Proposal"} <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
