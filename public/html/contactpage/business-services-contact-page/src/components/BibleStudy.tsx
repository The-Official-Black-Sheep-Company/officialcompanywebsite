const studyTopics = [
  {
    day: "Monday",
    title: "The Kingdom Mindset",
    verse: "Matthew 6:33",
    text: '"But seek first the kingdom of God and his righteousness, and all these things will be added to you."',
    summary:
      "We begin each week by anchoring our minds in Kingdom priorities. This study explores how aligning our work, finances, and relationships with God's Word produces lasting fruit and supernatural favor in every area of life.",
    topics: ["Purpose vs. Profit", "Stewardship of Resources", "Faith in Business"],
  },
  {
    day: "Wednesday",
    title: "Wisdom in Work & Commerce",
    verse: "Proverbs 22:29",
    text: '"Do you see someone skilled in their work? They will serve before kings; they will not serve before officials of low rank."',
    summary:
      "Mid-week we dive deep into biblical principles of excellence, skilled labor, and honest commerce. Every service we provide — from cleaning to tech repair — is an act of worship when done with integrity and mastery.",
    topics: ["Excellence as Worship", "Honest Weights (Proverbs 11:1)", "The Worker's Calling"],
  },
  {
    day: "Friday",
    title: "Community, Charity & Service",
    verse: "Galatians 6:10",
    text: '"Therefore, as we have opportunity, let us do good to all people, especially to those who belong to the family of believers."',
    summary:
      "Our Friday study focuses on our responsibility to our neighbors and community. We explore how our service businesses are an extension of the Great Commandment — loving God and loving people through practical, tangible action.",
    topics: ["Serving the Marginalized", "Generosity Principles", "Building Kingdom Community"],
  },
  {
    day: "Sunday",
    title: "Rest, Renewal & Vision",
    verse: "Isaiah 40:31",
    text: '"But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."',
    summary:
      "Our Sunday deep dive covers spiritual rest, prophetic vision, and the importance of Sabbath in a culture obsessed with hustle. We explore how God's rhythm of rest is actually the secret to sustainable, long-term growth and impact.",
    topics: ["Sabbath Principles", "Prophetic Vision for Business", "Spiritual Warfare & Business"],
  },
];

const additionalModules = [
  {
    icon: "📖",
    title: "The Parable of the Talents",
    desc: "A deep dive into Matthew 25:14-30 — how we multiply what God has given us in skills, finances, and influence.",
  },
  {
    icon: "🕊️",
    title: "Holy Spirit & Decision Making",
    desc: "Learning to hear God's voice in business decisions, hiring, pricing, and direction-setting.",
  },
  {
    icon: "⚖️",
    title: "Biblical Financial Literacy",
    desc: "Debt, tithing, saving, investing, and building generational wealth through Scripture's timeless principles.",
  },
  {
    icon: "🌱",
    title: "Kingdom Entrepreneurship",
    desc: "How to launch and run a faith-based business with integrity, legal compliance, and spiritual accountability.",
  },
  {
    icon: "🤝",
    title: "Reconciliation & Leadership",
    desc: "Biblical conflict resolution, servant leadership, and how to build teams that reflect Christ's character.",
  },
  {
    icon: "🔥",
    title: "Revival, Purpose & Legacy",
    desc: "Understanding your assignment, building legacy businesses, and contributing to community revival.",
  },
];

export function BibleStudy() {
  return (
    <section id="bible-study" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ✝️ Faith & Community
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Deep Dive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Bible Study
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            At the heart of everything we do is our faith. Our Bible Study program is a free, open-to-all weekly gathering that explores Scripture through the lens of everyday life, work, business, and community transformation. All are welcome — believers, seekers, and the curious alike.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-8 mb-16 text-center">
          <p className="text-2xl font-bold text-white leading-relaxed italic">
            "We don't separate our faith from our work — we let our faith be the foundation of our work."
          </p>
          <p className="text-amber-400 mt-3 font-semibold">— Kingdom Connect Mission Statement</p>
        </div>

        {/* Weekly Schedule */}
        <h3 className="text-2xl font-bold text-white mb-8 text-center">📅 Weekly Study Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {studyTopics.map((study) => (
            <div
              key={study.day}
              className="bg-gray-800/50 border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500 text-gray-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {study.day}
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-1">{study.title}</h4>
              <p className="text-amber-400 text-sm font-semibold mb-3">{study.verse}</p>
              <blockquote className="border-l-2 border-amber-500 pl-4 text-gray-300 text-sm italic mb-4 leading-relaxed">
                {study.text}
              </blockquote>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{study.summary}</p>
              <div className="flex flex-wrap gap-2">
                {study.topics.map((t) => (
                  <span
                    key={t}
                    className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Study Modules */}
        <h3 className="text-2xl font-bold text-white mb-8 text-center">📚 Extended Study Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {additionalModules.map((mod) => (
            <div
              key={mod.title}
              className="bg-gray-800/40 border border-white/5 rounded-xl p-5 hover:border-amber-500/20 transition-all"
            >
              <span className="text-3xl block mb-3">{mod.icon}</span>
              <h4 className="text-white font-bold mb-2">{mod.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>

        {/* Join CTA */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 border border-amber-500/20 rounded-2xl p-10 text-center">
          <h3 className="text-3xl font-black text-white mb-3">Join Our Bible Study Community</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Sessions are held virtually and in-person. No prior Bible knowledge required. Come as you are — we grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              ✝️ Join the Study
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all"
            >
              📖 Request Study Materials
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-5">Free to attend · All faiths welcome · Held weekly</p>
        </div>
      </div>
    </section>
  );
}
