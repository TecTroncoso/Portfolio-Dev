import React from 'react';
import { SectionId } from '../types';
import { Reveal } from './Reveal';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 1,
    role: "Senior Full Stack Engineer",
    company: "TechNova Corp",
    period: "2021 - Present",
    description: "Leading the frontend migration to Next.js 14. Architected a scalable component system used by 40+ developers. Reduced build times by 60% through CI/CD optimization.",
    skills: ["React", "Next.js", "AWS", "System Design"]
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Creative Pulse Studio",
    period: "2019 - 2021",
    description: "Developed award-winning marketing sites and e-commerce platforms. Integrated AI-driven search features increasing user engagement by 25%.",
    skills: ["Vue.js", "Node.js", "WebGL", "Shopify"]
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "StartUp Inc",
    period: "2017 - 2019",
    description: "Collaborated with designers to implement pixel-perfect UIs. Built reusable data visualization components for the main dashboard product.",
    skills: ["React", "D3.js", "Sass", "Firebase"]
  }
];

const Experience: React.FC = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-16 text-center md:text-left">
            <span className="text-indigo-400 font-medium tracking-wider text-sm uppercase mb-2 block">Career Path</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Work Experience</h2>
          </div>
        </Reveal>

        <div className="relative border-l border-slate-800 ml-3 md:ml-6 space-y-12">
          {EXPERIENCES.map((exp, index) => (
            <Reveal key={exp.id} delay={index * 100}>
              <div className="relative pl-8 md:pl-12">
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-2 h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)] ring-4 ring-background"></div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{exp.role}</h3>
                      <div className="text-slate-400 font-medium flex items-center mt-1">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {exp.company}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono text-slate-300">
                      <Calendar className="w-3 h-3 mr-2" />
                      {exp.period}
                    </div>
                  </div>

                  <p className="text-slate-400 leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-white/5 text-slate-300 rounded-md border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;