import React, { useState } from 'react';
import { certificatesData } from '../../data/certificates';
import { Award, ExternalLink, FileText, Sparkles } from 'lucide-react';

function CertPreview({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-slate-900/80 flex flex-col items-center justify-center text-slate-500 p-4 select-none">
        <Award size={36} className="text-emerald-500/40 mb-1" />
        <span className="text-[11px] font-medium text-slate-400 text-center">{alt}</span>
        <span className="text-[10px] text-slate-600 uppercase tracking-widest mt-0.5">Certificate</span>
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

export default function CertificatesApp() {
  return (
    <div className="w-full h-full text-slate-200 p-6 md:p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Award size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-0.5">Certificates</h1>
            <p className="text-slate-400 text-sm">Verified professional course completions and academic credentials.</p>
          </div>
        </div>

        {certificatesData.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">No certificates configured yet</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md">
                Verified certificate records will be displayed here once added to <code className="text-emerald-300 font-mono text-xs">src/data/certificates.ts</code> and <code className="text-emerald-300 font-mono text-xs">public/assets/certificates/</code>.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Awaiting verified credentials</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {certificatesData.map((cert) => (
              <div 
                key={cert.id}
                className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-colors"
              >
                {/* Image Left */}
                <div className="w-full md:w-56 h-40 md:h-auto bg-slate-900 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden p-4">
                  <CertPreview src={cert.assetPath} alt={cert.name} />
                </div>

                {/* Information Center */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-1">{cert.name}</h2>
                  <div className="flex items-center gap-2 text-xs md:text-sm mb-3">
                    <span className="font-medium text-emerald-400">{cert.issuer}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{cert.date}</span>
                    {cert.credentialId && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 font-mono text-xs">ID: {cert.credentialId}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs md:text-sm text-slate-300 mb-3 max-w-xl leading-relaxed">{cert.description}</p>
                  
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <span>Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Credential Action Right */}
                <div className="p-5 md:p-6 bg-slate-900/30 border-t md:border-t-0 md:border-l border-white/5 flex flex-col justify-center items-center md:items-end gap-2.5 min-w-[180px]">
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-medium transition-colors border border-emerald-500 w-full justify-center"
                    >
                      <ExternalLink size={14} />
                      View Credential
                    </a>
                  )}
                  {(cert.certificatePdf || cert.assetPath) && (
                    <a
                      href={cert.certificatePdf || cert.assetPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium transition-colors border border-slate-700 w-full justify-center"
                    >
                      <FileText size={14} />
                      View Certificate
                    </a>
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
