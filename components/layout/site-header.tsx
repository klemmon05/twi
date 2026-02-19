import Link from "next/link";

const nav = [
  ["Home", "/"],
  ["Reports", "/reports"],
  ["Sponsors", "/sponsors/kkr"],
  ["Trends", "/trends"],
  ["Market Sensing", "/market-sensing"],
  ["Admin", "/admin"]
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">ProSignal Analytics</Link>
        <nav className="flex gap-4 text-sm text-slate-300">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-white">{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
