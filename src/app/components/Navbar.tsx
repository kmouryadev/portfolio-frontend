"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/contentful";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/string.utils";
import Button from "./ui-components/Button";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({ config }: { config: SiteConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initials = getInitials(config.name);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-[background,border-color] duration-300",
        scrolled
          ? "bg-[rgba(10,10,15,0.92)] backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-display font-bold text-xl text-[var(--text)] no-underline tracking-[-0.5px]"
        >
          {initials}
          <span className="text-[var(--accent)]">.</span>
        </Link>

        <ul className="hidden md:flex gap-8 list-none items-center">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-[var(--text-muted)] no-underline text-sm font-medium transition-colors duration-200 hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Button href={`mailto:${config.email}`}>Hire me</Button>
          </li>
        </ul>

        <button
          className="md:hidden bg-transparent border-none cursor-pointer text-[var(--text)] text-[22px]"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-[var(--text-muted)] no-underline font-medium border-b border-[var(--border)]"
            >
              {link.label}
            </Link>
          ))}
          <Button href={`mailto:${config.email}`} className="block mt-4">
            Hire me
          </Button>
        </div>
      )}
    </nav>
  );
}
