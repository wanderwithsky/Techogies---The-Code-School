import type { FileNode, FolderNode, TreeNode } from "./types";

const heroSrc = `export default function Hero() {
  return (
    <section className="hero">
      <span className="badge">New cohort · Live in 14 days</span>
      <h1 className="headline">
        <span className="gradient">Code, Build, Deploy.</span>
        Become an Industry-Ready Developer.
      </h1>
      <p className="lead">
        Learn modern web development, secure APIs,
        databases, and cloud deployment by building
        real projects with expert mentors.
      </p>
      <div className="cta">
        <Button variant="primary">Explore Courses</Button>
        <Button variant="ghost">Book Consultation</Button>
      </div>
    </section>
  );
}
`;

const navbarSrc = `import { Link } from "@tanstack/react-router";
import { NAV } from "@/data/nav.json";

export function Navbar() {
  return (
    <nav className="glass floating">
      <Logo />
      <ul className="links">
        {NAV.map((item) => (
          <li key={item.id}>
            <Link to={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <button className="cta shimmer">Enroll Now</button>
    </nav>
  );
}
`;

const coursesSrc = `import courses from "@/data/courses.json";

export function Courses() {
  return (
    <section id="courses" className="grid">
      <h2>Programs built to get you hired</h2>
      <div className="cards">
        {courses.map((c) => (
          <article key={c.id} className="card hover-lift">
            <Icon name={c.icon} />
            <h3>{c.title}</h3>
            <p>{c.summary}</p>
            <span className="price">{c.price}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
`;

const footerSrc = `export function Footer() {
  return (
    <footer className="footer">
      <div className="brand">
        <img src="/logo.png" alt="Techogies" />
        <p>The Code School</p>
      </div>
      <nav className="links">
        <a href="#courses">Courses</a>
        <a href="#mentors">Mentors</a>
        <a href="#contact">Contact</a>
      </nav>
      <p className="fine">© 2026 Techogies</p>
    </footer>
  );
}
`;

const packageSrc = `{
  "name": "techogies-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0"
  }
}
`;

const viteSrc = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
`;

const useScrollSrc = `import { useEffect, useState } from "react";

export function useScroll() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return y;
}
`;

const formatSrc = `export function format(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
}
`;

const homeSrc = `import { Hero } from "@/components/Hero";
import { Courses } from "@/components/Courses";

export default function Home() {
  return (
    <>
      <Hero />
      <Courses />
    </>
  );
}
`;

function file(name: string, path: string, source?: string, language: FileNode["language"] = "jsx"): FileNode {
  return { type: "file", name, path, source, language };
}

export const TREE: FolderNode = {
  type: "folder",
  name: "TECHOGIES-APP",
  path: "/",
  children: [
    {
      type: "folder",
      name: "src",
      path: "/src",
      children: [
        {
          type: "folder",
          name: "components",
          path: "/src/components",
          children: [
            file("Hero.jsx", "/src/components/Hero.jsx", heroSrc, "jsx"),
            file("Navbar.jsx", "/src/components/Navbar.jsx", navbarSrc, "jsx"),
            file("Courses.jsx", "/src/components/Courses.jsx", coursesSrc, "jsx"),
            file("Footer.jsx", "/src/components/Footer.jsx", footerSrc, "jsx"),
          ],
        },
        {
          type: "folder",
          name: "hooks",
          path: "/src/hooks",
          children: [file("useScroll.js", "/src/hooks/useScroll.js", useScrollSrc, "js")],
        },
        {
          type: "folder",
          name: "utils",
          path: "/src/utils",
          children: [file("format.js", "/src/utils/format.js", formatSrc, "js")],
        },
        {
          type: "folder",
          name: "pages",
          path: "/src/pages",
          children: [file("Home.jsx", "/src/pages/Home.jsx", homeSrc, "jsx")],
        },
        {
          type: "folder",
          name: "assets",
          path: "/src/assets",
          children: [file("logo.svg", "/src/assets/logo.svg")],
        },
      ],
    },
    file("package.json", "/package.json", packageSrc, "json"),
    file("vite.config.js", "/vite.config.js", viteSrc, "js"),
  ],
};

function walk(node: TreeNode, out: FileNode[]) {
  if (node.type === "file") out.push(node);
  else node.children.forEach((c) => walk(c, out));
}

export const ALL_FILES: FileNode[] = (() => {
  const out: FileNode[] = [];
  walk(TREE, out);
  return out;
})();

export const FILE_BY_PATH: Record<string, FileNode> = Object.fromEntries(
  ALL_FILES.map((f) => [f.path, f])
);

export const FILE_BY_NAME: Record<string, FileNode> = Object.fromEntries(
  ALL_FILES.map((f) => [f.name.toLowerCase(), f])
);

export const DEFAULT_FILE = "/src/components/Hero.jsx";