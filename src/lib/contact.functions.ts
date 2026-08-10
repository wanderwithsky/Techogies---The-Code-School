import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// We create a fresh client here to avoid any client-side env issues in the server function
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  source: z.string().trim().max(100).optional(),
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


    const ip =
      getRequestIP({ xForwardedFor: true }) ??
      getRequestHeader("cf-connecting-ip") ??
      "unknown";

    if (rateLimited(ip)) {
      return { ok: false as const, error: "Too many submissions. Please try again later." };
    }

    console.log("Production enquiry submit started");
    console.log("SUPABASE_URL configured:", !!process.env.VITE_SUPABASE_URL);
    console.log("SUPABASE_KEY configured:", !!process.env.VITE_SUPABASE_ANON_KEY);
    try {
      const urlHost = new URL(supabaseUrl).hostname;
      console.log("SUPABASE_URL hostname:", urlHost);
    } catch (e) {
      console.log("SUPABASE_URL hostname: invalid URL");
    }

    try {
      const insertData: any = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        qualification: data.qualification,
        course: data.course,
        message: data.message || "",
        status: "New"
      };

      if (data.source) {
        insertData.internal_notes = `[Source: ${data.source}]`;
      }

      const { error: dbError } = await supabase.from('enquiries').insert(insertData);
      
      if (dbError) {
        console.error("Supabase insert error:", dbError);
        return { ok: false as const, error: "Database error. Please try again." };
      }

      // 2. Also send to Google Script if configured (fallback/legacy)
      if (endpoint) {
        const form = new FormData();
        form.append("name", data.name);
        form.append("phone", data.phone);
        form.append("email", data.email);
        form.append("city", data.city);
        form.append("qualification", data.qualification);
        form.append("course", data.course);
        if (data.message) form.append("message", data.message);
        
        await fetch(endpoint, { method: "POST", body: form }).catch(e => console.error("GScript error:", e));
      }
      
      return { ok: true as const };
    } catch (err) {
      console.error("Contact form failed:", err);
      return { ok: false as const, error: "Network error." };
    }
  });
