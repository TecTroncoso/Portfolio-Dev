import React, { useRef } from 'react';
import { SectionId } from '../types';
import { Layout, Server, Sparkles, Terminal, LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

type ColorTheme = 'blue' | 'green' | 'purple' | 'orange';

interface SkillCardProps {
  title: string;
  icon: LucideIcon;
  category: string;
  description?: string;
  technologies: string[];
  color: ColorTheme;
}

const COLOR_THEMES: Record<ColorTheme, { bg: string; text: string; border: string; hover: string; hoverBg: string; chipBg: string; chipText: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hover: 'hover:shadow-blue-500/10', hoverBg: 'group-hover:bg-blue-500/20', chipBg: 'bg-blue-500/5', chipText: 'text-blue-200' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', hover: 'hover:shadow-green-500/10', hoverBg: 'group-hover:bg-green-500/20', chipBg: 'bg-green-500/5', chipText: 'text-green-200' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', hover: 'hover:shadow-purple-500/10', hoverBg: 'group-hover:bg-purple-500/20', chipBg: 'bg-purple-500/5', chipText: 'text-purple-200' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', hover: 'hover:shadow-orange-500/10', hoverBg: 'group-hover:bg-orange-500/20', chipBg: 'bg-orange-500/5', chipText: 'text-orange-200' },
};

const SkillCard: React.FC<SkillCardProps> = ({ title, icon: Icon, category, description, technologies, color }) => {
  const theme = COLOR_THEMES[color];
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (divRef.current) {
      // Access layout once on enter to avoid thrashing during move
      // Note: This assumes card size doesn't change during hover, which is true here
      // If it did, we'd need ResizeObserver.
      // We store the rect in a way that handleMouseMove can access it, 
      // but simplistic approach: rely on the fact that modern browsers optimize this 
      // if we don't *write* style before *reading* layout in the same frame.
      // However, to be strictly safe and avoid 'forced reflow' warning:
      // We can just rely on event.nativeEvent.offsetX/Y which are relative to target.
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    // optimization: use native offsetX/Y if target matches, or calculate relative to rect
    // But since we have a 'group' and children, target might be a child.
    // The safest performant way without layout thrashing is to cached the rect
    // but simplified:
    const rect = divRef.current.getBoundingClientRect();
    // The "forced reflow" warning happens because we read (getBoundingClientRect) 
    // and then write (style.setProperty) in the same frame, possibly repeatedly.
    // To fix: use requestAnimationFrame or just accept that for a pill-shaped highlight it's needed.
    // BUT the user specifically called out this reflow. 
    // Better strategy: Use e.nativeEvent.offsetX / Y if the event target is the container.
    // Since we have children, let's cache the rect.

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  // Real fix: Move the read to a separate phase or accept it. 
  // Actually, the issue is often *interleaving*.
  // Let's try to just separate the read/write if possible, or throttle.
  // For this specific 'forced reflow' warning, it usually means we invalidated layout above.
  // Let's stick to the user request "Optimize". 
  // We will cache the rect on MouseEnter.

  const rectRef = useRef<DOMRect | null>(null);

  const onMouseEnter = () => {
    if (divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !rectRef.current) return;

    const x = e.clientX - rectRef.current.left;
    const y = e.clientY - rectRef.current.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      className={`glass-panel h-full rounded-3xl p-8 hover:bg-white/5 transition-all duration-500 group relative overflow-hidden`}
      style={{
        // Initialize CSS variables
        '--mouse-x': '0px',
        '--mouse-y': '0px',
      } as React.CSSProperties}
    >
      {/* Spotlight Effect Layer - Controlled by CSS group-hover and CSS vars for max performance */}
      <div
        className='pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      {/* Border Highlight Layer */}
      <div
        className='pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)`,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className={`p-3 ${theme.bg} rounded-2xl ${theme.hoverBg} transition-colors border border-white/5`}>
            <Icon className={`h-8 w-8 ${theme.text}`} />
          </div>
          <span className="text-xs font-mono text-white border border-slate-600 rounded px-2 py-1">{category}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        {description && <p className="text-slate-400 mb-6">{description}</p>}

        <div className="flex flex-wrap gap-2">
          {technologies.map(tech => (
            <span key={tech} className={`px-3 py-1.5 ${theme.chipBg} ${theme.chipText} border ${theme.border} rounded-lg text-sm font-medium hover:bg-opacity-20 transition-colors cursor-default`}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  return (
    <section id={SectionId.SKILLS} className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration - reduced opacity for better text contrast */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Expertise</h2>
            <p className="text-lg text-slate-400 max-w-2xl">
              A comprehensive toolset for building scalable, modern applications.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Reveal delay={100} className="h-full">
              <SkillCard
                title="Frontend Engineering"
                category="CLIENT_SIDE"
                icon={Layout}
                color="blue"
                description="Pixel-perfect UIs with modern frameworks."
                technologies={['React', 'Next.js', 'Astro', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js']}
              />
            </Reveal>
          </div>

          <div className="lg:col-span-1">
            <Reveal delay={200} className="h-full">
              <SkillCard
                title="Backend & DB"
                category="SERVER"
                icon={Server}
                color="green"
                technologies={['Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'Prisma']}
              />
            </Reveal>
          </div>

          <div className="lg:col-span-1">
            <Reveal delay={300} className="h-full">
              <SkillCard
                title="AI Integration"
                category="INTEL"
                icon={Sparkles}
                color="purple"
                technologies={['OpenAI', 'LangChain', 'Python', 'Vector DBs']}
              />
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={400} className="h-full">
              <SkillCard
                title="DevOps & Architecture"
                category="DEVOPS"
                icon={Terminal}
                color="orange"
                technologies={['Docker', 'AWS', 'CI/CD', 'Git', 'Kubernetes', 'Terraform']}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;