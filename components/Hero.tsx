import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Github, Linkedin, Twitter, MousePointer2, Instagram } from 'lucide-react';
import { SectionId } from '../types';
import { Reveal } from './Reveal';

// Defer loading the heavy 3D scene until after LCP
// Lazy load without artificial delay (yields to main thread briefly via import assumption)
const HeroScene = lazy(() => import('./HeroScene'));

const SOCIAL_LINKS = [
  { icon: Linkedin, href: '#' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' }
];

// --- CUSTOM HOOKS ---

/**
 * Hook to handle typewriter effect
 */
const useTypewriter = (words: string[], period: number = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(200);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, delta]);

  const tick = () => {
    let i = loopNum % words.length;
    let fullText = words[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(60);
    } else {
      setDelta(150 - Math.random() * 50);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  };

  return text;
};

// --- HERO COMPONENT ---

const Hero: React.FC = () => {
  const text = useTypewriter(["Developer", "Creator", "UI/UX Designer", "Engineer"]);

  return (
    <section id={SectionId.HERO} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 md:pt-0 bg-background">

      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-background pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Column: 3D Scene */}
          <div className="order-1 md:order-1 h-[400px] md:h-[600px] w-full relative">
            <Reveal delay={0} className="w-full h-full">
              {/* Lazy load the 3D scene so it doesn't block the initial text render */}
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center" aria-label="Loading 3D Scene"></div>}>
                <HeroScene />
              </Suspense>
            </Reveal>
          </div>

          {/* Right Column: Content */}
          <div className="order-2 md:order-2 text-center md:text-left">
            <Reveal delay={200}>
              <h2 className="text-xl md:text-2xl font-medium text-primary mb-2 tracking-wide">
                Hello, It's
              </h2>
            </Reveal>

            <Reveal delay={300}>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                Troncoso<span className="text-primary">.</span>
              </h1>
            </Reveal>

            <Reveal delay={400}>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-300 mb-6 h-[1.2em]">
                I'm a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">{text}</span>
                <span className="border-r-4 border-primary ml-1 animate-pulse"></span>
              </h2>
            </Reveal>

            <Reveal delay={500}>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
                I craft high-performance digital experiences that merge art with code.
                Specializing in React ecosystem, AI integration, and interactive UI design.
              </p>
            </Reveal>

            <Reveal delay={600}>
              <div className="flex items-center justify-center md:justify-start space-x-6 mb-10">
                {SOCIAL_LINKS.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="group relative p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                    aria-label={`Visit ${social.label || 'Social Link'}`}
                  >
                    <social.icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="absolute inset-0 rounded-full ring-2 ring-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={700}>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <a
                  href={`#${SectionId.CONTACT}`}
                  className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[160px] text-center"
                  aria-label="Contact and Hire Me"
                >
                  Hire Me
                </a>
                <a
                  href={`#${SectionId.PROJECTS}`}
                  className="px-8 py-4 bg-transparent border border-white/10 text-white font-semibold rounded-full hover:bg-white/5 transition-all duration-300 min-w-[160px] text-center"
                  aria-label="View Work Projects"
                >
                  View Work
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce opacity-20 hidden md:block">
        <MousePointer2 className="h-6 w-6 text-white" />
      </div>
    </section>
  );
};

export default Hero;