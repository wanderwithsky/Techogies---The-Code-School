import type { Command, CommandContext } from "./types";
import { ALL_FILES, FILE_BY_NAME, TREE } from "./files";
import { highlight } from "./highlight";
import type { ReactNode } from "react";

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-0.5">
      <div className="text-white/90 font-semibold">{title}</div>
      <ul className="pl-2 space-y-0.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2 text-white/70">
            <span className="h-1 w-1 rounded-full bg-[color:var(--brand)]" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Line({ children, cls = "text-white/70" }: { children?: ReactNode; cls?: string }) {
  return <div className={cls}>{children}</div>;
}

const BANNER = `
 ████████╗███████╗ ██████╗██╗  ██╗ ██████╗  ██████╗ ██╗███████╗███████╗
 ╚══██╔══╝██╔════╝██╔════╝██║  ██║██╔═══██╗██╔════╝ ██║██╔════╝██╔════╝
    ██║   █████╗  ██║     ███████║██║   ██║██║  ███╗██║█████╗  ███████╗
    ██║   ██╔══╝  ██║     ██╔══██║██║   ██║██║   ██║██║██╔══╝  ╚════██║
    ██║   ███████╗╚██████╗██║  ██║╚██████╔╝╚██████╔╝██║███████╗███████║
    ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚══════╝
`;

