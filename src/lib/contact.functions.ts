import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[+()\-\s\d]{7,20}$/)
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15;
    }),
  email: z.string().trim().email().max(200),
  city: z.string().trim().min(2).max(120),
  qualification: z.string().trim().min(1).max(100),
  course: z.string().trim().min(1).max(100),
  message: z.string().trim().max(1000).optional(),
});

// Simple in-memory rate limit (per worker instance): 5 submissions / 10 min per IP.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

export const submitContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    const endpoint = process.env.CONTACT_GSCRIPT_URL;
    if (!endpoint) {
      return { ok: false as const, error: "Service not configured." };
    }

    const ip =
      getRequestIP({ xForwardedFor: true }) ??
      getRequestHeader("cf-connecting-ip") ??
      "unknown";

    if (rateLimited(ip)) {
      return { ok: false as const, error: "Too many submissions. Please try again later." };
    }

    const form = new FormData();
    form.append("name", data.name);
    form.append("phone", data.phone);
    form.append("email", data.email);
    form.append("city", data.city);
    form.append("qualification", data.qualification);
    form.append("course", data.course);
    if (data.message) form.append("message", data.message);

    try {
      const res = await fetch(endpoint, { method: "POST", body: form });
      if (!res.ok) {
        console.error("Contact upstream error:", res.status);
        return { ok: false as const, error: "Upstream service error." };
      }
      return { ok: true as const };
    } catch (err) {
      console.error("Contact proxy fetch failed:", err);
      return { ok: false as const, error: "Network error." };
    }
  });
