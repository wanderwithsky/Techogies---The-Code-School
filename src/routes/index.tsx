import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Techogies | Code School for Job-Ready Developers" },
      {
        name: "description",
        content:
          "Techogies helps students learn to code, build real projects, deploy products, and prepare for tech careers with mentorship and placement support.",
      },
      { property: "og:title", content: "Techogies | Code School for Job-Ready Developers" },
      {
        property: "og:description",
        content:
          "Techogies helps students learn to code, build real projects, deploy products, and prepare for tech careers with mentorship and placement support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});
