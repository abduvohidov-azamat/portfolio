/**
 * All site content lives here — edit this file to make the portfolio yours.
 */

export type IconName = 'github' | 'linkedin' | 'x' | 'mail' | 'dribbble' | 'telegram';

export interface Social {
  label: string;
  url: string;
  icon: IconName;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  description: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
}

export interface Project {
  title: string;
  category: 'Web App' | 'Design System' | 'Open Source' | 'Mobile';
  description: string;
  tags: string[];
  /** Two or three CSS colors used to paint the card cover. */
  palette: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export const PROFILE = {
  name: 'Your Name',
  initials: 'YN',
  roles: ['Frontend Engineer', 'Angular Specialist', 'UI Craftsman', 'Creative Developer'],
  location: 'Your City, Country',
  email: 'hello@example.com',
  available: true,
  tagline: 'I build fast, accessible and beautifully animated web experiences.',
  bio: [
    "I'm a frontend engineer who lives where design meets engineering. For the past few years I've been building products with Angular and TypeScript — from data-heavy dashboards to playful marketing sites.",
    'I care about the details: smooth motion, crisp typography, clean architecture and interfaces that feel effortless to use. When I am not coding, I am exploring generative art, reading about design systems or contributing to open source.',
  ],
  resumeUrl: '#',
  socials: [
    { label: 'GitHub', url: 'https://github.com/', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/', icon: 'linkedin' },
    { label: 'X', url: 'https://x.com/', icon: 'x' },
    { label: 'Telegram', url: 'https://t.me/', icon: 'telegram' },
  ] satisfies Social[],
  stats: [
    { value: 5, suffix: '+', label: 'Years of experience' },
    { value: 40, suffix: '+', label: 'Projects shipped' },
    { value: 25, suffix: 'k', label: 'Users reached' },
    { value: 99, suffix: '%', label: 'Lighthouse score' },
  ] satisfies Stat[],
};

export const MARQUEE = [
  'Angular', 'TypeScript', 'RxJS', 'Signals', 'NgRx', 'Tailwind CSS', 'GSAP', 'Three.js',
  'Node.js', 'NestJS', 'PostgreSQL', 'Firebase', 'Figma', 'Docker', 'Jest', 'Playwright',
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Frontend',
    description: 'Component architectures that scale, with state that stays predictable.',
    items: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'NgRx', 'HTML / SCSS'],
  },
  {
    title: 'Motion & 3D',
    description: 'Interfaces that feel alive without sacrificing performance.',
    items: ['GSAP', 'Three.js', 'WebGL shaders', 'Lottie', 'CSS animations'],
  },
  {
    title: 'Backend',
    description: 'Comfortable across the stack when the product needs it.',
    items: ['Node.js', 'NestJS', 'REST / GraphQL', 'PostgreSQL', 'Firebase'],
  },
  {
    title: 'Workflow',
    description: 'Quality baked in from the first commit to production.',
    items: ['Git', 'CI/CD', 'Docker', 'Vitest', 'Playwright', 'Figma'],
  },
];

export const EXPERIENCE: Experience[] = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Acme Corp',
    period: '2024 — Present',
    description:
      'Leading the frontend of a SaaS analytics platform. Migrated the codebase to standalone components and signals, cutting bundle size by 38% and improving INP across the board.',
    tech: ['Angular', 'Signals', 'NgRx', 'D3'],
  },
  {
    role: 'Frontend Engineer',
    company: 'Pixel Studio',
    period: '2022 — 2024',
    description:
      'Built award-winning marketing sites and an internal design system used by 6 product teams. Introduced visual regression testing and a component documentation portal.',
    tech: ['Angular', 'GSAP', 'Storybook', 'Tailwind'],
  },
  {
    role: 'Junior Web Developer',
    company: 'Startup Inc',
    period: '2020 — 2022',
    description:
      'Shipped features end-to-end for an e-commerce startup — from checkout flows to admin dashboards — and maintained the Node.js API.',
    tech: ['TypeScript', 'Node.js', 'PostgreSQL'],
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Nebula Analytics',
    category: 'Web App',
    description: 'Real-time analytics dashboard with streaming charts, custom query builder and collaborative workspaces.',
    tags: ['Angular', 'Signals', 'WebSockets', 'D3'],
    palette: ['#8b5cf6', '#22d3ee', '#0e0e15'],
    liveUrl: '#',
    repoUrl: '#',
    featured: true,
  },
  {
    title: 'Aurora UI',
    category: 'Design System',
    description: 'Accessible component library with theming tokens, dark mode and 60+ documented components.',
    tags: ['Angular CDK', 'Storybook', 'a11y'],
    palette: ['#f472b6', '#8b5cf6', '#0e0e15'],
    liveUrl: '#',
    repoUrl: '#',
    featured: true,
  },
  {
    title: 'Orbit 3D Store',
    category: 'Web App',
    description: 'Immersive product configurator with WebGL previews, real-time pricing and smooth page transitions.',
    tags: ['Three.js', 'GSAP', 'Angular'],
    palette: ['#22d3ee', '#34d399', '#0e0e15'],
    liveUrl: '#',
  },
  {
    title: 'ngx-motion',
    category: 'Open Source',
    description: 'Tiny declarative animation directives for Angular powered by GSAP and the Web Animations API.',
    tags: ['TypeScript', 'GSAP', 'npm'],
    palette: ['#facc15', '#f472b6', '#0e0e15'],
    repoUrl: '#',
  },
  {
    title: 'Pulse Fitness',
    category: 'Mobile',
    description: 'Cross-platform workout tracker with offline sync, streaks and beautiful progress visualisations.',
    tags: ['Ionic', 'Angular', 'Capacitor'],
    palette: ['#fb7185', '#f97316', '#0e0e15'],
    liveUrl: '#',
  },
  {
    title: 'Docs Engine',
    category: 'Open Source',
    description: 'Markdown-driven documentation generator with full-text search and live code playgrounds.',
    tags: ['Node.js', 'Angular SSR', 'MDX'],
    palette: ['#60a5fa', '#8b5cf6', '#0e0e15'],
    repoUrl: '#',
  },
];

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];
