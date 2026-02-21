export function SocialPortal() {
  return (
    <section id="social-portal" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Digital Ecosystem
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Social Integration &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Client Portal
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            We're building a fully connected digital hub where our community, clients, and partners can engage, manage services, and grow together — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Social Integration */}
          <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center text-xl">
                📣
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Social Media Integration</h3>
                <p className="text-sm text-gray-400">Unified community engagement</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              Our vision is to create a seamless social ecosystem that bridges all our service divisions and community channels into one powerful, unified platform. Rather than scattered pages across different networks, we're integrating everything into a centralized feed where followers can stay updated on promotions, service announcements, Bible study content, and community events in real time.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: "📘",
                  platform: "Facebook & Instagram",
                  desc: "Live service updates, promotions, and community spotlights",
                },
                {
                  icon: "🎥",
                  platform: "YouTube & TikTok",
                  desc: "Behind-the-scenes, tutorials, devotionals, and testimonials",
                },
                {
                  icon: "🐦",
                  platform: "X / Twitter",
                  desc: "Real-time announcements, scheduling, and customer support",
                },
                {
                  icon: "💼",
                  platform: "LinkedIn",
                  desc: "Professional networking for commercial clients and partners",
                },
                {
                  icon: "🔔",
                  platform: "Push Notifications",
                  desc: "Opt-in alerts for deals, Bible study reminders, and booking confirmations",
                },
              ].map((item) => (
                <div
                  key={item.platform}
                  className="flex items-start gap-3 bg-white/5 rounded-xl px-4 py-3"
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.platform}</p>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Portal */}
          <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-xl">
                🔐
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Client Portal</h3>
                <p className="text-sm text-gray-400">Your personal service dashboard</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              The KingdomConnect Client Portal is our next-generation customer experience platform. Clients will be able to log in securely, manage all their active services, schedule appointments, track orders, pay invoices, access their cloud storage, manage their VPS instances, and communicate directly with our team — all from one beautifully simple dashboard.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: "📅", label: "Service Scheduling" },
                { icon: "💳", label: "Secure Invoicing" },
                { icon: "📦", label: "Order Tracking" },
                { icon: "☁️", label: "Cloud Storage Access" },
                { icon: "🖥️", label: "VPS Management" },
                { icon: "💬", label: "Direct Messaging" },
                { icon: "📊", label: "Usage Analytics" },
                { icon: "🎁", label: "Loyalty Rewards" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5"
                >
                  <span>{item.icon}</span>
                  <span className="text-gray-300 text-xs font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-xl p-4">
              <p className="text-blue-300 text-sm font-semibold mb-1">🚀 Coming Soon</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                The full client portal is currently in development. Register your interest below and be the first to gain access when we launch. Early adopters receive 3 months free on any cloud storage plan.
              </p>
            </div>

            <a
              href="#contact"
              className="mt-4 block text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Register for Early Access
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
