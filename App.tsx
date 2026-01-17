import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import Footer from './components/Footer';

// Lazy load below-the-fold components to improve initial render speed
const Skills = lazy(() => import('./components/Skills'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

// Loading fallback for lazy components
const SectionLoader = () => (
  <div className="py-24 w-full flex items-center justify-center">
    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <main className="min-h-screen bg-background text-slate-200 selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <Hero />
      <TechMarquee />
      
      {/* Wrap lazy-loaded components in Suspense */}
      <Suspense fallback={<SectionLoader />}>
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </Suspense>
      
      <Footer />
    </main>
  );
}

export default App;