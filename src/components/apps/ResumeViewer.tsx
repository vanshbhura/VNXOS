import React from 'react';
import { Download, FileText, Printer, ZoomIn, ZoomOut } from 'lucide-react';

export default function ResumeViewer() {
  const [zoom, setZoom] = React.useState<number>(100);

  const handleDownload = () => {
    // Create a text file download as fallback representation of resume
    const resumeText = `VANSH BHURA
Full-Stack Software Engineer & AI Systems Developer
Email: vanshbhura@example.com | GitHub: github.com/vanshbhura | LinkedIn: linkedin.com/in/vanshbhura

SUMMARY
Passionate software engineer specialized in building scalable web architectures, AI/LLM applications, and responsive desktop interfaces.

EXPERIENCE
Software Engineer | Enterprise AI Knowledge Hub (2024 - Present)
- Architected enterprise knowledge graph retrieval system using vector databases and RAG pipelines.
- Implemented real-time interactive dashboards with React, TypeScript, and TailwindCSS.

Full-Stack Developer | Play2Pro (2023 - 2024)
- Designed esports tournament management web platform serving thousands of active competitors.
- Built low-latency state synchronization with WebSockets and Node.js.

SKILLS
- Languages: TypeScript, JavaScript, Python, Go, SQL, HTML/CSS
- Frontend: React, Next.js, Framer Motion, Tailwind CSS, Zustand
- Backend: Node.js, Express, FastAPI, PostgreSQL, Redis, MongoDB
- AI/ML: PyTorch, LangChain, OpenAI APIs, Vector Search, HuggingFace
- DevOps: Docker, Git, CI/CD, Linux / Bash, AWS

PROJECTS
1. Enterprise-AI-Knowledge-Hub: Distributed knowledge base and semantic search engine.
2. Play2Pro: Esports tournament platform with real-time match brackets.
3. AI-Agents Autonomous Task Engine: Multi-agent system orchestration platform.
4. VNX.OS: Portfolio Operating System in React & TypeScript.

EDUCATION
B.Tech in Computer Science & Engineering
`;
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vansh-Bhura-Resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-hidden text-sm">
      {/* Viewer toolbar */}
      <div className="h-11 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-red-400" />
          <span className="font-medium text-xs text-slate-300">Vansh-Bhura-Resume.pdf</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(z => Math.max(70, z - 10))} 
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-xs text-slate-400 font-mono min-w-[40px] text-center">{zoom}%</span>
          <button 
            onClick={() => setZoom(z => Math.min(150, z + 10))} 
            title="Zoom In"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <ZoomIn size={15} />
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          <button 
            onClick={() => window.print()} 
            title="Print"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <Printer size={15} />
          </button>
          <button 
            onClick={handleDownload} 
            title="Download Resume"
            className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition-colors ml-1"
          >
            <Download size={13} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* PDF Document Canvas / Preview */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex justify-center bg-black/40">
        <div 
          className="bg-white text-slate-900 rounded-sm shadow-2xl p-10 max-w-2xl w-full min-h-[900px] select-text transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">VANSH BHURA</h1>
            <p className="text-sm font-semibold text-purple-700 mt-1 uppercase tracking-wider">
              Full-Stack Software Engineer & AI Systems Developer
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2 font-mono">
              <span>vanshbhura@example.com</span>
              <span>•</span>
              <span>github.com/vanshbhura</span>
              <span>•</span>
              <span>linkedin.com/in/vanshbhura</span>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Passionate software engineer specialized in building scalable full-stack web applications, AI orchestration systems, and interactive desktop environments. Strong focus on clean architecture, performance optimization, and elegant user interfaces.
            </p>
          </div>

          {/* Experience */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Work Experience
            </h2>
            <div className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900">Software Engineer</span>
                <span className="text-[11px] text-slate-500 font-mono">2024 — Present</span>
              </div>
              <div className="text-xs text-purple-700 font-medium">Enterprise AI Knowledge Hub</div>
              <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-0.5">
                <li>Engineered high-throughput RAG search pipelines with vector embeddings and hybrid reranking.</li>
                <li>Designed real-time collaborative workspace interface using React and TailwindCSS.</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900">Full-Stack Developer</span>
                <span className="text-[11px] text-slate-500 font-mono">2023 — 2024</span>
              </div>
              <div className="text-xs text-purple-700 font-medium">Play2Pro Esports Platform</div>
              <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-0.5">
                <li>Developed automated tournament bracket matchmaking engine with WebSocket live updates.</li>
                <li>Reduced API response latencies by 45% through Redis caching and query indexing.</li>
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Featured Projects
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-bold text-slate-900">VNX.OS</span>
                <span className="text-xs text-slate-600"> — Web desktop operating system with virtual filesystem and window manager.</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900">AI-Agents Orchestrator</span>
                <span className="text-xs text-slate-600"> — Multi-agent coordination runtime with tool execution safety guards.</span>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Technical Skills
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <div><strong className="text-slate-900">Languages:</strong> TypeScript, JavaScript, Python, Go, SQL</div>
              <div><strong className="text-slate-900">Frontend:</strong> React, Next.js, Framer Motion, Tailwind CSS</div>
              <div><strong className="text-slate-900">Backend:</strong> Node.js, Express, FastAPI, PostgreSQL, Redis</div>
              <div><strong className="text-slate-900">Tools:</strong> Docker, Git, Linux, AWS, Vector DBs</div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              Education & Certifications
            </h2>
            <div className="flex justify-between items-baseline text-xs">
              <div>
                <span className="font-bold text-slate-900">B.Tech in Computer Science and Engineering</span>
                <div className="text-slate-600">First Class with Distinction</div>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">2020 — 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
