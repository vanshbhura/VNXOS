import React from 'react';
import { User, Briefcase, MapPin, ExternalLink, GraduationCap, ChevronRight } from 'lucide-react';
import { profileData } from '../../data/profile';
import { experienceData } from '../../data/experience';

export default function LinkedInApp() {
  const linkedInUrl = profileData.socialLinks.find(s => s.label === 'LinkedIn')?.url;

  return (
    <div className="w-full h-full bg-[#f3f2ef] overflow-y-auto text-slate-900 font-sans">
      
      {/* Navbar Fake */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 md:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#0a66c2] font-bold text-xl">
          <User size={28} className="fill-current" />
          <span className="hidden md:inline">LinkedIn Profile</span>
        </div>
        {linkedInUrl && (
          <a 
            href={linkedInUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#0a66c2] hover:bg-[#004182] px-4 py-1.5 rounded-full transition-colors"
          >
            View Real Profile
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
        
        {/* Intro Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="h-32 bg-[#a0b4b7] w-full" />
          <div className="px-6 pb-6 relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 absolute -top-16 flex items-center justify-center overflow-hidden shadow-sm">
              <User size={64} className="text-slate-400" />
            </div>
            
            <div className="mt-20 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-base text-gray-900 mt-1">{profileData.role}</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                  <MapPin size={14} />
                  Remote · Contact Info
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {profileData.introduction}
          </p>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Experience</h2>
          <div className="space-y-6">
            {experienceData.map((exp, idx) => (
              <div key={exp.id}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-slate-100 flex items-center justify-center rounded">
                    <Briefcase size={24} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-sm text-gray-900">{exp.organization} · {exp.type}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{exp.duration}</p>
                    <p className="text-sm text-gray-700 mt-3">{exp.description}</p>
                  </div>
                </div>
                {idx < experienceData.length - 1 && <hr className="mt-6 border-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Education</h2>
          <div className="space-y-6">
            {profileData.education.map((edu, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-slate-100 flex items-center justify-center rounded">
                  <GraduationCap size={24} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <p className="text-sm text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{edu.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, idx) => (
              <span key={idx} className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 text-sm font-medium text-gray-800 rounded-md">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
