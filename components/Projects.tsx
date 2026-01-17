import React, { memo } from 'react';
import { SectionId, Project } from '../types';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';

// Static Data
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon Commerce',
    description: 'A blazing fast headless e-commerce storefront built with Astro and Tailwind. Achieved a perfect 100 Lighthouse score.',
    tags: ['Astro', 'React', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800&h=600&fit=crop',
    github: '#',
    link: '#'
  },

  {
    id: '3',
    title: 'TaskFlow Pro',
    description: 'Collaborative project management tool with real-time updates using WebSockets and a scalable Node.js backend.',
    tags: ['Node.js', 'Socket.io', 'Redis'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&h=600&fit=crop',
    github: '#',
    link: '#'
  }
];

// Sub-component for individual cards
const ProjectCard = memo(({ project }: { project: Project }) => (
  <article className="group relative rounded-3xl bg-surface border border-white/5 overflow-hidden hover:border-primary/30 transition-all duration-500 ease-out-expo hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 h-full flex flex-col">
    {/* Image Container */}
    <div className="aspect-[4/3] overflow-hidden relative bg-slate-800">
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 z-10 transition-opacity duration-500 group-hover:opacity-40"></div>
      <img
        src={project.image}
        alt={`Screenshot of ${project.title} project`}
        width="800"
        height="600"
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out-expo"
        loading="lazy"
        decoding="async"
      />

      {/* Overlay Links */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
        {project.github && (
          <a href={project.github} aria-label={`View source code for ${project.title}`} className="p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-primary hover:border-primary text-white transition-all duration-300">
            <Github className="h-5 w-5" />
          </a>
        )}
        {project.link && (
          <a href={project.link} aria-label={`Visit live demo of ${project.title}`} className="p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-primary hover:border-primary text-white transition-all duration-300">
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-6 relative z-20 -mt-12 flex-1 flex flex-col">
      <div className="glass-panel rounded-2xl p-5 backdrop-blur-xl bg-slate-900/90 flex-1 border-t border-white/10 group-hover:border-primary/20 transition-colors duration-300">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">{project.title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-white/5 rounded-md border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary/90 transition-all duration-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </article>
));

const Projects: React.FC = () => {
  return (
    <section id={SectionId.PROJECTS} className="py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2">
            <div>
              <span className="text-indigo-400 font-medium tracking-wider text-sm uppercase mb-2 block">Selected Works</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Featured Projects</h2>
            </div>
            <a href="#" className="hidden md:flex items-center text-slate-400 hover:text-white transition-colors mt-4 md:mt-0 group" aria-label="View all project archives">
              View All Archives <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.id} delay={index * 150} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <a href="#" className="inline-flex items-center text-indigo-400 font-medium" aria-label="View all project archives">
            View All Archives <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;