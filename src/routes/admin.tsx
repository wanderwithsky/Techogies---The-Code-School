import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Briefcase, 
  Award, 
  Settings,
  LogOut,
  Menu,
  MessageCircle,
  Phone,
  Building2,
} from "lucide-react";

// In a real production app, we would use Tanstack Router's beforeLoad for auth checking
// but for a smooth client-side transition while developing, a wrapper works well too.

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isRecovery, setIsRecovery] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuth(!!session);
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuth === null) {
    return <div className="flex h-screen items-center justify-center">Loading Admin...</div>;
  }

  if (isRecovery) {
    return <PasswordUpdateForm onComplete={() => setIsRecovery(false)} />;
  }

  if (!isAuth) {
    // If not authenticated, we could render a Login component here, 
    // or redirect to an /admin/login route. For simplicity, we render Login directly 
    // if not authenticated on the admin root.
    return <AdminLogin />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <button className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </button>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* User profile / settings */}
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.invalidate();
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Courses", href: "/admin/courses", icon: BookOpen },
    { title: "Students", href: "/admin/students", icon: Users },
    { title: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
    { title: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { title: "Proposals", href: "/admin/proposals", icon: Building2 },
    { title: "Callbacks", href: "/admin/callbacks", icon: Phone },
    { title: "Projects", href: "/admin/projects", icon: Briefcase },
    { title: "Mentors", href: "/admin/mentors", icon: Award },
    { title: "Testimonials", href: "/admin/testimonials", icon: MessageCircle },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
      <div className="flex h-14 lg:h-[60px] items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-primary">Techogies</span> Admin
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset password.");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/admin",
    });

    if (error) {
      setError(error.message);
    } else {
      setResetMessage("Password reset email sent. Please check your inbox.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            {isResetting ? "Reset Password" : "Admin Login"}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isResetting ? "Enter your email to receive a reset link" : "Sign in to access the Techogies dashboard"}
          </p>
        </div>
        
        {resetMessage ? (
          <div className="rounded-md bg-green-50 p-4 mt-4">
            <p className="text-sm font-medium text-green-800">{resetMessage}</p>
            <button 
              onClick={() => { setIsResetting(false); setResetMessage(""); }}
              className="mt-3 text-sm text-green-700 underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={isResetting ? (e) => { e.preventDefault(); handleResetPassword(); } : handleLogin}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="sr-only" htmlFor="email-address">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {!isResetting && (
                <div>
                  <label className="sr-only" htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full rounded-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm text-destructive text-center font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                {loading ? (isResetting ? "Sending..." : "Signing in...") : (isResetting ? "Send Reset Link" : "Sign in")}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsResetting(!isResetting);
                  setError("");
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isResetting ? "Back to login" : "Forgot your password?"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function PasswordUpdateForm({ onComplete }: { onComplete: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      onComplete();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Update Password
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-foreground ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
