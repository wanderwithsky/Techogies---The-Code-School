import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, GraduationCap, MapPin, Mic2, Building2, Users } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";
import { EnrollProvider, useEnroll } from "@/context/EnrollContext";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { EnrollModal } from "@/components/enrollment/EnrollModal";
import { GradientButton } from "@/components/common/GradientButton";
import storiesData from "@/data/stories.json";

type Story = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  galleryImages: string[];
  category: string;
  date: string;
  location: string;
  college: string;
  speaker: string;
  attendees: string;
  story: string[];
  highlights: string[];
  quote: string;
};

function getStory(slug: string): Story | undefined {
  return (storiesData as Story[]).find((s) => s.slug === slug);
}

export const Route = createFileRoute("/stories/$slug")({
  loader: ({ params }) => {
    const story = getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Story not found — Techogies" }, { name: "robots", content: "noindex" }] };
    }
    const { story } = loaderData;
    const title = `${story.title} — Techogies Impact`;
    return {
      meta: [
        { title },
        { name: "description", content: story.subtitle },
        { property: "og:title", content: title },
        { property: "og:description", content: story.subtitle },
        { property: "og:type", content: "article" },
        { property: "og:image", content: story.coverImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: story.coverImage },
      ],
    };
  },
  component: StoryRoute,
  notFoundComponent: StoryNotFound,
});

function StoryNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Story not found</h1>
        <p className="mt-2 text-muted-foreground">This story may have been moved or renamed.</p>
        <Link to="/" hash="impact" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to Impact
        </Link>
      </div>
    </div>
  );
}

function StoryRoute() {
  return (
    <ThemeProvider>
      <EnrollProvider>
        <ScrollProgress />
        <Navbar />
        <main>
          <StoryDetail />
        </main>
        <Footer />
        <BackToTop />
        <WhatsAppFab />
        <Toaster position="top-center" richColors />
        <EnrollModal />
      </EnrollProvider>
    </ThemeProvider>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function StoryDetail() {
  const { story } = Route.useLoaderData() as { story: Story };
  const { openEnroll } = useEnroll();

  const chips = [
    { icon: MapPin, label: story.location },
    { icon: Calendar, label: story.date },
    { icon: Users, label: story.attendees },
    { icon: Mic2, label: story.speaker },
    { icon: Building2, label: story.college },
    { icon: GraduationCap, label: story.category },
  ];

  return (
    <article className="relative pt-28 pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <Link
            to="/"
            hash="impact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to Impact Stories
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[42fr_58fr] lg:gap-14">
          {/* Sticky image column */}
          <div>
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-elegant"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  {story.category}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Right editorial */}
          <div className="min-w-0">
            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              {story.title}
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-4 text-lg text-muted-foreground"
            >
              {story.subtitle}
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-2"
            >
              {chips.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur"
                >
                  <Icon size={14} className="text-primary" /> {label}
                </span>
              ))}
            </motion.div>

            <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
              {story.story.map((para, i) => (
                <motion.p
                  key={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  custom={i}
                  variants={fadeUp}
                  className="mt-5 text-base leading-relaxed text-foreground/85 sm:text-[17px]"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Highlights */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="mt-12 rounded-3xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8"
            >
              <h2 className="font-display text-2xl font-bold">Highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {story.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-foreground/85">
                    <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="relative mt-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8 sm:p-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 left-6 font-display text-8xl leading-none text-primary/40"
              >
                “
              </span>
              <p className="relative font-display text-xl font-semibold italic leading-snug text-foreground sm:text-2xl">
                {story.quote}
              </p>
            </motion.blockquote>
          </div>
        </div>

        {/* Gallery */}
        <section className="mt-20">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="font-display text-3xl font-bold sm:text-4xl"
          >
            From the event
          </motion.h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {story.galleryImages.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <img
                  src={src}
                  alt={`${story.title} — photo ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-8 text-center sm:p-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold sm:text-4xl"
          >
            Want Techogies to Organize a Seminar at Your College?
          </motion.h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We partner with colleges and communities across India to run hands-on seminars, workshops
            and mentorship drives. Reach out and we'll design a program for your students.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" hash="contact">
              <GradientButton variant="ghost">Contact Us</GradientButton>
            </Link>
            <GradientButton onClick={() => openEnroll()}>Enroll Now</GradientButton>
          </div>
        </section>
      </div>
    </article>
  );
}