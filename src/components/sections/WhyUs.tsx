import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";

const JOURNEY_STEPS = [
  {
    icon: "📚",
    title: "Learn the Fundamentals",
    desc: "Master programming fundamentals through structured live classes and practical exercises.",
    visual: (isActive: boolean) => (
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#18181B] font-sans">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[#232326] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"></span></span> LIVE CLASS
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-12 sm:w-16 border-r border-[rgba(255,255,255,0.08)] bg-[#1F1F22] p-2 flex flex-col gap-2 items-center sm:items-start">
            <div className="h-4 w-4 rounded bg-white/10" />
            <div className="h-4 w-4 rounded bg-white/10" />
            <div className="h-4 w-4 rounded bg-white/5" />
          </div>
          <div className="flex-1 p-3 sm:p-5 font-mono text-[11px] sm:text-[13px] text-white">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }} transition={{ delay: 0.1 }}>
              <span className="text-[#c678dd]">import</span> {'{'} <span className="text-[#e5c07b]">Fundamentals</span> {'}'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'@techogies/core'</span>;
            </motion.div>
            <br />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }} transition={{ delay: 0.2 }}>
              <span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">student</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#c678dd]">new</span> <span className="text-[#e5c07b]">Fundamentals</span>();
            </motion.div>
            <motion.div initial={{ width: 0 }} animate={{ width: isActive ? "100%" : 0 }} className="overflow-hidden whitespace-nowrap text-[#98c379] mt-1" transition={{ delay: 0.4, duration: 1 }}>
              await student.master(['JS', 'React', 'Node']);
            </motion.div>
          </div>
        </div>
        <div className="border-t border-[rgba(255,255,255,0.08)] bg-[#232326] px-4 py-1.5 flex items-center justify-between text-[10px] text-[#A1A1AA] font-mono">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">❌ 0</span>
            <span className="flex items-center gap-1">⚠️ 0</span>
          </div>
          <div className="hidden sm:block">Prettier: ✓</div>
        </div>
      </div>
    )
  },
  {
    icon: "💻",
    title: "Build Real Projects",
    desc: "Build production-grade projects that become your portfolio and demonstrate real skills.",
    visual: (isActive: boolean) => (
      <div className="flex h-full w-full flex-col bg-[#18181B] p-4 text-white font-sans">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
          <div className="text-sm font-semibold">E-Commerce Platform</div>
          <div className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400 border border-green-500/20">Deployed</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1F1F22] p-3 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-medium">Tech Stack</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] text-blue-400 font-medium">React</span>
              <span className="rounded bg-gray-500/20 px-1.5 py-0.5 text-[10px] text-gray-300 font-medium">Next.js</span>
              <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] text-green-400 font-medium">Node</span>
            </div>
          </div>
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1F1F22] p-3 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-medium">Analytics</div>
            <div className="mt-1 font-mono text-lg font-bold">12.4k</div>
            <div className="text-[10px] text-green-400 font-medium">+14% this week</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1F1F22] p-3 shadow-sm">
          <div className="flex justify-between text-[11px] text-[#A1A1AA] font-medium">
            <span>Commit History</span>
            <span className="text-[#FF6B00]">87% Complete</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div initial={{ width: "0%" }} animate={{ width: isActive ? "87%" : "0%" }} transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }} className="h-full bg-[#FF6B00]" />
          </div>
        </div>
      </div>
    )
  },
  {
    icon: "👨‍🏫",
    title: "Learn from Industry Mentors",
    desc: "Receive guidance from experienced engineers through live mentoring sessions and code reviews.",
    visual: (isActive: boolean) => (
      <div className="flex h-full w-full flex-col bg-[#18181B] p-4 sm:p-5 text-sm text-white font-sans relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://i.pravatar.cc/100?img=11" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#232326]" alt="Mentor" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[9px] font-bold shadow-lg border border-[#18181B]">G</div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[13px] sm:text-sm">Rohan Sharma</div>
            <div className="text-[10px] sm:text-[11px] text-[#A1A1AA]">Senior Engineer @ Google</div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex h-7 items-center gap-1 rounded-md bg-[#FF6B00] px-2 sm:px-3 text-[10px] sm:text-xs font-semibold text-white cursor-pointer shadow-lg">
            Join Call
          </motion.div>
        </div>
        
        <div className="mt-5 sm:mt-6 flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1F1F22] p-3 sm:p-4 font-mono text-[11px] sm:text-xs text-[#A1A1AA] shadow-sm">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2 mb-2 sm:mb-3">
            <span className="text-[#A1A1AA]/70 uppercase tracking-widest text-[9px] sm:text-[10px]">Code Review</span>
            <span className="text-green-400 font-sans text-[10px] sm:text-[11px] flex items-center gap-1 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Approved</span>
          </div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }} transition={{ delay: 0.2 }} className="mb-2">
            <span className="text-blue-400">+</span> Great optimization here.
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }} transition={{ delay: 0.4 }}>
            <span className="text-blue-400">+</span> The state management looks solid!
          </motion.div>
        </div>
      </div>
    )
  },
  {
    icon: "🚀",
    title: "Internship Experience",
    desc: "Work on practical client-style projects and gain hands-on industry experience.",
    visual: (isActive: boolean) => (
      <div className="flex h-full w-full flex-col bg-[#18181B] p-4 text-white font-sans">
        <div className="flex justify-between pb-3 text-xs font-semibold border-b border-[rgba(255,255,255,0.08)]">
          <span>Sprint 4 <span className="text-[#A1A1AA] font-normal ml-1">Fintech App</span></span>
          <span className="text-[#A1A1AA]">4 Days left</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 flex-1">
          <div className="flex flex-col gap-2.5">
            <div className="text-[9px] sm:text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">To Do</div>
            <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: isActive ? 0 : -15, opacity: isActive ? 1 : 0 }} transition={{ delay: 0.1, type: "spring" }} className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[#1F1F22] p-2 sm:p-2.5 text-[9px] sm:text-[10px] shadow-sm font-medium">Setup DB schema</motion.div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="text-[9px] sm:text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">In Progress</div>
            <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: isActive ? 0 : -15, opacity: isActive ? 1 : 0 }} transition={{ delay: 0.3, type: "spring" }} className="rounded-md border border-[#FF6B00]/40 bg-[#FF6B00]/10 text-[#FF6B00] p-2 sm:p-2.5 text-[9px] sm:text-[10px] shadow-sm font-semibold">Auth API</motion.div>
            <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: isActive ? 0 : -15, opacity: isActive ? 1 : 0 }} transition={{ delay: 0.4, type: "spring" }} className="rounded-md border border-[#FF6B00]/40 bg-[#FF6B00]/10 text-[#FF6B00] p-2 sm:p-2.5 text-[9px] sm:text-[10px] shadow-sm font-semibold">OAuth flow</motion.div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="text-[9px] sm:text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Done</div>
            <div className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[#232326] p-2 sm:p-2.5 text-[9px] sm:text-[10px] line-through text-[#A1A1AA]">Project setup</div>
          </div>
        </div>
      </div>
    )
  }
];

