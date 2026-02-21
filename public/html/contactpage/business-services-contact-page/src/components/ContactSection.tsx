import { useState } from "react";

export function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Let's Talk
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Whether you need a service quote, portal access, Bible study info, or just want to say hello — we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Get In Touch</h3>

            {[
              {
                icon: "📞",
                label: "Phone",
                value: "(555) 123-4567",
                sub: "Mon–Sat, 8AM–8PM",
              },
              {
                icon: "📧",
                label: "Email",
                value: "hello@kingdomconnect.com",
                sub: "Response within 24 hours",
              },
              {
                icon: "📍",
                label: "Location",
                value: "Serving Nationwide",
                sub: "Remote & On-Site services available",
              },
              {
                icon: "🕐",
                label: "Hours",
                value: "Mon–Fri: 8AM – 8PM",
                sub: "Sat: 9AM – 5PM | Sun: Closed",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 bg-gray-800/40 border border-white/5 rounded-xl p-4"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                    {item.label}
                  </p>
                  <p className="text-white font-semibold mt-0.5">{item.value}</p>
                  <p className="text-gray-400 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-gray-800/40 border border-white/5 rounded-xl p-5">
              <p className="text-white font-semibold mb-4">Follow Us</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Facebook", icon: "📘" },
                  { label: "Instagram", icon: "📸" },
                  { label: "YouTube", icon: "▶️" },
                  { label: "TikTok", icon: "🎵" },
                  { label: "X / Twitter", icon: "🐦" },
                  { label: "LinkedIn", icon: "💼" },
                ].map((s) => (
                  <button
                    key={s.label}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-gray-300 hover:text-amber-300 text-xs px-3 py-2 rounded-lg transition-all font-medium"
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🙏</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-gray-400">
                    Your message has been received. We'll get back to you within 24 hours. God bless!
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                    className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-6">Send Us a Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full bg-gray-900 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-gray-900 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                        className="w-full bg-gray-900 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Service of Interest</label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full bg-gray-900 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                      >
                        <option value="">Select a service...</option>
                        <option>Junk Removal / Moving / Hauling</option>
                        <option>Commercial Cleaning</option>
                        <option>Residential Cleaning</option>
                        <option>Pet Care Services</option>
                        <option>E-Commerce Store</option>
                        <option>Phone / Tablet Repair</option>
                        <option>Online Storage / VPS</option>
                        <option>Custom PC / Server Build</option>
                        <option>Client Portal Access</option>
                        <option>Bible Study</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      className="w-full bg-gray-900 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="legal" required className="mt-1 accent-amber-500" />
                    <label htmlFor="legal" className="text-gray-400 text-xs leading-relaxed">
                      I agree to the{" "}
                      <a href="#legal" className="text-amber-400 hover:underline">Privacy Policy</a>
                      {" "}and consent to being contacted regarding my inquiry. I understand my data will not be sold or shared without my consent.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-base rounded-xl transition-all shadow-lg shadow-amber-500/20"
                  >
                    Send Message ✉️
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
