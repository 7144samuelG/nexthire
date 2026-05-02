const stats = [
  { value: "85%", label: "Faster Hiring", description: "Average reduction in time-to-hire" },
  { value: "10K+", label: "Candidates Screened", description: "AI-analyzed applications monthly" },
  { value: "92%", label: "Accuracy Rate", description: "In candidate-job matching" },
  { value: "500+", label: "Companies", description: "Trust NextHire for recruitment" }
];

export const StatsSection = () => {
  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
     
      <div className="absolute inset-0">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-indigo/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center group"
            >
              <div className="mb-2">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground/90 mb-1">{stat.label}</h3>
              <p className="text-sm text-primary-foreground/60">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

