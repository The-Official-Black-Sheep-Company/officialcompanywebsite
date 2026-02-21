import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { SocialPortal } from "./components/SocialPortal";
import { BibleStudy } from "./components/BibleStudy";
import { ContactSection } from "./components/ContactSection";
import { Legal } from "./components/Legal";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";

export function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <SocialPortal />
        <BibleStudy />
        <ContactSection />
        <Legal />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
