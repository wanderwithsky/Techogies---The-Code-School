import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { CheckCircle2, X } from "lucide-react";
import { useEnroll } from "@/context/EnrollContext";
import { useServerFn } from "@tanstack/react-start";
import { submitEnrollment } from "@/lib/enroll.functions";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  location: string;
};

export function EnrollModal() {
  const { isEnrollOpen, closeEnroll } = useEnroll();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onTouched" });

  const submit = useServerFn(submitEnrollment);

  // Lock scroll + remember focus origin
  useEffect(() => {
    if (!isEnrollOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      previouslyFocused.current?.focus?.();
    };
  }, [isEnrollOpen]);

  // Escape + focus trap
  useEffect(() => {
    if (!isEnrollOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        handleClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isEnrollOpen]);

  function handleClose() {
    closeEnroll();
    // reset after exit animation
    setTimeout(() => {
      reset();
      setSubmitted(false);
      setSubmitError(null);
    }, 300);
  }


  const onSubmit = async (v: FormValues) => {
    setSubmitError(null);
    try {
      const result = await submit({ data: v });
      if (!result.ok) {
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      reset();
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (err) {
      console.error("Enrollment submission error:", err);
      setSubmitError("Something went wrong. Please try again.");
    }
  };


  const inputCls =
    "w-full rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/70 focus:ring-2 focus:ring-primary/25";
  const labelCls = "mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground";
  const errorCls = "mt-1 text-xs text-destructive";

  return (
    <AnimatePresence>
      {isEnrollOpen && (
        <motion.div
          key="enroll-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
            onClick={handleClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enroll-title"
            aria-describedby="enroll-desc"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] border border-border/60 bg-card/80 shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.25),0_10px_40px_-10px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          >
            {/* Decorative orange glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
            />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close enrollment dialog"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <X size={16} />
            </button>

            {!submitted ? (
              <div className="relative p-7 sm:p-9">
                <div className="mb-6">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary">
                    Enrollment
                  </div>
                  <h2
                    id="enroll-title"
                    className="text-2xl font-bold tracking-tight text-foreground sm:text-[26px]"
                  >
                    Start Your Tech Journey
                  </h2>
                  <p id="enroll-desc" className="mt-1.5 text-sm text-muted-foreground">
                    Fill in your details and our team will contact you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
                  <div>
                    <label htmlFor="enroll-name" className={labelCls}>
                      Full Name *
                    </label>
                    <input
                      id="enroll-name"
                      type="text"
                      placeholder="Enter your full name"
                      className={inputCls}
                      aria-invalid={!!errors.name}
                      {...register("name", {
                        required: "Name is required.",
                        minLength: { value: 2, message: "Name is required." },
                      })}
                      ref={(el) => {
                        register("name").ref(el);
                        firstFieldRef.current = el;
                      }}
                    />
                    {errors.name && <p className={errorCls}>{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="enroll-email" className={labelCls}>
                      Email Address *
                    </label>
                    <input
                      id="enroll-email"
                      type="email"
                      placeholder="you@example.com"
                      className={inputCls}
                      aria-invalid={!!errors.email}
                      {...register("email", {
                        required: "Enter a valid email address.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address.",
                        },
                      })}
                    />
                    {errors.email && <p className={errorCls}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="enroll-phone" className={labelCls}>
                      Phone Number *
                    </label>
                    <input
                      id="enroll-phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className={inputCls}
                      aria-invalid={!!errors.phone}
                      {...register("phone", {
                        required: "Enter a valid phone number.",
                        pattern: {
                          value: /^[+()\-\s\d]{7,20}$/,
                          message: "Enter a valid phone number.",
                        },
                        validate: (v) =>
                          (v.replace(/\D/g, "").length >= 7 &&
                            v.replace(/\D/g, "").length <= 15) ||
                          "Enter a valid phone number.",
                      })}
                    />
                    {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="enroll-location" className={labelCls}>
                      Location (City / State) *
                    </label>
                    <input
                      id="enroll-location"
                      type="text"
                      placeholder="City, State"
                      className={inputCls}
                      aria-invalid={!!errors.location}
                      {...register("location", {
                        required: "Location is required.",
                        minLength: { value: 2, message: "Location is required." },
                      })}
                    />
                    {errors.location && (
                      <p className={errorCls}>{errors.location.message}</p>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-xl border border-border/70 bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-8px_hsl(var(--primary)/0.6)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span className="relative z-10">
                        {isSubmitting ? "Submitting…" : "Submit Enrollment"}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      />
                    </button>
                  </div>

                  {submitError && (
                    <p className={errorCls} role="alert">
                      {submitError}
                    </p>
                  )}
                </form>

              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative flex flex-col items-center px-7 py-12 text-center sm:px-9"
              >
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                  <CheckCircle2 size={34} strokeWidth={2} />
                </div>
                <h2
                  id="enroll-title"
                  className="text-2xl font-bold tracking-tight text-foreground"
                >
                  Enrollment Request Submitted!
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Thank you for your interest. Our team will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-7 inline-flex items-center justify-center rounded-xl bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-8px_hsl(var(--primary)/0.6)]"
                >
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}