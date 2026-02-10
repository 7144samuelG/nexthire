import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Free 14-day trial",
  "No credit card required",
  "Cancel anytime"
];

export const CTASection = () => {
  return (
    <section className=" bg-background relative overflow-hidden">
      <div className="container px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Card with gradient border */}
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 gradient-primary opacity-20" />
            <div className="absolute inset-1px bg-card rounded-3xl" />
            
            {/* Content */}
            <div className="relative px-8 py-16 sm:px-12 lg:px-16 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Ready to Transform Your{" "}
                <span className="text-gradient-primary">Hiring Process?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join hundreds of companies using NextHire to find and hire top talent faster than ever before.
              </p>

             
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

            
              <Button 
                asChild 
                size="lg" 
                type="button"
                className="gradient-primary text-primary-foreground px-10 py-6 text-lg font-semibold glow-primary hover:scale-105 transition-transform"
              >
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

