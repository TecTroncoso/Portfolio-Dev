import React from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  image: string;
}

export enum SectionId {
  HERO = 'hero',
  ABOUT = 'about',
  PROJECTS = 'projects',
  SKILLS = 'skills',
  CONTACT = 'contact'
}

// Three.js elements are now handled via @react-three/fiber types in vite-env.d.ts