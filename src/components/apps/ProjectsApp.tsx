import React, { useState } from 'react';
import { projectsData } from '../../data/projects';
import { Code, ExternalLink, Terminal } from 'lucide-react';

function ProjectImage({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-slate-900/90 flex flex-col items-center justify-center text-slate-500 p-4 select-none">
        <Terminal size={36} className="text-violet-500/50 mb-2" />
        <span className="text-xs font-medium text-slate-400 text-center tracking-wide">{alt}</span>
        <span className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">Preview Asset</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      onError={() => setHasError(true)} 
    />
  );
}

export default function ProjectsApp() {
  return (
    <div className="w-full h-full text-slate-200 p-6 md:p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Projects</h1>
          <p className="text-slate-400 text-sm">Verified portfolio projects and engineering systems.</p>
        </div>

        <div className="space-y-6">
          {projectsData.map((project) => (
            <div 
              key={project.id}
              className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/30 transition-colors group"
            >
              {/* Project Image Left */}
              <div className="w-full md:w-64 h-44 md:h-auto bg-slate-900 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <ProjectImage src={project.image} alt={project.name} />
              </div>

              {/* Information Middle */}
              <div className="flex-1 p-5 md:p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg md:text-xl font-semibold text-white">{project.name}</h2>
                    {project.status && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {project.status}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex-shrink-0">
                    {project.category}
                  </span>
                </div>
                
                <p className="text-xs md:text-sm font-medium text-violet-300 mb-2">{project.shortDescription}</p>
                <p className="text-xs md:text-sm text-slate-400 mb-4 flex-1 leading-relaxed">{project.detailedDescription}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons Right/Bottom-Right - strictly conditional */}
                {(project.githubUrl || project.liveUrl) && (
                  <div className="flex flex-wrap items-center justify-end gap-3 mt-auto pt-3 border-t border-white/5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs md:text-sm font-medium transition-colors border border-slate-700"
                      >
                        <Code size={15} />
                        GitHub Repo
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs md:text-sm font-medium transition-colors border border-violet-500"
                      >
                        <ExternalLink size={15} />
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
