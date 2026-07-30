import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ArrowRight, Terminal, Shield, Network, Lock, Server, Database, Code2, GitBranch } from "lucide-react";
import { Link } from "@tanstack/react-router";

const FULL_STACK_TAGS = ["React", "Node.js", "Express", "MongoDB", "Git", "REST APIs", "Docker", "Cloud", "AI Integration"];
const CYBER_TAGS = ["Linux", "Networking", "Ethical Hacking", "OWASP", "Burp Suite", "Wireshark", "Nmap", "Metasploit", "SOC"];

function FullStackCard({ isActive, isHovered, onHover }: { isActive: boolean; isHovered: boolean; onHover: (hovered: boolean) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax mouse values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const xOffset = useTransform(springX, [0, 1], [-15, 15]);
  const yOffset = useTransform(springY, [0, 1], [-15, 15]);
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    onHover(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={() => onHover(true)}
      animate={{
        scale: isHovered ? 1.03 : 1,
        opacity: !isActive ? 0.6 : 1,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 transition-colors duration-500 ${isHovered ? 'border-[color:var(--brand)] shadow-[0_20px_50px_-10px_rgba(255,107,0,0.2)]' : 'border-border shadow-lg'}`}
    >
      {/* Dynamic Glow Background */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [springX, springY],
            ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,107,0,0.1) 0%, transparent 50%)`
          )
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 mb-8">
        <h3 className="font-display text-3xl font-bold text-foreground">Full Stack Development</h3>
        <p className="mt-3 text-muted-foreground">Build modern web applications from frontend to deployment.</p>
      </div>

      {/* Parallax UI Container (Always Dark) */}
      <motion.div 
        style={{ x: xOffset, y: yOffset }}
        className="relative z-10 flex-1 min-h-[300px] w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#18181B] overflow-hidden shadow-2xl"
      >
        {/* VS Code Header */}
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] bg-[#232326] px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <div className="ml-4 flex gap-4 text-[10px] text-[#A1A1AA]">
            <span className="text-white">server.ts</span>
            <span>App.tsx</span>
          </div>
        </div>
        
        <div className="flex h-[calc(100%-45px)]">
          {/* File Explorer */}
          <div className="w-12 sm:w-16 border-r border-[rgba(255,255,255,0.08)] bg-[#1F1F22] flex flex-col items-center py-4 gap-4 text-[#A1A1AA]">
            <Code2 size={18} className="text-white" />
            <GitBranch size={18} />
            <Server size={18} />
            <Database size={18} />
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 p-4 font-mono text-xs sm:text-sm text-[#A1A1AA] relative">
            <p><span className="text-[#c678dd]">import</span> {'{'} <span className="text-[#e5c07b]">express</span> {'}'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'express'</span>;</p>
            <p><span className="text-[#c678dd]">import</span> {'{'} <span className="text-[#e5c07b]">connectDB</span> {'}'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'./config/db'</span>;</p>
            <br />
            <p><span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">app</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#61afef]">express</span>();</p>
            <p className="mt-2 text-[#A1A1AA]/50">// Initialize cloud deployment</p>
            <p><span className="text-[#e5c07b]">app</span>.<span className="text-[#61afef]">deploy</span>({'{'} <span className="text-[#d19a66]">region</span>: <span className="text-[#98c379]">'aws-ap-south-1'</span> {'}'});</p>
            
            {/* Floating Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-4 right-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 rounded bg-green-500/20 px-3 py-1.5 border border-green-500/30 text-[10px] text-green-400 font-bold tracking-wider">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span></span> DEPLOYED
              </div>
              <div className="flex items-center gap-2 rounded bg-blue-500/20 px-3 py-1.5 border border-blue-500/30 text-[10px] text-blue-400 font-mono">
                node v20.10.0
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tags */}
      <div className="relative z-10 mt-8 flex flex-wrap gap-2">
        {FULL_STACK_TAGS.map((tag, i) => (
          <motion.span 
            key={tag}
            initial={{ y: 0 }}
            animate={isHovered ? { y: -5, backgroundColor: "rgba(128,128,128,0.1)" } : { y: 0, backgroundColor: "transparent" }}
            transition={{ delay: i * 0.05 }}
            className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors"
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* CTA */}
      <Link to="/courses" hash="full-stack" className="relative z-10 mt-8 flex w-fit items-center gap-2 font-medium text-[color:var(--brand)] transition-colors hover:text-foreground">
        Explore Full Stack <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}

function CyberSecurityCard({ isActive, isHovered, onHover }: { isActive: boolean; isHovered: boolean; onHover: (hovered: boolean) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax mouse values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const xOffset = useTransform(springX, [0, 1], [-15, 15]);
  const yOffset = useTransform(springY, [0, 1], [-15, 15]);
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    onHover(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={() => onHover(true)}
      animate={{
        scale: isHovered ? 1.03 : 1,
        opacity: !isActive ? 0.6 : 1,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 transition-colors duration-500 ${isHovered ? 'border-[color:var(--brand)] shadow-[0_20px_50px_-10px_rgba(255,107,0,0.2)]' : 'border-border shadow-lg'}`}
    >
      {/* Dynamic Glow Background */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [springX, springY],
            ([x, y]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,107,0,0.1) 0%, transparent 50%)`
          )
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 mb-8">
        <h3 className="font-display text-3xl font-bold text-foreground">Cyber Security & Ethical Hacking</h3>
        <p className="mt-3 text-muted-foreground">Learn how to secure applications, networks and digital infrastructure.</p>
      </div>

      {/* Parallax UI Container (Always Dark) */}
      <motion.div 
        style={{ x: xOffset, y: yOffset }}
        className="relative z-10 flex-1 min-h-[300px] w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#18181B] overflow-hidden shadow-2xl p-4 flex flex-col gap-3"
      >
        {/* Top Status Bar */}
        <div className="flex justify-between items-center bg-[#232326] rounded-lg p-3 border border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <Shield className="text-[#FF6B00]" size={20} />
            <div>
              <div className="text-[10px] text-[#A1A1AA] uppercase tracking-widest font-bold">System Status</div>
              <div className="text-xs text-white font-mono">Active Protection</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[20px] font-bold text-green-400 font-mono tracking-tight">100/100</div>
            <div className="text-[9px] text-green-400/50 uppercase">Security Score</div>
          </div>
        </div>

        <div className="flex gap-3 flex-1 h-[180px]">
          {/* Terminal / Logs */}
          <div className="flex-1 bg-[#1F1F22] rounded-lg border border-[rgba(255,255,255,0.08)] p-3 font-mono text-[10px] text-green-500/80 overflow-hidden relative">
            <div className="text-[#A1A1AA] mb-2 border-b border-[rgba(255,255,255,0.08)] pb-1 flex justify-between">
              <span>root@kali:~#</span>
              <Terminal size={12} />
            </div>
            <motion.div animate={isHovered ? { y: [-10, 0] } : { y: 0 }} transition={{ duration: 0.5 }}>
              <p>Starting Nmap 7.93 ( https://nmap.org )</p>
              <p className="mt-1">Initiating SYN Stealth Scan</p>
              <p className="mt-1 text-[#A1A1AA]">Scanning 192.168.1.1 [1000 ports]</p>
              <p className="mt-1 text-yellow-400">Discovered open port 443/tcp</p>
              <p className="mt-1 text-yellow-400">Discovered open port 80/tcp</p>
              {isHovered && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-1 text-red-400 font-bold animate-pulse">
                  [!] Vulnerability detected: CVE-2023-XXXX
                </motion.p>
              )}
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#1F1F22] to-transparent" />
          </div>

          {/* Network Graph */}
          <div className="hidden sm:flex w-1/3 bg-[#1F1F22] rounded-lg border border-[rgba(255,255,255,0.08)] p-3 flex-col items-center justify-center relative overflow-hidden">
            <Network size={24} className="text-[#A1A1AA]/50 mb-2" />
            <div className="text-[9px] text-[#A1A1AA] uppercase tracking-widest text-center">Topology Map</div>
            
            {/* Animated Nodes */}
            <motion.div 
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center opacity-30"
            >
              <div className="absolute h-16 w-16 rounded-full border border-white/20 border-dashed" />
              <div className="absolute top-1/2 left-4 h-2 w-2 rounded-full bg-[#FF6B00]" />
              <div className="absolute top-4 left-1/2 h-2 w-2 rounded-full bg-blue-500" />
              <div className="absolute bottom-4 right-8 h-2 w-2 rounded-full bg-green-500" />
            </motion.div>
            
            {/* Middle Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white z-10 shadow-[0_0_10px_white]" />
            
            {/* Scan Wave */}
            {isHovered && (
              <motion.div 
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-[#FF6B00]"
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Tags */}
      <div className="relative z-10 mt-8 flex flex-wrap gap-2">
        {CYBER_TAGS.map((tag, i) => (
          <motion.span 
            key={tag}
            initial={{ y: 0 }}
            animate={isHovered ? { y: -5, backgroundColor: "rgba(128,128,128,0.1)" } : { y: 0, backgroundColor: "transparent" }}
            transition={{ delay: i * 0.05 }}
            className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors"
          >
            {tag}
          </motion.span>
        ))}
      </div>

      {/* CTA */}
      <Link to="/courses" hash="cyber-security" className="relative z-10 mt-8 flex w-fit items-center gap-2 font-medium text-[color:var(--brand)] transition-colors hover:text-foreground">
        Explore Cyber Security <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}

export function CareerPaths() {
  const [hoveredCard, setHoveredCard] = useState<"fullstack" | "cyber" | null>(null);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-background">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading
            eyebrow="Career Paths"
            title="Choose Your Mission"
            subtitle="Whether you want to build modern software or protect digital systems, Techogies prepares you for real industry careers."
          />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FullStackCard 
              isActive={hoveredCard === null || hoveredCard === "fullstack"} 
              isHovered={hoveredCard === "fullstack"}
              onHover={(isHovering) => setHoveredCard(isHovering ? "fullstack" : null)}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CyberSecurityCard 
              isActive={hoveredCard === null || hoveredCard === "cyber"} 
              isHovered={hoveredCard === "cyber"}
              onHover={(isHovering) => setHoveredCard(isHovering ? "cyber" : null)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
