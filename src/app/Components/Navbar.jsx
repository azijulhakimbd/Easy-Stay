"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Stays", href: "/stays" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
      ${scrolled
        ? "bg-primary/50 shadow-md backdrop-blur-lg"
        : "bg-primary"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl text-black font-heading font-bold">
          EasyStay
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-blue-700 text-xl font-bold font-heading text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button className="bg-button-primary text-white border font-heading border-button-primary hover:bg-button-primary/80 transform hover:scale-105 transition-all duration-200">
            <Link href="/login">Login</Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="w-6 h-6 text-white" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-primary/95 dark:bg-[#efefef]/95 border-t border-border backdrop-blur-md transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"}
        `}
      >
        <ul className="flex flex-col p-4 space-y-3">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="block font-heading text-white hover:text-button-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
