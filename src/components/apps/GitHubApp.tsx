import React from 'react';
import { Code, Users, Star, GitBranch, Link as LinkIcon, MapPin, Building2, Calendar, GitCommit } from 'lucide-react';

export default function GitHubApp() {
  const profile = {
    username: 'vanshbhura',
    name: 'Vansh Bhura',
    bio: 'Software Engineer focused on AI & Web. Building VNX.OS and next-gen tools.',
    followers: 120,
    following: 45,
    location: 'Remote',
    company: 'Tech Innovations',
    joinDate: 'Joined Dec 2020',
    avatar: 'https://github.com/vanshbhura.png', // Placeholder approach
  };

  const repos = [
    {
      name: 'VNXOS',
      description: 'A web-based desktop operating system portfolio built with React and TypeScript.',
      stars: 45,
      forks: 12,
      language: 'TypeScript',
      languageColor: '#3178c6',
      url: 'https://github.com/vanshbhura/VNXOS',
      updated: 'Updated 2 days ago'
    },
    {
      name: 'Enterprise-AI-Hub',
      description: 'Internal knowledge base powered by RAG and LLMs.',
      stars: 128,
      forks: 34,
      language: 'Python',
      languageColor: '#3572A5',
      url: 'https://github.com/vanshbhura',
      updated: 'Updated 1 week ago'
    }
  ];

  const githubUrl = `https://github.com/${profile.username}`;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#0d1117] text-[#c9d1d9] overflow-y-auto md:overflow-hidden font-sans">
      
      {/* Sidebar Profile */}
      <div className="w-full md:w-80 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#30363d] flex-shrink-0 md:overflow-y-auto">
        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 mb-6">
          <div className="w-20 h-20 md:w-full md:h-auto md:aspect-square rounded-full border border-[#30363d] bg-[#161b22] flex items-center justify-center overflow-hidden mb-0 md:mb-4">
            <Code size={48} className="text-[#8b949e] md:hidden" />
            <img src={profile.avatar} alt="Avatar" className="hidden md:block w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#c9d1d9]">{profile.name}</h1>
            <h2 className="text-xl font-light text-[#8b949e]">{profile.username}</h2>
          </div>
        </div>

        <a 
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-1.5 px-3 mb-6 text-center text-sm font-medium bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] rounded-md transition-colors text-[#c9d1d9]"
        >
          View on GitHub
        </a>

        <p className="text-sm mb-4 leading-relaxed">{profile.bio}</p>

        <div className="flex items-center gap-4 text-sm text-[#8b949e] mb-6">
          <a href="#" className="flex items-center gap-1 hover:text-[#58a6ff]">
            <Users size={16} />
            <span className="font-medium text-[#c9d1d9]">{profile.followers}</span> followers
          </a>
          <span>·</span>
          <a href="#" className="hover:text-[#58a6ff]">
            <span className="font-medium text-[#c9d1d9]">{profile.following}</span> following
          </a>
        </div>

        <ul className="space-y-2 text-sm text-[#c9d1d9]">
          <li className="flex items-center gap-2">
            <Building2 size={16} className="text-[#8b949e]" />
            {profile.company}
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={16} className="text-[#8b949e]" />
            {profile.location}
          </li>
          <li className="flex items-center gap-2">
            <Calendar size={16} className="text-[#8b949e]" />
            {profile.joinDate}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 md:overflow-y-auto bg-[#0d1117]">
        <div className="border-b border-[#30363d] pb-4 mb-6 flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2 font-semibold border-b-2 border-[#f78166] pb-4 -mb-[17px]">
            <GitCommit size={18} />
            Repositories <span className="bg-[#161b22] px-2 py-0.5 rounded-full text-xs border border-[#30363d]">12</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {repos.map((repo, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#30363d] bg-[#0d1117] flex flex-col hover:border-[#8b949e] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline font-semibold text-[15px] truncate pr-4">
                  {repo.name}
                </a>
                <span className="text-[11px] font-medium text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded-full flex-shrink-0">
                  Public
                </span>
              </div>
              <p className="text-sm text-[#8b949e] mb-6 flex-1">
                {repo.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#8b949e]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                  {repo.language}
                </div>
                {repo.stars > 0 && (
                  <a href="#" className="flex items-center gap-1 hover:text-[#58a6ff]">
                    <Star size={14} /> {repo.stars}
                  </a>
                )}
                {repo.forks > 0 && (
                  <a href="#" className="flex items-center gap-1 hover:text-[#58a6ff]">
                    <GitBranch size={14} /> {repo.forks}
                  </a>
                )}
                <span>{repo.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
