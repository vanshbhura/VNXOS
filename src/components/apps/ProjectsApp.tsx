import React from 'react';
import { projectsData } from '../../data/projects';
import { Code, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function ProjectsApp() {
  return (
    <div className="w-full h-full text-slate-200 p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Projects</h1>
          <p className="text-slate-400">A selection of my technical work and portfolio projects.</p>
        </div>

        <div className="space-y-6">
          {projectsData.map((project) => (
            <div 
              key={project.id}
              className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-violet-500/30 transition-colors group"
            >
              {/* Project Image Left */}
              <div className="w-full md:w-64 h-48 md:h-auto bg-slate-900 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <ImageIcon size={48} className="text-slate-700" />
                )}
              </div>

              {/* Information Middle */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {project.category}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-violet-300 mb-4">{project.shortDescription}</p>
                <p className="text-sm text-slate-400 mb-6 flex-1">{project.detailedDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="text-xs font-medium px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons Right/Bottom-Right */}
                <div className="flex flex-wrap items-center justify-end gap-3 mt-auto pt-4 border-t border-white/5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700"
                    >
                      <Code size={16} />
                      GitHub Repo
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors border border-violet-500"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
