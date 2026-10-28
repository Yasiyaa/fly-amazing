import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <section className="container-page flex flex-1 flex-col items-center justify-center py-40 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-bold text-fly-navy-900 sm:text-5xl">This page has flown off course</h1>
        <p className="mt-4 max-w-md text-slate-500">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary btn-lg">
            Back to home
          </Link>
          <Link href="/packages" className="btn-secondary btn-lg">
            Browse packages
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
