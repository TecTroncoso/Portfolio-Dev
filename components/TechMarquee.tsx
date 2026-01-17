import React from 'react';

const TECH_STACK = [
  "React", "Next.js", "TypeScript", "Node.js", "GraphQL", "TailwindCSS", 
  "Three.js", "PostgreSQL", "Docker", "AWS", "Python", "Figma", 
  "Astro", "Prisma", "Redis", "Kubernetes"
];

const TechMarquee: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-background border-y border-white/5 py-8">
      {/* Gradients to fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

      <div className="flex w-full">
        <div className="flex animate-marquee whitespace-nowrap">
          {TECH_STACK.map((tech, index) => (
            <span 
              key={`tech-1-${index}`} 
              className="mx-8 text-2xl md:text-3xl font-bold text-slate-700 hover:text-slate-400 transition-colors cursor-default select-none uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Duplicate for infinite loop effect */}
        <div className="absolute top-0 py-8 animate-marquee2 whitespace-nowrap">
          {TECH_STACK.map((tech, index) => (
            <span 
              key={`tech-2-${index}`} 
              className="mx-8 text-2xl md:text-3xl font-bold text-slate-700 hover:text-slate-400 transition-colors cursor-default select-none uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechMarquee;