import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const EnrollSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
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
  location: z.string().trim().min(2).max(120),
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

export const submitEnrollment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EnrollSchema.parse(data))
  .handler(async ({ data }) => {
    const endpoint = process.env.ENROLL_GSCRIPT_URL;
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
    form.append("email", data.email);
    form.append("phone", data.phone);
    form.append("location", data.location);

    try {
      const res = await fetch(endpoint, { method: "POST", body: form });
      if (!res.ok) {
        console.error("Enrollment upstream error:", res.status);
        return { ok: false as const, error: "Upstream service error." };
      }
      return { ok: true as const };
    } catch (err) {
      console.error("Enrollment proxy fetch failed:", err);
      return { ok: false as const, error: "Network error." };
    }
  });