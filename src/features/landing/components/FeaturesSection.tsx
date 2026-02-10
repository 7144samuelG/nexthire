import { Sparkles, Target, Clock, Shield, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Resume Screening",
    description: "Advanced NLP analyzes resumes to identify relevant skills, experience, and qualifications automatically.",
    highlight: true
  },
  {
    icon: Target,
    title: "Smart Candidate Matching",
    description: "Proprietary algorithms match candidates to job requirements with precision scoring and ranking."
  },
  {
    icon: Clock,
    title: "Automated Scheduling",
    description: "Intelligent calendar integration finds optimal interview times for both parties instantly."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights on your hiring pipeline, time-to-hire metrics, and candidate engagement."
  },
  {
    icon: Shield,
    title: "Bias-Free Hiring",
    description: "Our AI is designed to evaluate candidates fairly, focusing on skills and qualifications."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share candidate profiles, collect feedback, and make collaborative hiring decisions."
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-3 bg-secondary/30 relative overflow-hidden">
     
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
       
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            AI-Powered Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built for Modern{" "}
            <span className="text-gradient-gold">Hiring Teams</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature is designed to save you time and help you find the perfect candidates faster.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative bg-card rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                feature.highlight 
                  ? 'border-primary/50 shadow-elevated glow-primary' 
                  : 'border-border hover:border-primary/30 hover:shadow-elevated'
              }`}
            >
              {feature.highlight && (
                <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-semibold rounded-full gradient-primary text-primary-foreground">
                  Most Popular
                </span>
              )}

              
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                feature.highlight 
                  ? 'gradient-primary' 
                  : 'bg-primary/10 group-hover:bg-primary/20'
              }`}>
                <feature.icon className={`w-7 h-7 ${feature.highlight ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>

              
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

