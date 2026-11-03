import type { Metadata } from "next";
import Logo from "@/components/layout/Logo";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="card mt-8 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-fly-navy-900">Staff sign in</h1>
          {configured ? (
            <LoginForm />
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              The admin area needs the Supabase database. Add the Supabase keys to the environment (see <code>.env.example</code>) and run the migration.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
