import React from 'react';
import { Download, FileText, Printer, ZoomIn, ZoomOut } from 'lucide-react';

export default function ResumeViewer() {
  const [pdfStatus, setPdfStatus] = React.useState<'loading' | 'exists' | 'missing'>('loading');

  React.useEffect(() => {
    fetch('/assets/resume.pdf', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setPdfStatus('exists');
        else setPdfStatus('missing');
      })
      .catch(() => setPdfStatus('missing'));
  }, []);

  const handleDownload = () => {
    if (pdfStatus === 'exists') {
      const a = document.createElement('a');
      a.href = '/assets/resume.pdf';
      a.download = 'Vansh-Bhura-Resume.pdf';
      a.click();
    }
  };

  if (pdfStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950 text-slate-400">
        Checking for resume...
      </div>
    );
  }

  if (pdfStatus === 'missing') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-300 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
          <FileText size={32} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-200">Resume not installed</h2>
        <p className="text-slate-400 max-w-md">
          The requested document could not be found. The expected location is <code className="text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">public/assets/resume.pdf</code>.
        </p>
        <p className="text-sm text-slate-500 mt-4">
          Please upload your PDF resume to this path to enable the document viewer.
        </p>
      </div>
    );
  }

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
            onClick={() => window.open('/assets/resume.pdf', '_blank')} 
            title="Open in New Tab"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-medium"
          >
            Open Externally
          </button>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

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
      <div className="flex-1 overflow-hidden bg-slate-800">
        <iframe
          src="/assets/resume.pdf#toolbar=0"
          title="Resume PDF"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}
