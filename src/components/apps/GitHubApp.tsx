import React from 'react';
import { Code, GitCommit, GitFork, Star, ExternalLink } from 'lucide-react';
import { profileData } from '../../data/profile';

export default function GitHubApp() {
  const githubProfileUrl = 'https://github.com/vanshbhura';
  const username = 'vanshbhura';

  const pinnedRepos = [
    {
      name: 'VNXOS',
      description: 'An interactive operating-system-style portfolio built with React, TypeScript, and Tailwind CSS.',
      language: 'TypeScript',
      languageColor: '#3178c6',
      url: 'https://github.com/vanshbhura/VNXOS',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#0d1117] text-[#c9d1d9] overflow-y-auto md:overflow-hidden font-sans">
      
      {/* Sidebar Profile */}
      <div className="w-full md:w-80 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#30363d] flex-shrink-0 md:overflow-y-auto">
        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 mb-6">
          <div className="w-20 h-20 md:w-full md:h-auto md:aspect-square rounded-2xl md:rounded-full border border-[#30363d] bg-[#161b22] flex items-center justify-center overflow-hidden mb-0 md:mb-4">
            <Code size={48} className="text-[#8b949e]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#c9d1d9]">{profileData.name}</h1>
            <h2 className="text-lg font-light text-[#8b949e]">@{username}</h2>
          </div>
        </div>

        <a 
          href={githubProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 mb-6 text-center text-sm font-medium bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] rounded-md transition-colors text-[#c9d1d9]"
        >
          <span>View GitHub Profile</span>
          <ExternalLink size={14} />
        </a>

        <p className="text-sm mb-4 leading-relaxed text-[#8b949e]">
          {profileData.role} • {profileData.currentFocus}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 md:overflow-y-auto bg-[#0d1117]">
        <div className="border-b border-[#30363d] pb-4 mb-6 flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2 font-semibold border-b-2 border-[#f78166] pb-4 -mb-[17px]">
            <GitCommit size={18} />
            <span>Featured Repositories</span>
            <span className="bg-[#161b22] px-2 py-0.5 rounded-full text-xs border border-[#30363d]">{pinnedRepos.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {pinnedRepos.map((repo, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-[#30363d] bg-[#0d1117] flex flex-col hover:border-[#8b949e] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline font-semibold text-[15px] truncate pr-4">
                  {repo.name}
                </a>
                <span className="text-[11px] font-medium text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded-full flex-shrink-0">
                  Public
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#8b949e] mb-6 flex-1 leading-relaxed">
                {repo.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#8b949e] pt-3 border-t border-[#30363d]/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                  <span>{repo.language}</span>
                </div>
                <a 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#58a6ff] hover:underline"
                >
                  <span>Open repo</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