const commands: Command[] = [
  {
    name: "help",
    description: "Show available commands",
    run: (_a, ctx) => ctx.print(<List title="Available commands" items={ctx.commandNames} />),
  },
  {
    name: "about",
    description: "About Techogies",
    run: (_a, ctx) =>
      ctx.print(
        <div className="space-y-1">
          <Line cls="text-[color:var(--brand)] font-semibold">Techogies · The Code School</Line>
          <Line>We help students become industry-ready through</Line>
          <Line>project-based learning, real mentors, and modern tooling.</Line>
        </div>
      ),
  },
  {
    name: "courses",
    description: "List programs",
    run: (_a, ctx) => {
      ctx.print(
        <List
          title="Available programs"
          items={[
            "Frontend Development",
            "Backend Development",
            "Full Stack Development",
            "Cyber Security",
            "Data Analytics",
            "AI & ML  (coming soon)",
            "DevOps  (coming soon)",
            "Cloud Computing  (coming soon)",
          ]}
        />
      );
      ctx.navigate("/courses");
    },
  },
  {
    name: "mentor",
    description: "Meet the mentors",
    run: (_a, ctx) => {
      ctx.print(<Line>Scrolling to mentors…</Line>);
      ctx.scrollTo("mentors");
    },
  },
  {
    name: "projects",
    description: "Student projects",
    run: (_a, ctx) => {
      ctx.print(<Line>Scrolling to projects…</Line>);
      ctx.scrollTo("projects");
    },
  },
  {
    name: "skills",
    description: "Skills you'll learn",
    run: (_a, ctx) =>
      ctx.print(
        <List
          title="Skills you'll learn"
          items={["Git", "REST APIs", "Authentication", "React", "Express", "MongoDB", "Docker", "AWS", "Testing", "Deployment"]}
        />
      ),
  },
  {
    name: "roadmap",
    description: "Learning roadmap",
    run: (_a, ctx) => {
      ctx.print(
        <List
          title="Learning roadmap"
          items={["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Projects", "Deployment", "Placement"]}
        />
      );
      ctx.scrollTo("roadmap");
    },
  },
  {
    name: "placement",
    description: "Placement services",
    run: (_a, ctx) => {
      ctx.print(<Line>Scrolling to placement…</Line>);
      ctx.scrollTo("placement");
    },
  },
  {
    name: "contact",
    description: "Contact us",
    run: (_a, ctx) => {
      ctx.print(<Line>Scrolling to contact…</Line>);
      ctx.scrollTo("contact");
    },
  },
  {
    name: "whoami",
    description: "Who you are",
    run: (_a, ctx) => ctx.print(<Line cls="text-[color:var(--brand)]">Future Software Engineer 🚀</Line>),
  },
  {
    name: "start-learning",
    description: "Jump to courses",
    run: (_a, ctx) => {
      ctx.print(<Line>Let's go! Opening courses…</Line>);
      ctx.navigate("/courses");
    },
  },
  {
    name: "hire-me",
    description: "Get in touch",
    run: (_a, ctx) => {
      ctx.print(<Line cls="text-emerald-400">Send your résumé to hello@techogies.com — we're hiring builders.</Line>);
    },
  },
  {
    name: "version",
    description: "Workspace version",
    run: (_a, ctx) => ctx.print(<Line>Techogies Workspace v1.0.0</Line>),
  },
  {
    name: "date",
    description: "Current date",
    run: (_a, ctx) => ctx.print(<Line>{new Date().toString()}</Line>),
  },
  {
    name: "echo",
    description: "Echo text",
    run: (args, ctx) => ctx.print(<Line>{args.join(" ")}</Line>),
  },
  {
    name: "pwd",
    description: "Print working directory",
    run: (_a, ctx) => ctx.print(<Line>/techogies/workspace</Line>),
  },
  {
    name: "ls",
    description: "List files",
    run: (_a, ctx) =>
      ctx.print(
        <div className="grid grid-cols-3 gap-x-4 gap-y-0.5 text-white/70">
          {TREE.children.map((c, i) => (
            <span key={i} className={c.type === "folder" ? "text-[color:var(--brand)]" : ""}>
              {c.name}
            </span>
          ))}
        </div>
      ),
  },
  {
    name: "cat",
    description: "Print file contents",
    run: (args, ctx) => {
      const target = (args[0] ?? "").toLowerCase();
      if (!target) {
        ctx.print(<Line cls="text-white/50">usage: cat &lt;file&gt;</Line>);
        return;
      }
      const f = FILE_BY_NAME[target];
      if (!f || !f.source) {
        ctx.print(<Line cls="text-red-400/80">{`cat: ${args[0]}: no such file`}</Line>);
        return;
      }
      ctx.print(
        <div className="font-mono text-[11.5px] leading-[1.6]">
          {highlight(f.source, f.language ?? "jsx")}
        </div>
      );
      ctx.openFile(f.path);
    },
  },
  {
    name: "techogies",
    description: "Show banner",
    run: (_a, ctx) =>
      ctx.print(
        <pre className="text-[color:var(--brand)] leading-tight text-[9px] whitespace-pre">{BANNER}</pre>
      ),
  },
  {
    name: "clear",
    description: "Clear the terminal",
    run: (_a, ctx) => ctx.clearTerminal(),
  },
  // Easter eggs
  {
    name: "coffee",
    description: "",
    hidden: true,
    run: (_a, ctx) => ctx.print(<Line>Coffee not found ☕  Try coding instead.</Line>),
  },
  {
    name: "sudo",
    description: "",
    hidden: true,
    run: (args, ctx) => {
      if (args.join(" ").trim() === "hire-me") {
        ctx.print(<Line cls="text-emerald-400">Permission granted. You're hired. …Almost 😄</Line>);
      } else {
        ctx.print(<Line cls="text-red-400/80">sudo: password required</Line>);
      }
    },
  },
  {
    name: "love",
    description: "",
    hidden: true,
    run: (_a, ctx) => ctx.print(<Line cls="text-pink-400">We love clean code ❤️</Line>),
  },
  {
    name: "404",
    description: "",
    hidden: true,
    run: (_a, ctx) => ctx.print(<Line>Command not found. (or is it?)</Line>),
  },
  {
    name: "open",
    description: "Open a file in the editor",
    hidden: true,
    run: (args, ctx) => {
      const target = (args[0] ?? "").toLowerCase();
      const f = FILE_BY_NAME[target];
      if (!f) {
        ctx.print(<Line cls="text-red-400/80">{`open: ${args[0]}: not found`}</Line>);
        return;
      }
      ctx.openFile(f.path);
      ctx.print(<Line>{`Opened ${f.name}`}</Line>);
    },
  },
];

export const COMMANDS: Record<string, Command> = Object.fromEntries(
  commands.map((c) => [c.name, c])
);

export const VISIBLE_COMMAND_NAMES = commands.filter((c) => !c.hidden).map((c) => c.name);
export const ALL_COMMAND_NAMES = commands.map((c) => c.name);

export function runCommand(input: string, baseCtx: Omit<CommandContext, "commandNames">) {
  const trimmed = input.trim();
  if (!trimmed) return;
  const [name, ...args] = trimmed.split(/\s+/);
  const ctx: CommandContext = { ...baseCtx, commandNames: VISIBLE_COMMAND_NAMES };
  const cmd = COMMANDS[name.toLowerCase()];
  if (!cmd) {
    ctx.print(
      <div className="text-white/60">
        {`command not found: ${name}. type `}
        <span className="text-[color:var(--brand)]">help</span>
      </div>
    );
    return;
  }
  cmd.run(args, ctx);
}

export { ALL_FILES };