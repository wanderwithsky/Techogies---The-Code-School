import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "./types";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "Only digits and +()- allowed"),
  qualification: z.string().trim().min(2, "Required").max(100),
  courseId: z.string().min(1, "Select a course"),
  skillLevel: z.string().min(1, "Select your skill level"),
  careerGoal: z.string().trim().min(2, "Required").max(120),
  contactTime: z.string().min(1, "Select a time"),
});

type FormValues = z.infer<typeof schema>;

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const CONTACT_TIMES = ["Morning (9am - 12pm)", "Afternoon (12pm - 4pm)", "Evening (4pm - 8pm)"];

export function CallbackSection({ courses }: { courses: Course[] }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      qualification: "",
      courseId: "",
      skillLevel: "",
      careerGoal: "",
      contactTime: "",
    },
  });

  const onSubmit = async (_values: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  return (
    <section className="relative overflow-hidden border-t border-border/60 py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(50%_50%_at_50%_0%,hsl(var(--primary)/0.14),transparent_70%)]"
      />
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <PhoneCall size={12} /> Free Career Callback
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Not sure which course is right for you?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Speak with our career experts and receive a personalized learning roadmap.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.4)] backdrop-blur-xl sm:p-10">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14 }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"
                >
                  <CheckCircle2 size={34} />
                </motion.div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  Thank you! Our career advisor will contact you shortly.
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  We've received your request and will call you during your preferred time window.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another request
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="grid gap-5 sm:grid-cols-2"
              >
                <Field label="Full Name" error={errors.fullName?.message}>
                  <Input {...register("fullName")} placeholder="Aditi Sharma" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <Input type="email" {...register("email")} placeholder="you@example.com" />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <Input type="tel" {...register("phone")} placeholder="+91 98XXXXXXXX" />
                </Field>
                <Field label="Current Qualification" error={errors.qualification?.message}>
                  <Input {...register("qualification")} placeholder="B.Tech, BCA, Diploma…" />
                </Field>
                <Field label="Interested Course" error={errors.courseId?.message}>
                  <Select
                    value={watch("courseId")}
                    onValueChange={(v) => setValue("courseId", v, { shouldValidate: true })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Current Skill Level" error={errors.skillLevel?.message}>
                  <Select
                    value={watch("skillLevel")}
                    onValueChange={(v) => setValue("skillLevel", v, { shouldValidate: true })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {SKILL_LEVELS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Career Goal" error={errors.careerGoal?.message} className="sm:col-span-2">
                  <Input {...register("careerGoal")} placeholder="e.g. Full Stack Developer at a product company" />
                </Field>
                <Field label="Preferred Contact Time" error={errors.contactTime?.message} className="sm:col-span-2">
                  <Select
                    value={watch("contactTime")}
                    onValueChange={(v) => setValue("contactTime", v, { shouldValidate: true })}
                  >
                    <SelectTrigger><SelectValue placeholder="Pick a time window" /></SelectTrigger>
                    <SelectContent>
                      {CONTACT_TIMES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden rounded-full bg-gradient-brand py-6 text-sm font-semibold text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-16px_hsl(var(--primary)/0.6)]"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "Sending…" : "Request Free Career Callback"}
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    By submitting you agree to be contacted by our career team.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}