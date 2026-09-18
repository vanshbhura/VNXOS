import React from 'react';
import { aiToolsData } from '../../data/aiTools';
import * as LucideIcons from 'lucide-react';

function LucideIcon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const Icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  const Icon = Icons[name];
  if (!Icon) return <LucideIcons.Square size={size} className={className} />;
  return <Icon size={size} className={className} />;
}

export default function AIToolsApp() {
  return (
    <div className="w-full h-full text-slate-200 p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-10 text-center">
          <div className="w-16 h-16 mx-auto bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-4 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <LucideIcons.Bot size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">AI Tools Showcase</h1>
          <p className="text-slate-400 max-w-lg mx-auto">Explore the artificial intelligence tools and platforms I use to accelerate development and boost productivity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {aiToolsData.map(tool => (
            <a
              key={tool.id}
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-slate-800/80 hover:border-indigo-500/40 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors" />
              
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors z-10">
                <LucideIcon name={tool.icon} size={24} />
              </div>
              
              <div className="flex-1 min-w-0 z-10">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-200 truncate">{tool.name}</h3>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-300/70 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex-shrink-0 ml-2">
                    {tool.category}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
