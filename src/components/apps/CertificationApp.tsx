import React from 'react';
import { certificationsData } from '../../data/certifications';
import { ShieldCheck, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function CertificationApp() {
  return (
    <div className="w-full h-full text-slate-200 p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Certifications</h1>
            <p className="text-slate-400">Verified skill badges and credentials.</p>
          </div>
        </div>

        <div className="space-y-6">
          {certificationsData.map((cert) => (
            <div 
              key={cert.id}
              className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors"
            >
              {/* Badge Left */}
              <div className="w-full md:w-48 h-40 md:h-auto bg-slate-900/50 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden p-6">
                {cert.badgeUrl ? (
                  <img src={cert.badgeUrl} alt={cert.title} className="max-w-full max-h-full object-contain drop-shadow-lg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <ShieldCheck size={48} className="text-slate-700" />
                )}
              </div>

              {/* Information Center */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-white mb-1">{cert.title}</h2>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <span className="font-medium text-cyan-400">{cert.platform}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{cert.date}</span>
                </div>
                
                <p className="text-sm text-slate-300 mb-4 max-w-xl">{cert.description}</p>
                
                <div className="flex items-center gap-2 mt-auto text-xs font-medium text-slate-400">
                  <span>Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-slate-300">{skill}</span>
                        {idx < cert.skills.length - 1 && <span className="text-slate-600">•</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Right */}
              {cert.credentialUrl && (
                <div className="p-6 bg-slate-900/30 border-t md:border-t-0 md:border-l border-white/5 flex flex-col justify-center items-center md:items-end min-w-[180px]">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto text-center px-4 py-2.5 rounded-lg bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 text-sm font-medium transition-colors border border-cyan-500/30 flex items-center justify-center gap-2"
                  >
                    View Credential
                    <ExternalLink size={14} />
                  </a>
                  {cert.credentialId && (
                    <div className="mt-3 text-xs text-slate-500 text-center md:text-right">
                      ID: {cert.credentialId}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
