import { FileText, Brain, Users, Calendar } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Post Your Job",
    description: "Create detailed job listings with our AI-assisted job description builder. Define skills, experience, and culture fit criteria."
  },
  {
    icon: Brain,
    step: "02", 
    title: "AI Shortlists Candidates",
    description: "Our intelligent algorithms analyze applications, screen resumes, and rank candidates based on your specific requirements."
  },
  {
    icon: Users,
    step: "03",
    title: "Review Top Matches",
    description: "Access a curated list of best-fit candidates with detailed match scores, skill assessments, and AI-generated insights."
  },
  {
    icon: Calendar,
    step: "04",
    title: "Book Interviews",
    description: "Schedule interviews seamlessly with integrated calendar sync. Candidates receive automated notifications and reminders."
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/50 to-transparent" />
      
      <div className="container relative z-10 px-4">
      
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Four Steps to{" "}
            <span className="text-gradient-primary">Smarter Hiring</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From job posting to interview booking, NextHire streamlines every step of your recruitment journey.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.step}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
             {/* research on how to write height based on this below */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <div className="relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elevated group-hover:-translate-y-1">
              
                <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full gradient-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </span>

                
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

               
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

