import React, { useState } from 'react';
import { certificationsData } from '../../data/certifications';
import { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

function BadgePreview({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-slate-900/80 flex flex-col items-center justify-center text-slate-500 p-4 select-none">
        <ShieldCheck size={36} className="text-cyan-500/40 mb-1" />
        <span className="text-[11px] font-medium text-slate-400 text-center">{alt}</span>
        <span className="text-[10px] text-slate-600 uppercase tracking-widest mt-0.5">Badge</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="max-w-full max-h-full object-contain drop-shadow-md" 
      onError={() => setHasError(true)} 
    />
  );
}

export default function CertificationApp() {
  return (
    <div className="w-full h-full text-slate-200 p-6 md:p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-0.5">Certification</h1>
            <p className="text-slate-400 text-sm">Verified skill certifications and platform assessment badges.</p>
          </div>
        </div>

        {certificationsData.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">No certifications configured yet</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md">
                Verified skill certification badges will be displayed here once added to <code className="text-cyan-300 font-mono text-xs">src/data/certifications.ts</code> and <code className="text-cyan-300 font-mono text-xs">public/assets/certifications/</code>.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Awaiting verified skill badges</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {certificationsData.map((cert) => (
              <div 
                key={cert.id}
                className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors"
              >
                {/* Badge (Left) */}
                <div className="w-full md:w-52 h-44 md:h-auto bg-slate-900/80 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden p-6">
                  <BadgePreview src={cert.badgeUrl} alt={cert.title} />
                </div>

                {/* Information (Right) */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-white mb-1">{cert.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm mb-3">
                      <span className="font-medium text-cyan-400">{cert.platform}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{cert.date}</span>
                      {cert.credentialId && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500 font-mono text-xs">ID: {cert.credentialId}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-xs md:text-sm text-slate-300 mb-4 leading-relaxed">{cert.description}</p>
                    
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        <span className="text-xs font-medium text-slate-400 mr-1">Skills:</span>
                        {cert.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {cert.credentialUrl && (
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5 mt-auto">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white text-xs md:text-sm font-medium transition-colors border border-cyan-500/50"
                      >
                        <ExternalLink size={14} />
                        View Credential
                      </a>
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
