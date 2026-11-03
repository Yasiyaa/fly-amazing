import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Inbox, Map, Image as ImageIcon, Settings, MessagesSquare, LogOut, ExternalLink } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { getStaffUser } from "@/lib/supabase/session";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/media", label: "Media library", icon: ImageIcon },
  { href: "/admin/chats", label: "AI planner chats", icon: MessagesSquare },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaffUser();
  if (!staff) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/admin">
            <Logo />
          </Link>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-fly-navy"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-slate-100 p-4 text-sm lg:block">
          <p className="truncate text-slate-500">{staff.email}</p>
          <div className="mt-3 flex items-center justify-between">
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-fly-navy">
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </Link>
            <form action={signOut}>
              <button type="submit" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-600">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
