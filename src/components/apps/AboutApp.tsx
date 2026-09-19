import React from 'react';
import { profileData } from '../../data/profile';
import { skillsData } from '../../data/skills';
import * as LucideIcons from 'lucide-react';

function LucideIcon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} className={className} />;
  return <Icon size={size} className={className} />;
}

export default function AboutApp() {
  const activeSocialLinks = profileData.socialLinks.filter(l => l.url && l.url.trim() !== '');

  return (
    <div className="w-full h-full text-slate-200 p-6 md:p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-slate-800/80 flex-shrink-0 border border-white/10 flex items-center justify-center shadow-lg">
            <LucideIcons.User size={44} className="text-slate-400" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{profileData.name}</h1>
            <p className="text-lg text-violet-400 font-medium">{profileData.role}</p>
            <p className="text-slate-400 leading-relaxed mt-2 text-sm md:text-base">{profileData.introduction}</p>
          </div>
        </div>

        {/* Education & Focus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <LucideIcons.GraduationCap size={18} className="text-emerald-400" />
              Education
            </h2>
            <div className="space-y-3">
              {profileData.education.map((edu, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="font-medium text-slate-200 text-sm md:text-base">{edu.degree}</h3>
                  <p className="text-xs md:text-sm text-slate-400">{edu.institution}</p>
                  {edu.cgpa && (
                    <p className="text-xs font-medium text-emerald-400/90 mt-0.5">
                      CGPA: {edu.cgpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <LucideIcons.Target size={18} className="text-rose-400" />
              Current Focus
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              {profileData.currentFocus}
            </p>
          </section>
        </div>

        {/* Skills & Technologies categorized */}
        <section className="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <LucideIcons.Code2 size={18} className="text-sky-400" />
            Skills & Technical Areas
          </h2>
          <div className="space-y-4">
            {skillsData.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="px-2.5 py-1 text-xs font-medium bg-slate-800/80 text-slate-200 rounded-md border border-white/10 hover:border-violet-500/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Interests */}
        <section className="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <LucideIcons.Cpu size={18} className="text-amber-400" />
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

        {/* Contact & Social Links */}
        <div className="p-5 md:p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
          <div className="text-xs md:text-sm font-medium text-slate-300 flex items-center gap-2">
            <LucideIcons.Terminal size={16} className="text-violet-400" />
            VNX.OS Developer Profile
          </div>
          <div className="flex items-center gap-4">
            {activeSocialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <LucideIcon name={link.icon} size={15} />
                {link.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
