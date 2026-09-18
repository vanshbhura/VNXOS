import React from 'react';
import { profileData } from '../../data/profile';
import * as LucideIcons from 'lucide-react';

function LucideIcon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} className={className} />;
  return <Icon size={size} className={className} />;
}

export default function AboutApp() {
  return (
    <div className="w-full h-full text-slate-200 p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border-2 border-slate-700 flex items-center justify-center">
             <LucideIcons.User size={48} className="text-slate-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">{profileData.name}</h1>
            <p className="text-xl text-violet-400 font-medium">{profileData.role}</p>
            <p className="text-slate-400 max-w-xl leading-relaxed mt-4">{profileData.introduction}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            <section className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LucideIcons.GraduationCap size={20} className="text-emerald-400" />
                Education
              </h2>
              <div className="space-y-4">
                {profileData.education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="font-medium text-slate-200">{edu.degree}</h3>
                    <p className="text-sm text-slate-400">{edu.institution} • {edu.duration}</p>
                    {edu.details && <p className="text-sm text-slate-500 mt-1">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>

            <section className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LucideIcons.Target size={20} className="text-rose-400" />
                Current Focus
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {profileData.currentFocus}
              </p>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <section className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LucideIcons.Code2 size={20} className="text-sky-400" />
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-medium bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LucideIcons.Cpu size={20} className="text-amber-400" />
                Technical Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {profileData.technicalInterests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-medium bg-amber-500/10 text-amber-300 rounded-full border border-amber-500/20">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap gap-6 items-center">
          <div className="text-sm font-medium text-slate-300 flex items-center gap-2 mr-auto">
            <LucideIcons.Mail size={16} className="text-slate-400" />
            {profileData.email}
          </div>
          {profileData.socialLinks.map((link, idx) => (
             <a
               key={idx}
               href={link.url}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
             >
               <LucideIcon name={link.icon} size={18} />
               {link.label}
             </a>
          ))}
        </div>

      </div>
    </div>
  );
}
