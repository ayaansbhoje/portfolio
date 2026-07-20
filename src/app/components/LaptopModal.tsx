'use client';

import React, { useState } from 'react';


interface LaptopModalProps {
  onClose: () => void;
}

type LaptopView = 'desktop' | 'profile' | 'project';

interface Project {
  id: string;
  name: string;
  logo: string;
  tech: string[];
  description: string;
  useCase: string;
  url: string;
  color: string;
}

// TODO: replace each `url` with your real GitHub repo or live link.
const PROJECTS: Project[] = [
  {
    id: 'velpack',
    name: 'Velpack Packaging',
    logo: '/assets/Velpack_logo_fullcolor_rgb.png',
    tech: ['React.js', 'Tailwind CSS', 'Node.js'],
    description: 'Modern website for a packaging company, showcasing its brand differentiation from competitors.',
    useCase: 'Built to set Velpack apart in a crowded market - a clean, responsive site that communicates its strengths, deployed and hosted on the cloud.',
    url: 'github.com/ayaanbhoje',
    color: '#00F5FF',
  },
  {
    id: 'katha-amaltas',
    name: 'Katha Amaltas',
    logo: '/assets/katha_main_logo.webp',
    tech: ['React.js', 'Tailwind CSS', 'JavaScript'],
    description: 'Dynamic film studio portfolio site with extensive visual design and custom animations.',
    useCase: 'Presents the studio\'s film work through an engaging front-end experience powered by custom JavaScript animations and rich visual design.',
    url: 'github.com/ayaanbhoje',
    color: '#FF2D78',
  },
  {
    id: 'plum-perch',
    name: 'Plum Perch',
    logo: '/assets/plum%20perch%20final.png',
    tech: ['React.js', 'Tailwind CSS', 'Node.js'],
    description: 'Modern, trendy website for a marketing firm to build brand awareness and attract clients.',
    useCase: 'Implemented responsive design and interactive UI/UX elements to boost engagement and turn visitors into leads.',
    url: 'github.com/ayaanbhoje',
    color: '#A855F7',
  },
  {
    id: 'astravant-realty',
    name: 'Astravant Realty',
    logo: '/assets/astravant_logo_port.png',
    tech: ['React.js', 'Tailwind CSS', 'Node.js', 'GCP'],
    description: 'Full-stack real estate website showcasing housing options and building company awareness.',
    useCase: 'A browsable, responsive property showcase designed to drive enquiries - successfully deployed and hosted on Google Cloud Platform.',
    url: 'github.com/ayaanbhoje',
    color: '#FFB347',
  },
];

// TODO: skill levels are illustrative - adjust the numbers to taste.
const SKILLS = [
  { name: 'JavaScript', level: 90, color: '#00F5FF' },
  { name: 'React / Next.js', level: 90, color: '#00F5FF' },
  { name: 'Tailwind CSS', level: 88, color: '#FF2D78' },
  { name: 'Node.js', level: 80, color: '#A855F7' },
  { name: 'Python', level: 82, color: '#FFB347' },
  { name: 'SQL / MongoDB', level: 75, color: '#A855F7' },
  { name: 'Automation (n8n / Pabbly)', level: 85, color: '#FF2D78' },
  { name: 'Figma / Design', level: 80, color: '#FFB347' },
];

/* project logo image with a graceful letter-fallback if the file is missing */
function ProjectLogo({ project, size }: { project: Project; size: number }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return (
      <img
        src={project.logo}
        alt={project.name}
        onError={() => setOk(false)}
        style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
      />
    );
  }
  return (
    <span className="font-mono font-bold" style={{ color: project.color, fontSize: size * 0.5 }}>
      {project.name.charAt(0)}
    </span>
  );
}

