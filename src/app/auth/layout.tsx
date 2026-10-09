import Link from "next/link";
import { Wrench } from "lucide-react";
import { cookies } from "next/headers";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  
  const token = cookieStore.get("accessToken");

  if (token) {
    return null
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400 text-slate-950 shadow-inner">
              <Wrench className="h-5 w-5" />
            </span>

            <span className="font-black">Servexa</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        {children}
      </main>
    </div>
  );
}