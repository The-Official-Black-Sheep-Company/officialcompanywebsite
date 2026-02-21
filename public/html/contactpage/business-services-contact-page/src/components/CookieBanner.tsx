import { useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    analytics: true,
    functional: true,
    marketing: false,
  });

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">🍪</span>
            <div className="flex-1">
              <h4 className="text-white font-bold text-base mb-1">We Value Your Privacy</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                KingdomConnect uses cookies to enhance your experience, analyze site traffic, and deliver personalized content. We respect your choices and only use your data as described in our{" "}
                <a href="#legal" onClick={() => setVisible(false)} className="text-amber-400 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#legal" onClick={() => setVisible(false)} className="text-amber-400 hover:underline">
                  Cookie Policy
                </a>.
              </p>

              {showDetails && (
                <div className="bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
                  <p className="text-white font-semibold text-sm mb-2">Manage Cookie Preferences</p>
                  {[
                    {
                      key: "analytics" as const,
                      label: "Analytics Cookies",
                      desc: "Help us understand how you use our site (anonymized)",
                    },
                    {
                      key: "functional" as const,
                      label: "Functional Cookies",
                      desc: "Remember your preferences and portal login state",
                    },
                    {
                      key: "marketing" as const,
                      label: "Marketing Cookies",
                      desc: "Used for targeted ads on Facebook, Google & TikTok",
                    },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white text-xs font-semibold">{pref.label}</p>
                        <p className="text-gray-400 text-xs">{pref.desc}</p>
                      </div>
                      <button
                        onClick={() => setPrefs({ ...prefs, [pref.key]: !prefs[pref.key] })}
                        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                          prefs[pref.key] ? "bg-amber-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            prefs[pref.key] ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                    <div>
                      <p className="text-white text-xs font-semibold">Essential Cookies</p>
                      <p className="text-gray-400 text-xs">Required for site functionality (always active)</p>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">Always On</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setVisible(false)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm rounded-xl transition-all"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setVisible(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all"
                >
                  {showDetails ? "Save Preferences" : "Reject Non-Essential"}
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-5 py-2.5 text-gray-400 hover:text-amber-400 font-semibold text-sm transition-colors"
                >
                  {showDetails ? "Hide Details ▲" : "Customize ▼"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
