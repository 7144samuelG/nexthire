import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Brain, Zap } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
     
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float delay-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-800 h-800 bg-indigo/5 rounded-full blur-3xl" />
        
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-position[50px_50px]" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-indigo/30 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-primary-foreground/90">AI-Powered Hiring Platform</span>
          </div>

         
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Hire Smarter with{" "}
            <span className="text-gradient-primary">AI Intelligence</span>
          </h1>

          
          <p className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-slide-up delay-100">
            NextHire transforms your recruitment process. Our AI automatically screens candidates, 
            identifies top matches, and schedules interviews—so you can focus on making great hires.
          </p>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
            <Button 
              asChild 
              type="button"
              size="lg" 
              className="gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold glow-primary hover:scale-105 transition-transform"
            >
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              type="button"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 px-8 py-6 text-lg"
            >
              Watch Demo
            </Button>
          </div>

         
          <div className="mt-16 pt-10 border-t border-primary-foreground/10 animate-fade-in delay-300">
            <p className="text-sm text-primary-foreground/50 mb-6">Trusted by forward-thinking companies</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['TechCorp', 'InnovateLabs', 'FutureHR', 'GlobalTalent', 'StartupPro'].map((company) => (
                <span key={company} className="text-lg font-semibold text-primary-foreground/70">{company}</span>
              ))}
            </div>
          </div>
        </div>

        
        <div className="absolute bottom-10 left-10 hidden lg:flex items-center gap-3 glass-dark px-4 py-3 rounded-xl animate-float delay-300">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="text-xs text-primary-foreground/60">AI Screening</p>
            <p className="text-sm font-semibold text-primary-foreground">247 candidates analyzed</p>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-3 glass-dark px-4 py-3 rounded-xl animate-float delay-500">
          <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="text-left">
            <p className="text-xs text-primary-foreground/60">Time Saved</p>
            <p className="text-sm font-semibold text-primary-foreground">85% faster hiring</p>
          </div>
        </div>
      </div>
    </section>
  );
};

