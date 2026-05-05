"use client"
import { CTASection } from "./CTASection";
import { FeaturesSection } from "./FeaturesSection";
import { Footer } from "./Footer";
import { HeroSection } from "./herosection";
import { HowItWorksSection } from "./HowItWorksSection";
import { Navbar } from "./navbar";

export const Index = () => {
    return ( 
        <div className="min-h-0 w-full flex flex-col items-center">
            <Navbar/>
            <HeroSection/>
            <HowItWorksSection/>
            <FeaturesSection/>
            <CTASection/>
            <Footer/>
        </div>
    );
}