import {
  ArrowRight,
  BarChart3,
  Cloud,
  Code2,
  GitBranch,
  Heart,
  Layers,
  Mail,
  Palette,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ArrowRight,
  BarChart3,
  Cloud,
  Code2,
  GitBranch,
  Heart,
  Layers,
  Mail,
  Palette,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
};

export function Icon({
  name,
  size = 18,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp size={size} className={className} aria-hidden="true" />;
}