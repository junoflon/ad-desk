"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, FolderOpen, Radar, LayoutDashboard, Aperture } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/search", label: "광고 검색", icon: Search },
  { href: "/board", label: "보드", icon: FolderOpen },
  { href: "/monitor", label: "모니터링", icon: Radar },
  { href: "/instagram", label: "Instagram", icon: Aperture },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-bold text-text-primary tracking-tight">
            Ad Desk
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                  pathname === href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block w-20" />

          <button
            className="md:hidden text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-3 border-t border-border mt-1 pt-3">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
