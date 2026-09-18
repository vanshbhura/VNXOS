import React from 'react';
import { resourcesData } from '../../data/resources';
import * as LucideIcons from 'lucide-react';

function LucideIcon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} className={className} />;
  return <Icon size={size} className={className} />;
}

export default function ResourcesApp() {
  const categories = Array.from(new Set(resourcesData.map(r => r.category)));

  return (
    <div className="w-full h-full text-slate-200 p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <LucideIcons.Library size={28} className="text-pink-400" />
            Developer Resources
          </h1>
          <p className="text-slate-400">Curated tools, documentation, and references.</p>
        </div>

        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90 border-b border-white/5 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourcesData.filter(r => r.category === category).map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0 border border-pink-500/20 group-hover:scale-110 transition-transform">
                    {resource.icon ? <LucideIcon name={resource.icon} size={20} /> : <LucideIcons.Link size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-200 mb-1 group-hover:text-pink-300 transition-colors truncate">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-snug">
                      {resource.description}
                    </p>
                  </div>
                  <LucideIcons.ExternalLink size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
