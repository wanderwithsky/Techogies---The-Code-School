import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CallbackSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+()\-\s]+$/),
  qualification: z.string().trim().min(2).max(100),
  courseId: z.string().min(1),
  skillLevel: z.string().min(1),
  careerGoal: z.string().trim().min(2).max(120),
  contactTime: z.string().min(1),
});

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

export const submitCallbackRequest = createServerFn({ method: "POST" })
  .validator((data: unknown) => CallbackSchema.parse(data))
  .handler(async ({ data }) => {
    const ip =
      getRequestIP({ xForwardedFor: true }) ??
      getRequestHeader("cf-connecting-ip") ??
      "unknown";

    if (rateLimited(ip)) {
      return { ok: false as const, error: "Too many submissions. Please try again later." };
    }

    try {
      const { error: dbError } = await supabase.from('callback_requests').insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        qualification: data.qualification,
        interested_course: data.courseId,
        skill_level: data.skillLevel,
        career_goal: data.careerGoal,
        preferred_contact_time: data.contactTime,
        status: "New"
      });
      
      if (dbError) {
        console.error("Supabase insert error:", dbError);
        return { ok: false as const, error: "Database error." };
      }

      return { ok: true as const };
    } catch (err) {
      console.error("Callback form failed:", err);
      return { ok: false as const, error: "Network error." };
    }
  });
