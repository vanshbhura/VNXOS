import React from 'react';
import { User, ExternalLink, GraduationCap, Sparkles } from 'lucide-react';
import { profileData } from '../../data/profile';
import { allSkillsList } from '../../data/skills';

export default function LinkedInApp() {
  const linkedInUrl = profileData.socialLinks.find(s => s.label === 'LinkedIn')?.url;

  return (
    <div className="w-full h-full bg-[#f3f2ef] overflow-y-auto text-slate-900 font-sans">
      
      {/* Navbar Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 md:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0a66c2] font-bold text-lg">
          <div className="w-7 h-7 rounded bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm">
            in
          </div>
          <span className="hidden sm:inline text-gray-800 font-semibold text-base">Professional Profile</span>
        </div>
        {linkedInUrl ? (
          <a 
            href={linkedInUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] px-4 py-1.5 rounded-full transition-colors"
          >
            <span>View on LinkedIn</span>
            <ExternalLink size={13} />
          </a>
        ) : (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Profile Link Pending
          </span>
        )}
      </div>

      <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
        
        {/* Intro Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#0a66c2]/80 to-[#004182] w-full" />
          <div className="px-6 pb-6 relative">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 absolute -top-14 flex items-center justify-center overflow-hidden shadow-sm">
              <User size={56} className="text-slate-400" />
            </div>
            
            <div className="mt-16 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{profileData.role}</p>
                <p className="text-xs text-gray-500 mt-1">NIMS University • India</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">About</h2>
          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
            {profileData.introduction}
          </p>
        </div>

        {/* Education Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Education</h2>
          <div className="space-y-4">
            {profileData.education.map((edu, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-slate-100 border border-gray-200 flex items-center justify-center rounded-lg">
                  <GraduationCap size={20} className="text-[#0a66c2]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{edu.institution}</h3>
                  <p className="text-xs md:text-sm text-gray-700">{edu.degree}</p>
                  {edu.cgpa && (
                    <p className="text-xs text-gray-500 font-medium mt-0.5">CGPA: {edu.cgpa}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {allSkillsList.map((skill, idx) => (
              <span key={idx} className="inline-block px-3 py-1 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* LinkedIn Connection Placeholder Banner */}
        {!linkedInUrl && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
            <Sparkles size={18} className="text-[#0a66c2] flex-shrink-0" />
            <span>
              The LinkedIn profile URL can be configured in <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200">src/data/profile.ts</code> under <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200">socialLinks</code>.
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