export default function LaptopModal({ onClose }: LaptopModalProps) {
  const [view, setView] = useState<LaptopView>('desktop');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="zoom-in-modal w-full max-w-4xl max-h-[90vh] glass-dark border border-border rounded-2xl overflow-hidden flex flex-col"
        style={{ boxShadow: '0 0 60px rgba(0,245,255,0.15), 0 30px 80px rgba(0,0,0,0.8)' }}>

        {/* Laptop screen title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
          <div className="font-mono text-xs text-muted-foreground tracking-widest">
            {view === 'desktop' ? 'NeoDesk OS - Portfolio' :
             view === 'profile' ? 'about_me.sh' :
             `project_${selectedProject?.id}.md`}
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
          >
            &#10005; CLOSE
          </button>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto scrollbar-cyber">

          {/* === DESKTOP VIEW === */}
          {view === 'desktop' && (
            <div className="p-6">
              {/* Wallpaper area */}
              <div className="relative rounded-xl overflow-hidden mb-6"
                style={{
                  background: 'linear-gradient(135deg, #0d0618 0%, #1a0a2e 50%, #0d0618 100%)',
                  border: '1px solid rgba(0,245,255,0.1)',
                  minHeight: '200px',
                }}>
                <div className="absolute inset-0 blob-bg opacity-50" />
                <div className="relative z-10 p-8 text-center">
                  <div className="font-mono text-5xl mb-2" style={{ color: '#00F5FF', textShadow: '0 0 20px #00F5FF' }}>AB</div>
                  <h2 className="font-mono text-2xl font-bold text-foreground mb-1">Ayaan Bhoje</h2>
                  <p className="font-mono text-sm text-muted-foreground">Full-Stack Developer &amp; Marketing Technologist</p>
                  <p className="font-mono text-xs text-primary mt-2">Mumbai, India &bull; Available for work</p>
                </div>
              </div>

              {/* Desktop icons grid */}
              <div className="mb-6">
                <p className="font-mono text-xs text-muted-foreground mb-4 tracking-widest">DESKTOP</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">

                  {/* Profile icon */}
                  <button
                    onClick={() => setView('profile')}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: 'linear-gradient(135deg, #00F5FF20, #00F5FF10)', border: '1px solid rgba(0,245,255,0.3)' }}>
                      👤
                    </div>
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors text-center">
                      about.sh
                    </span>
                  </button>

                  {/* Project icons */}
                  {PROJECTS.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => { setSelectedProject(project); setView('project'); }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent hover:border-primary hover:bg-primary/5 transition-all group project-card-hover"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden p-1.5"
                        style={{
                          background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`,
                          border: `1px solid ${project.color}40`,
                        }}>
                        <ProjectLogo project={project} size={36} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">
                        {project.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Taskbar */}
              <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-border"
                style={{ background: 'rgba(13,6,24,0.8)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold"
                    style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', color: '#00F5FF' }}>
                    AB
                  </div>
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  NeoDesk OS v2.4.1
                </div>
                <div className="font-mono text-xs text-primary">21:42</div>
              </div>
            </div>
          )}

          {/* === PROFILE / ABOUT VIEW === */}
          {view === 'profile' && (
            <div className="p-6">
              <button
                onClick={() => setView('desktop')}
                className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                &larr; back
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bio */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-border"
                    style={{ background: 'rgba(13,6,24,0.6)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{ background: 'linear-gradient(135deg, #00F5FF20, #FF2D7820)', border: '2px solid rgba(0,245,255,0.3)' }}>
                        🧑‍💻
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-foreground">Ayaan Bhoje</h3>
                        <p className="font-mono text-xs text-primary">@ayaanbhoje</p>
                        <p className="font-mono text-xs text-muted-foreground">Mumbai, IN &bull; IT + AI Honors</p>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                      Final-year Information Technology student with Honors in AI, building responsive, animated
                      web experiences and marketing automation. I work across the stack - from React front-ends
                      to n8n/Pabbly workflows - and love where clean engineering meets sharp design.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Projects', value: '10+' },
                      { label: 'Clients', value: '9+' },
                      { label: 'CGPA', value: '8.47' },
                    ].map(stat => (
                      <div key={stat.label} className="p-3 rounded-xl border border-border text-center"
                        style={{ background: 'rgba(13,6,24,0.6)' }}>
                        <div className="font-mono font-bold text-primary text-glow-cyan text-lg">{stat.value}</div>
                        <div className="font-mono text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <p className="font-mono text-xs text-muted-foreground tracking-widest mb-3">SKILL_LEVELS</p>
                  {SKILLS.map((skill, i) => (
                    <div key={skill.name}
                      className="skill-badge"
                      style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-xs text-foreground">{skill.name}</span>
                        <span className="font-mono text-xs" style={{ color: skill.color }}>{skill.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${skill.level}%`,
                            background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                            boxShadow: `0 0 6px ${skill.color}60`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === PROJECT DETAIL VIEW === */}
          {view === 'project' && selectedProject && (
            <div className="p-6">
              <button
                onClick={() => setView('desktop')}
                className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                &larr; back to desktop
              </button>

              <div className="space-y-6">
                {/* Project header */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden p-2"
                    style={{
                      background: `linear-gradient(135deg, ${selectedProject.color}20, ${selectedProject.color}10)`,
                      border: `2px solid ${selectedProject.color}40`,
                    }}>
                    <ProjectLogo project={selectedProject} size={48} />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-xl text-foreground mb-1"
                      style={{ textShadow: `0 0 10px ${selectedProject.color}40` }}>
                      {selectedProject.name}
                    </h3>
                    <p className="font-mono text-sm" style={{ color: selectedProject.color }}>
                      {selectedProject.url}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-xl border border-border"
                  style={{ background: 'rgba(13,6,24,0.6)' }}>
                  <p className="font-mono text-xs text-muted-foreground mb-1 tracking-widest">DESCRIPTION</p>
                  <p className="font-mono text-sm text-foreground leading-relaxed mt-2">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Use case */}
                <div className="p-4 rounded-xl border"
                  style={{
                    background: `${selectedProject.color}08`,
                    borderColor: `${selectedProject.color}30`,
                  }}>
                  <p className="font-mono text-xs tracking-widest mb-2" style={{ color: selectedProject.color }}>
                    USE_CASE
                  </p>
                  <p className="font-mono text-sm text-foreground leading-relaxed">
                    {selectedProject.useCase}
                  </p>
                </div>

                {/* Tech stack */}
                <div>
                  <p className="font-mono text-xs text-muted-foreground tracking-widest mb-3">TECH_STACK</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className="font-mono text-xs px-3 py-1 rounded-full border"
                        style={{
                          color: selectedProject.color,
                          borderColor: `${selectedProject.color}40`,
                          background: `${selectedProject.color}10`,
                        }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a href={`https://${selectedProject.url}`} target="_blank" rel="noopener noreferrer" className="neon-btn inline-block px-6 py-3 rounded-lg text-xs" style={{ borderColor: selectedProject.color, color: selectedProject.color }}>
                  OPEN PROJECT &rarr;
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}