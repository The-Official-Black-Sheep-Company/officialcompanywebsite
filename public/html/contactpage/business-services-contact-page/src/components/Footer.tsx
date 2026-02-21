export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">K</span>
              </div>
              <span className="text-white font-bold text-xl">
                Kingdom<span className="text-amber-400">Connect</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Faith-driven services for your home, business, and digital life. Serving our community with excellence and Kingdom values.
            </p>
            <div className="flex gap-3 flex-wrap">
              {["📘", "📸", "▶️", "🎵", "🐦", "💼"].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 rounded-lg flex items-center justify-center text-sm transition-all"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-white font-bold mb-4">Services</p>
            <ul className="space-y-2.5">
              {[
                "Junk Removal & Hauling",
                "Moving Services",
                "Residential Cleaning",
                "Commercial Cleaning",
                "Pet Care",
                "E-Commerce Store",
                "Phone & Tablet Repair",
                "Cloud Storage & VPS",
                "Custom PC Builds",
              ].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <p className="text-white font-bold mb-4">Community</p>
            <ul className="space-y-2.5">
              {[
                { label: "Bible Study", href: "#bible-study" },
                { label: "Client Portal", href: "#social-portal" },
                { label: "Social Integration", href: "#social-portal" },
                { label: "Loyalty Rewards", href: "#contact" },
                { label: "Newsletter", href: "#contact" },
                { label: "Partner With Us", href: "#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white font-bold mb-4">Legal & Support</p>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", href: "#legal" },
                { label: "Cookie Policy", href: "#legal" },
                { label: "Terms of Service", href: "#legal" },
                { label: "Disclaimer", href: "#legal" },
                { label: "Accessibility", href: "#legal" },
                { label: "Contact Us", href: "#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verse */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-5 text-center">
            <p className="text-gray-300 italic text-sm">
              "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
            </p>
            <p className="text-amber-400 text-xs font-semibold mt-1">— Colossians 3:23</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {year} KingdomConnect. All rights reserved. | A Faith-Driven Enterprise
          </p>
          <div className="flex gap-4">
            <a href="#legal" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">
              Privacy
            </a>
            <a href="#legal" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">
              Cookies
            </a>
            <a href="#legal" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
