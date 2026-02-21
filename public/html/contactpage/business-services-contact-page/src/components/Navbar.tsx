import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Social & Portal", href: "#social-portal" },
  { label: "Bible Study", href: "#bible-study" },
  { label: "Contact", href: "#contact" },
  { label: "Legal", href: "#legal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur border-b border-amber-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg">K</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Kingdom<span className="text-amber-400">Connect</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-white/5 text-sm font-medium transition-all"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-3 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm rounded-lg transition-all shadow-md shadow-amber-500/30"
            >
              Get In Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-amber-400 transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-950 border-t border-amber-500/20 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:text-amber-400 hover:bg-white/5 text-sm font-medium transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
