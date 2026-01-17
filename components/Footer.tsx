import React from 'react';

const SOCIAL_LINKS = [
  { label: 'Twitter', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Github', href: '#' }
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold text-white tracking-tight">Troncoso<span className="text-primary">.Dev</span></div>
        <div className="text-slate-400 text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </div>
        <div className="flex space-x-6 text-sm text-slate-400">
          {SOCIAL_LINKS.map(link => (
            <a key={link.label} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;