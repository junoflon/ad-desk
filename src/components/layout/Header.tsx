"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-text-primary">
              SNIPIT
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/blog"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              스니핏로그
            </Link>
            <Link
              href="/faq"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              FAQ
            </Link>
            <Link
              href="/pricing"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              플랜 안내
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              로그인
            </Link>
            <Link
              href="/search"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              무료로 시작하기
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/blog"
                className="text-text-secondary hover:text-text-primary text-sm"
                onClick={() => setMobileOpen(false)}
              >
                스니핏로그
              </Link>
              <Link
                href="/faq"
                className="text-text-secondary hover:text-text-primary text-sm"
                onClick={() => setMobileOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/pricing"
                className="text-text-secondary hover:text-text-primary text-sm"
                onClick={() => setMobileOpen(false)}
              >
                플랜 안내
              </Link>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  className="text-text-secondary text-sm"
                >
                  로그인
                </Link>
                <Link
                  href="/search"
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  무료로 시작하기
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
