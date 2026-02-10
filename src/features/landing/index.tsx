"use client"
import { Footer } from "./components/Footer";
import {CTASection} from"./components/CTASection";
import {FeaturesSection} from "./components/FeaturesSection";
import {HeroSection} from "./components/HeroSection";
import {HowItWorksSection} from "./components/HowItWorksSection";
import {Navbar} from "./components/Navbar";

export const LandingIndex = () => {
    return ( 
        <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        {/* stats to appear here in future */}
        <CTASection />
        <Footer />
      </div>
     );
}
