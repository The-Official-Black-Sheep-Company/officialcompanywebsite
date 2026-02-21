const services = [
  {
    icon: "🚛",
    title: "Junk Removal, Moving & Hauling",
    color: "from-orange-500 to-red-600",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    description:
      "We haul it all — furniture, appliances, yard waste, construction debris, and more. Our moving and hauling services are affordable, reliable, and available on short notice.",
    features: [
      "Residential & commercial junk removal",
      "Full-service local moving assistance",
      "Appliance & furniture hauling",
      "Same-day and scheduled pickups",
      "Eco-friendly disposal & recycling",
      "Debris cleanup after renovations",
    ],
  },
  {
    icon: "🧹",
    title: "Commercial & Residential Cleaning",
    color: "from-blue-500 to-cyan-600",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    description:
      "From spotless homes to pristine offices, our cleaning crews deliver top-tier results using professional-grade products and meticulous attention to detail.",
    features: [
      "Deep cleaning & move-in/move-out",
      "Office and commercial space cleaning",
      "Weekly, bi-weekly & monthly plans",
      "Post-construction cleanup",
      "Window & carpet cleaning",
      "Sanitization & disinfection services",
    ],
  },
  {
    icon: "🐾",
    title: "Pet Care Services",
    color: "from-pink-500 to-rose-600",
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    description:
      "We treat your pets like family. Our compassionate pet care team provides reliable, loving services so your furry friends are happy and safe while you're away.",
    features: [
      "Dog walking & cat sitting",
      "In-home pet boarding",
      "Pet transportation services",
      "Feeding, grooming & medication",
      "Overnight pet care visits",
      "Fully insured & background-checked staff",
    ],
  },
  {
    icon: "🛒",
    title: "E-Commerce Store",
    color: "from-green-500 to-emerald-600",
    badge: "bg-green-500/10 text-green-400 border-green-500/30",
    description:
      "Shop our curated online store featuring quality products across multiple categories. Secure checkout, fast shipping, and exceptional customer service.",
    features: [
      "Curated product selection",
      "Secure SSL-encrypted checkout",
      "Fast nationwide shipping",
      "Easy returns & exchanges",
      "Customer loyalty rewards",
      "Wholesale & bulk ordering options",
    ],
  },
  {
    icon: "📱",
    title: "Phone, Tablet & Device Repair",
    color: "from-violet-500 to-purple-600",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    description:
      "Cracked screen? Dead battery? Won't charge? Our certified technicians repair smartphones, tablets, and other devices quickly and affordably — often same-day.",
    features: [
      "Screen & LCD replacement",
      "Battery & charging port repair",
      "Water damage restoration",
      "iOS & Android device support",
      "Tablet & laptop diagnostics",
      "90-day repair warranty",
    ],
  },
  {
    icon: "🖥️",
    title: "Online Storage, VPS & Custom Builds",
    color: "from-amber-500 to-yellow-600",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    description:
      "Power your digital life with scalable cloud storage, virtual private servers, and custom-built PC/server solutions tailored to your home or business needs.",
    features: [
      "Secure cloud storage plans",
      "Virtual Private Server (VPS) hosting",
      "Custom gaming & workstation builds",
      "Custom server rack builds",
      "Annals & archive system design",
      "Remote IT support & management",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Our Service Divisions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Six powerful service arms, one unified team. Everything your household or business needs — under one roof.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-gray-800/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 hover:bg-gray-800/80 transition-all duration-300 flex flex-col"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}
              >
                {service.icon}
              </div>

              {/* Badge & Title */}
              <span
                className={`inline-block border text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit ${service.badge}`}
              >
                Service Division
              </span>
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mt-auto">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-amber-400 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-6 block text-center py-2.5 px-4 bg-white/5 hover:bg-amber-500 hover:text-gray-950 border border-white/10 hover:border-amber-500 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Inquire Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
