import React from 'react';
import { experienceData } from '../../data/experience';
import { Briefcase, Calendar } from 'lucide-react';

export default function ExperienceApp() {
  return (
    <div className="w-full h-full text-slate-200 p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Experience</h1>
          <p className="text-slate-400">Professional work history and roles.</p>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12 pb-8">
          {experienceData.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 md:pl-10 group">
              {/* Timeline dot */}
              <div className="absolute left-[-21px] top-1 w-10 h-10 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-colors z-10">
                <Briefcase size={18} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
              </div>

              {/* Content */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-violet-500/30 transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{exp.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-violet-400 font-medium">{exp.organization}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {exp.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <Calendar size={14} />
                    {exp.duration}
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {exp.description}
                </p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Achievements</h3>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-violet-500 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-violet-500" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">
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

      </div>
    </div>
  );
}