function Step({ step, index, progress, totalSteps }: { step: any, index: number, progress: any, totalSteps: number }) {
  const [isActiveState, setIsActiveState] = useState(false);
  
  const target = index / (totalSteps - 1);
  const range = 1 / totalSteps;
  
  const input = [
    target - range,
    target,
    index === totalSteps - 1 ? 1.5 : target + range
  ];
  
  useMotionValueEvent(progress, "change", (p) => {
    const active = index === totalSteps - 1 ? p >= target - range : (p >= target - range && p < target + range);
    if (active !== isActiveState) {
      setIsActiveState(active);
    }
  });
  
  const opacityOutput = [0.4, 1, index === totalSteps - 1 ? 1 : 0.4];
  const cardScaleOutput = [0.95, 1, index === totalSteps - 1 ? 1 : 0.95];
  const iconScaleOutput = [0.8, 1.25, index === totalSteps - 1 ? 1.25 : 0.8];
  const yOutput = [30, 0, index === totalSteps - 1 ? 0 : 30];

  const opacity = useTransform(progress, input, opacityOutput);
  const cardScale = useTransform(progress, input, cardScaleOutput);
  const iconScale = useTransform(progress, input, iconScaleOutput);
  const yOffset = useTransform(progress, input, yOutput);
  
  return (
    <div className="relative flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-16 pl-[60px] md:pl-[140px]">
      
      {/* Icon marker */}
      <div className={`absolute left-[12px] md:left-[44px] top-0 md:top-8 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-[4px] border-background bg-card z-10 transition-all duration-500 ${isActiveState ? 'shadow-[0_0_20px_rgba(255,107,0,0.5)] border-[color:var(--brand)]' : 'border-border'}`}>
        <motion.div style={{ scale: iconScale }} className="relative z-10 text-xl md:text-2xl transition-transform">{step.icon}</motion.div>
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity, y: yOffset }}
        className="w-full md:w-5/12 flex flex-col justify-center py-2 md:py-6"
      >
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight transition-colors duration-500">{step.title}</h3>
        <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground leading-relaxed transition-colors duration-500">{step.desc}</p>
      </motion.div>

      {/* Visual Box */}
      <div className="w-full md:w-7/12 py-4">
        <motion.div 
          style={{ opacity, scale: cardScale, y: yOffset }}
          className={`relative aspect-video w-full overflow-hidden rounded-3xl border bg-card transition-all duration-500 ${isActiveState ? 'border-[color:var(--brand)]/60 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.2)]' : 'border-border shadow-lg'}`}
        >
          {step.visual(isActiveState)}
        </motion.div>
      </div>

    </div>
  );
}

export function WhyUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <section id="why" className="relative bg-background py-24 sm:py-32 overflow-hidden transition-colors duration-500">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="Your Journey"
          title="From Beginner to Industry-Ready Developer"
          subtitle="A structured learning journey that transforms you from writing your first line of code to receiving your first job offer."
        />

        <div ref={containerRef} className="relative mt-20 md:mt-32 pb-10">
          {/* Timeline Line */}
          <div className="absolute bottom-0 left-[34px] top-4 w-[2px] bg-border md:left-[71px] transition-colors duration-500">
            <motion.div 
              className="absolute left-0 right-0 top-0 bg-[color:var(--brand)] origin-top shadow-[0_0_15px_color-mix(in_oklab,var(--brand)_60%,transparent)]"
              style={{ scaleY: smoothProgress }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex flex-col gap-20 md:gap-32">
            {JOURNEY_STEPS.map((step, index) => (
              <Step key={step.title} step={step} index={index} progress={smoothProgress} totalSteps={JOURNEY_STEPS.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}