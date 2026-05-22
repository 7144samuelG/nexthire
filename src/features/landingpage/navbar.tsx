import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userId } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b border-gray-300">
      <div className="container px-4 w-full">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg  flex items-center justify-center">
              <Brain className="w-5 h-5 " />
            </div>
            <span className="text-xl font-bold ">NextHire</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className=" hover:text-gray-600 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {userId ? (
              <Button asChild type="button" className="p-2">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            ) : (
              <Button variant="default" type="button" className="p-2 " asChild>
                <Link href="/sign-in">Sign IN</Link>
              </Button>
            )}
          </div>

          <Button
            type="button"
            className="lg:hidden p-2 text-primary-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-primary-foreground/10">
                {userId ? (
                  <Button asChild type="button" className="p-2">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    type="button"
                    className="p-2 "
                    asChild
                  >
                    <Link href="/sign-in">Sign IN</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
