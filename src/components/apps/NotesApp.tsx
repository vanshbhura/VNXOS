import React, { useState, useEffect } from 'react';
import { Save, Trash2, FileText } from 'lucide-react';

const STORAGE_KEY = 'vnx_notes_content';

export default function NotesApp() {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const loaded = localStorage.getItem(STORAGE_KEY);
    if (loaded) {
      setContent(loaded);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, content);
    setSaved(true);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all notes?')) {
      setContent('');
      localStorage.removeItem(STORAGE_KEY);
      setSaved(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-slate-200 font-sans">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-black/40 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-300">
          <FileText size={16} className="text-yellow-400" />
          <span className="font-medium text-sm">Notes.txt</span>
          {!saved && <span className="w-2 h-2 rounded-full bg-yellow-400 ml-2 shadow-[0_0_8px_rgba(250,204,21,0.5)]" title="Unsaved changes" />}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              saved 
                ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
            }`}
          >
            <Save size={14} />
            Save (Ctrl+S)
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Type your notes here..."
        spellCheck={false}
        className="flex-1 w-full bg-transparent text-slate-300 p-6 resize-none outline-none leading-relaxed font-mono text-[13px] md:text-sm selection:bg-blue-500/30"
        style={{
          boxShadow: 'inset 0 4px 6px -4px rgba(0,0,0,0.2)'
        }}
      />
      
      {/* Status bar */}
      <div className="px-4 py-1.5 bg-[#252526] border-t border-black/30 text-[11px] text-slate-500 flex justify-between items-center flex-shrink-0">
        <span>{content.length} characters</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
