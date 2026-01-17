import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import { SectionId } from '../types';

const NAV_LINKS = [
  { label: 'About', href: `#${SectionId.ABOUT}` },
  { label: 'Skills', href: `#${SectionId.SKILLS}` },
  { label: 'Projects', href: `#${SectionId.PROJECTS}` },
  { label: 'Contact', href: `#${SectionId.CONTACT}` },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Optimized scroll handler using requestAnimationFrame for better performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const navClasses = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-4xl rounded-full ${
    scrolled || isOpen
      ? 'bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20'
      : 'bg-transparent border border-transparent'
  }`;

  return (
    <nav role="navigation" aria-label="Main navigation" className={navClasses}>
      <div className="px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-primary to-secondary p-1.5 rounded-lg">
              <Code2 className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Troncoso<span className="text-primary">.Dev</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-slate-300 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="inline-flex items-center justify-center p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-900/95 backdrop-blur-xl rounded-b-3xl absolute top-14 w-full left-0 shadow-xl overflow-hidden animate-fade-in-up">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="text-slate-300 hover:text-white hover:bg-white/10 block px-4 py-3 rounded-xl text-base font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;