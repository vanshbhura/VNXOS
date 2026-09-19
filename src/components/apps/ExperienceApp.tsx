import React from 'react';
import { experienceData } from '../../data/experience';
import { Briefcase, Calendar, Sparkles } from 'lucide-react';

export default function ExperienceApp() {
  return (
    <div className="w-full h-full text-slate-200 p-6 md:p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 flex-shrink-0">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-0.5">Experience</h1>
            <p className="text-slate-400 text-sm">Professional work history, internships, and engineering roles.</p>
          </div>
        </div>

        {experienceData.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Briefcase size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">No experience entries configured yet</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md">
                Professional engineering positions and roles will be displayed along a timeline once configured in <code className="text-violet-300 font-mono text-xs">src/data/experience.ts</code>.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={14} className="text-violet-400" />
              <span>Timeline ready for configuration</span>
            </div>
          </div>
        ) : (
          <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-10 pb-8">
            {experienceData.map((exp) => (
              <div key={exp.id} className="relative pl-8 md:pl-10 group">
                {/* Timeline dot */}
                <div className="absolute left-[-21px] top-1 w-10 h-10 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-colors z-10">
                  <Briefcase size={18} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
                </div>

                {/* Content */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 hover:border-violet-500/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-white">{exp.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-violet-400 font-medium text-sm">{exp.organization}</span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-900/50 px-2.5 py-1 rounded-lg border border-white/5 self-start">
                      <Calendar size={13} />
                      {exp.duration}
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Achievements</h3>
                      <ul className="space-y-1.5">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-xs md:text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-violet-500 mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-violet-500" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech, idx) => (
                          <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
