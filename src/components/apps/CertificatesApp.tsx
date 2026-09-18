import React from 'react';
import { certificatesData } from '../../data/certificates';
import { Award, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function CertificatesApp() {
  return (
    <div className="w-full h-full text-slate-200 p-8 overflow-y-auto" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Certificates</h1>
            <p className="text-slate-400">Professional certifications and credentials.</p>
          </div>
        </div>

        <div className="space-y-6">
          {certificatesData.map((cert) => (
            <div 
              key={cert.id}
              className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-colors"
            >
              {/* Image Left */}
              <div className="w-full md:w-56 h-40 md:h-auto bg-slate-900 border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden p-4">
                {cert.assetPath ? (
                  <img src={cert.assetPath} alt={cert.name} className="max-w-full max-h-full object-contain drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <ImageIcon size={40} className="text-slate-700" />
                )}
              </div>

              {/* Information Center */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h2 className="text-xl font-semibold text-white mb-1">{cert.name}</h2>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <span className="font-medium text-emerald-400">{cert.issuer}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{cert.date}</span>
                </div>
                
                <p className="text-sm text-slate-300 mb-4 max-w-xl">{cert.description}</p>
                
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
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

              {/* Credential Action Right */}
              <div className="p-6 bg-slate-900/30 border-t md:border-t-0 md:border-l border-white/5 flex flex-col justify-center items-center md:items-end min-w-[200px]">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto text-center px-5 py-2.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 text-sm font-medium transition-colors border border-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    View Credential
                    <ExternalLink size={14} />
                  </a>
                )}
                {cert.credentialId && (
                  <div className="mt-3 text-xs text-slate-500 text-center md:text-right">
                    ID: {cert.credentialId}
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
