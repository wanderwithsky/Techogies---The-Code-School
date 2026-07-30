import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: ReactNode;
};

export function GradientButton({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60",
        variant === "primary"
          ? "bg-gradient-brand text-primary-foreground shadow-elegant hover:-translate-y-0.5 hover:shadow-[0_25px_70px_-15px_var(--brand)]"
          : "glass text-foreground hover:bg-accent",
        className
      )}
    >
      {children}
    </button>
  );
}