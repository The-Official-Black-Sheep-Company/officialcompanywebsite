import { useState } from "react";

const legalSections = [
  {
    id: "privacy",
    icon: "🔒",
    title: "Privacy Policy",
    content: `
**Effective Date:** January 1, 2025 | **Last Updated:** January 1, 2025

**1. Introduction**
KingdomConnect ("Company," "we," "us," or "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

**2. Information We Collect**
We may collect the following types of information:
• Personal Identifiers: Name, email address, phone number, mailing address
• Transaction Data: Purchase history, service bookings, payment records (processed securely via third-party processors — we do not store card numbers)
• Usage Data: IP address, browser type, pages visited, time on site, referring URLs
• Communication Data: Messages, emails, and inquiries you send us
• Cookie Data: See our Cookie Policy below

**3. How We Use Your Information**
We use your information to:
• Provide, operate, and improve our services
• Process transactions and send confirmations
• Respond to inquiries and provide customer support
• Send promotional communications (you may opt out at any time)
• Fulfill legal obligations and enforce our terms
• Personalize your experience on our client portal

**4. Sharing Your Information**
We do NOT sell your personal information. We may share data with:
• Service providers (hosting, payment processors, analytics) bound by confidentiality agreements
• Law enforcement when required by law
• Business successors in the event of a merger or acquisition (with notice to you)

**5. Data Retention**
We retain personal data only as long as necessary for the purposes outlined above or as required by law. You may request deletion of your data at any time.

**6. Your Rights**
Depending on your location, you may have the right to: access, correct, delete, or port your data; withdraw consent; and lodge a complaint with a supervisory authority.

**7. Children's Privacy**
Our services are not directed to individuals under 13. We do not knowingly collect data from children.

**8. Contact for Privacy Matters**
Email: privacy@kingdomconnect.com | Phone: (555) 123-4567
    `,
  },
  {
    id: "cookies",
    icon: "🍪",
    title: "Cookie Policy",
    content: `
**Effective Date:** January 1, 2025

**What Are Cookies?**
Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, understand how you use our site, and provide a better experience.

**Types of Cookies We Use:**

**Essential Cookies (Always Active)**
Required for the website to function properly. These include session management, security tokens, and form submission protection. You cannot opt out of these without affecting site functionality.

**Analytics Cookies (Optional)**
Help us understand how visitors interact with our website. We use anonymized data to improve page performance and user experience. Tools: Google Analytics, Plausible Analytics.

**Functional Cookies (Optional)**
Remember your preferences such as language, selected services, and portal login state to personalize your experience.

**Marketing Cookies (Optional)**
Used to track advertising effectiveness and deliver relevant promotions. We partner with Facebook Pixel, Google Ads, and TikTok Pixel for targeted advertising. You may opt out.

**Managing Cookies**
• Browser Settings: Most browsers allow you to block or delete cookies via settings
• Opt-Out Tools: Visit optout.aboutads.info or youronlinechoices.eu
• Our Cookie Banner: Adjust preferences at any time via the cookie consent tool

**Third-Party Cookies**
Embedded content (YouTube videos, social feeds) may set their own cookies. We are not responsible for third-party cookie practices. Refer to their respective privacy policies.

**Updates**
We may update this Cookie Policy periodically. Continued use of our site constitutes acceptance of any updates.
    `,
  },
  {
    id: "terms",
    icon: "📋",
    title: "Terms of Service",
    content: `
**Effective Date:** January 1, 2025

**1. Acceptance of Terms**
By accessing or using KingdomConnect's website, services, or client portal, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.

**2. Services**
KingdomConnect provides junk removal, hauling, moving, cleaning, pet care, e-commerce, device repair, cloud storage, VPS hosting, custom builds, and community programs. Service availability may vary by location. Specific service terms are provided at point of booking.

**3. User Accounts**
You are responsible for maintaining the confidentiality of your client portal credentials. You agree to notify us immediately of any unauthorized access. We reserve the right to terminate accounts that violate these terms.

**4. Payments & Refunds**
• Payment is due at the time of booking or upon service completion, as specified per service type
• Cancellations made 24+ hours in advance receive a full refund
• Cancellations within 24 hours may be subject to a cancellation fee (up to 50% of service cost)
• Defective products from our e-commerce store may be returned within 30 days for a full refund or exchange
• Device repair services carry a 90-day warranty on parts and labor

**5. Limitation of Liability**
KingdomConnect's liability is limited to the amount paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages. All services are provided "as is" with reasonable care and skill.

**6. Intellectual Property**
All content on this website — including text, graphics, logos, and code — is the property of KingdomConnect and protected by applicable copyright and trademark laws. Unauthorized use is prohibited.

**7. Dispute Resolution**
We encourage resolving disputes informally first. If unresolved, disputes shall be submitted to binding arbitration under the rules of the American Arbitration Association. Class action waivers apply where permitted by law.

**8. Governing Law**
These Terms are governed by the laws of the United States, without regard to conflict of law principles.

**9. Modifications**
We may update these Terms at any time. Material changes will be communicated via email or portal notification. Continued use after changes constitutes acceptance.
    `,
  },
  {
    id: "disclaimer",
    icon: "⚠️",
    title: "Disclaimer",
    content: `
**General Disclaimer**
The information provided on this website is for general informational purposes only. While we strive to keep information accurate and up-to-date, KingdomConnect makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, products, services, or related graphics on the website.

**Service Disclaimer**
Results from cleaning, repair, or removal services may vary based on the condition of items, property, or devices presented. KingdomConnect technicians and staff perform work in good faith with professional care. Prior damage, manufacturer defects, or pre-existing conditions are noted before work begins.

**Faith-Based Content**
Our Bible study and faith-based content is offered as spiritual enrichment and community building. We do not represent or replace professional counseling, legal, financial, or medical advice. For professional needs, please consult appropriate licensed professionals.

**Technology Disclaimer**
VPS, cloud storage, and custom build services are provided with commercially reasonable uptime and support. Downtime SLAs are defined in individual service agreements. We recommend all clients maintain independent backups of critical data.

**External Links**
Our website may contain links to third-party sites. We are not responsible for the content or privacy practices of those sites. Visit them at your own discretion.

**No Warranties**
To the fullest extent permitted by law, KingdomConnect disclaims all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
    `,
  },
  {
    id: "accessibility",
    icon: "♿",
    title: "Accessibility Statement",
    content: `
**Our Commitment**
KingdomConnect is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.

**Standards We Follow**
We aim to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines help make web content more accessible to people with disabilities, including those with visual, auditory, motor, and cognitive impairments.

**Measures We Take**
• Use of semantic HTML and ARIA labels throughout the site
• Sufficient color contrast ratios for all text and UI elements
• Keyboard navigation support for all interactive elements
• Alt text provided for images and icons
• Responsive design for use across devices and assistive technologies
• No auto-playing audio or video content

**Known Limitations**
Some third-party embedded content may not fully conform to accessibility standards. We are actively working with those providers to improve compliance.

**Feedback & Support**
If you experience any accessibility barriers or have suggestions for improvement, please contact us:
Email: accessibility@kingdomconnect.com | Phone: (555) 123-4567

We aim to respond to accessibility feedback within 2 business days.
    `,
  },
];

function renderContent(text: string) {
  const lines = text.trim().split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      return (
        <p key={i} className="text-amber-400 font-bold text-sm mt-4 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("• ")) {
      return (
        <li key={i} className="text-gray-300 text-sm ml-4 list-disc">
          {line.slice(2)}
        </li>
      );
    }
    // Inline bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className={`text-gray-400 text-sm leading-relaxed ${line === "" ? "mt-2" : ""}`}>
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="text-white font-semibold">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export function Legal() {
  const [active, setActive] = useState("privacy");

  const current = legalSections.find((s) => s.id === active)!;

  return (
    <section id="legal" className="py-24 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Legal Information
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Policies & Legal
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transparency is a core value at KingdomConnect. Review our complete legal documentation below.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-gray-800/50 border border-white/5 rounded-2xl p-4 sticky top-20">
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold px-2 mb-3">
                Documents
              </p>
              <div className="space-y-1">
                {legalSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActive(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      active === section.id
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-gray-800/50 border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
              <span className="text-3xl">{current.icon}</span>
              <h3 className="text-2xl font-bold text-white">{current.title}</h3>
            </div>
            <div className="space-y-1">{renderContent(current.content)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
