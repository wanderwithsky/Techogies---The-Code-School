import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import site from "@/data/site.json";
import courses from "@/data/courses.json";
import { useEnroll } from "@/context/EnrollContext";
import { SectionHeading } from "@/components/common/SectionHeading";
import { submitContact } from "@/lib/contact.functions";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  city: string;
  qualification: string;
  course: string;
  message: string;
};

export function Contact() {
  const { selectedCourse, setSelectedCourse } = useEnroll();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { course: selectedCourse } });
  const submit = useServerFn(submitContact);

  useEffect(() => {
    if (selectedCourse) setValue("course", selectedCourse);
  }, [selectedCourse, setValue]);

  const onSubmit = async (v: FormValues) => {
    try {
      const result = await submit({ data: v });
      if (!result.ok) {
        toast.error(result.error ?? "Submission failed. Please try again.");
        console.error("Contact submission failed:", result.error);
        return;
      }
      toast.success("Enquiry submitted! Our team will call you within 24 hours.");
      reset();
      setSelectedCourse("");
    } catch (err) {
      toast.error("Submission failed. Please try again.");
      console.error("Contact submission error:", err);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring";

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to our team"
          subtitle="Tell us about you and we'll get back within 24 hours with a personalised plan."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Full Name</label>
                <input {...register("name", { required: true })} placeholder="Your name" className={inputCls} />
                {errors.name && <p className="mt-1 text-xs text-destructive">Required</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Phone Number</label>
                <input
                  {...register("phone", { required: true, pattern: /^[0-9+\s-]{7,}$/ })}
                  placeholder="+91 …"
                  className={inputCls}
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">Enter a valid phone</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="you@example.com"
                  className={inputCls}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">Required</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">City</label>
                <input {...register("city", { required: true })} placeholder="Your city" className={inputCls} />
                {errors.city && <p className="mt-1 text-xs text-destructive">Required</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Highest Qualification</label>
                <select {...register("qualification", { required: true })} className={inputCls}>
                  <option value="">Select…</option>
                  <option>10th / 12th</option>
                  <option>Diploma</option>
                  <option>Bachelor's</option>
                  <option>Master's</option>
                  <option>Working Professional</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">Course Interested</label>
                <select {...register("course", { required: true })} className={inputCls}>
                  <option value="">Select a course…</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold text-foreground">Message</label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Tell us about your goals (optional)"
                className={inputCls + " resize-none"}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Send size={15} /> {isSubmitting ? "Submitting…" : "Submit Enquiry"}
              </button>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                WhatsApp Us
              </a>
            </div>
          </form>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="border-b border-border p-6">
                <h3 className="text-lg font-semibold text-foreground">Varanasi</h3>
                <p className="text-sm text-muted-foreground">UBI Building, Sigra, Varanasi, India</p>
              </div>
              <div className="w-full h-[260px] sm:h-[320px] lg:h-[400px] overflow-hidden">
                <iframe
                  title="Techogies location"
                  src="https://maps.google.com/maps?q=UBI%20Building,%20Sigra,%20Varanasi,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                />
              </div>
              <div className="space-y-3 p-6 text-sm">
                <p className="flex items-start gap-3 text-foreground">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{site.address}</span>
                </p>
                <p className="flex items-center gap-3 text-foreground">
                  <Mail size={17} className="text-primary" />
                  <a href={`mailto:${site.email}`} className="text-muted-foreground hover:text-foreground">
                    {site.email}
                  </a>
                </p>
                <p className="flex items-center gap-3 text-foreground">
                  <Phone size={17} className="text-primary" />
                  <a href={`tel:${site.phone}`} className="text-muted-foreground hover:text-foreground">
                    {site.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}