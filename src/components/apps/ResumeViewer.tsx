import React from 'react';
import { Download, FileText, ZoomIn, ZoomOut, Maximize2, ExternalLink } from 'lucide-react';

// PDF is placed in the Vite public directory → served at root in both dev and production.
const RESUME_PDF_PATH = '/assets/profile/Vansh_Bhura_Resume.pdf';
const RESUME_FILENAME = 'Vansh-Bhura-Resume.pdf';

const ZOOM_LEVELS = [50, 75, 100, 125, 150, 175, 200];
const DEFAULT_ZOOM = 100;
// A4 at 96 dpi: 794 × 1123 px — used as baseline for manual zoom sizing
const A4_W = 794;
const A4_H = 1123;

export default function ResumeViewer() {
  const [zoom, setZoom] = React.useState<number>(DEFAULT_ZOOM);
  const [fitWidth, setFitWidth] = React.useState<boolean>(false);
  const [pdfStatus, setPdfStatus] = React.useState<'loading' | 'exists' | 'missing'>('loading');

  // Probe PDF once on mount — no fetch body, just HEAD.
  React.useEffect(() => {
    const controller = new AbortController();
    fetch(RESUME_PDF_PATH, { method: 'HEAD', signal: controller.signal })
      .then((res) => setPdfStatus(res.ok ? 'exists' : 'missing'))
      .catch(() => setPdfStatus('missing'));
    return () => controller.abort();
  }, []);

  const handleZoomIn = () => {
    setFitWidth(false);
    setZoom((z) => {
      const next = ZOOM_LEVELS.find((l) => l > z);
      return next ?? ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
    });
  };

  const handleZoomOut = () => {
    setFitWidth(false);
    setZoom((z) => {
      const prev = [...ZOOM_LEVELS].reverse().find((l) => l < z);
      return prev ?? ZOOM_LEVELS[0];
    });
  };

  const handleFitWidth = () => setFitWidth((prev) => !prev);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = RESUME_PDF_PATH;
    a.download = RESUME_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenExternal = () =>
    window.open(RESUME_PDF_PATH, '_blank', 'noopener,noreferrer');

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (pdfStatus === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#020617', color: 'rgba(148,163,184,0.6)', fontSize: 13, gap: 10 }}>
        <FileText size={18} />
        Loading resume…
      </div>
    );
  }

  // ── Missing ──────────────────────────────────────────────────────────────────
  if (pdfStatus === 'missing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#020617', color: 'rgba(148,163,184,0.8)', padding: 32, textAlign: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={32} style={{ color: '#f87171' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Resume not found</h2>
        <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)', maxWidth: 380, margin: 0 }}>
          Expected at{' '}
          <code style={{ color: '#f472b6', background: 'rgba(244,114,182,0.1)', padding: '1px 6px', borderRadius: 4 }}>
            public/assets/profile/Vansh_Bhura_Resume.pdf
          </code>
        </p>
      </div>
    );
  }

  // Append PDF viewer params via hash — suppresses browser's native toolbar (Chrome/Edge/Firefox).
  const pdfSrc = RESUME_PDF_PATH + '#toolbar=0&navpanes=0&scrollbar=1';

  // ── Viewer ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#020617', overflow: 'hidden', userSelect: 'none' }}>

      {/* ── Toolbar ───────────────────────────────────────────────────────────── */}
      <div style={{ height: 44, background: 'rgba(15,23,42,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 4, flexShrink: 0 }}>

        {/* File badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
          <FileText size={15} style={{ color: '#f87171', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(226,232,240,0.85)', whiteSpace: 'nowrap' }}>
            {RESUME_FILENAME}
          </span>
        </div>

        <Divider />

        {/* Zoom controls */}
        <TBtn onClick={handleZoomOut} title="Zoom Out" disabled={!fitWidth && zoom <= ZOOM_LEVELS[0]}>
          <ZoomOut size={14} />
        </TBtn>

        <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.8)', minWidth: 42, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
          {fitWidth ? 'Fit W' : zoom + '%'}
        </span>

        <TBtn onClick={handleZoomIn} title="Zoom In" disabled={!fitWidth && zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}>
          <ZoomIn size={14} />
        </TBtn>

        <TBtn onClick={handleFitWidth} title={fitWidth ? 'Manual Zoom' : 'Fit to Width'} active={fitWidth}>
          <Maximize2 size={13} />
          <span style={{ fontSize: 10, fontWeight: 500 }}>Fit W</span>
        </TBtn>

        <div style={{ flex: 1 }} />

        <Divider />

        {/* Open externally */}
        <TBtn onClick={handleOpenExternal} title="Open in New Browser Tab">
          <ExternalLink size={13} />
          <span style={{ fontSize: 11 }}>Open</span>
        </TBtn>

        {/* Download */}
        <button
          onClick={handleDownload}
          title="Download Resume PDF"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            background: 'rgba(139,92,246,0.85)',
            border: '1px solid rgba(139,92,246,0.5)',
            borderRadius: 6,
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Download size={13} />
          Download
        </button>
      </div>

      {/* ── PDF scroll area ────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#1e293b',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: fitWidth ? 0 : '16px',
        }}
      >
        <iframe
          src={pdfSrc}
          title="Resume PDF Viewer"
          style={{
            border: 'none',
            display: 'block',
            background: '#fff',
            // Fit-width: fill the container exactly.
            // Manual zoom: size relative to A4 baseline.
            width: fitWidth ? '100%' : Math.round(A4_W * zoom / 100) + 'px',
            height: fitWidth ? '100%' : Math.round(A4_H * zoom / 100) + 'px',
            minHeight: fitWidth ? '100%' : undefined,
            borderRadius: fitWidth ? 0 : 4,
            boxShadow: fitWidth ? 'none' : '0 4px 24px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    </div>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
  );
}

interface TBtnProps {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}

function TBtn({ onClick, title, disabled, active, children }: TBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 7px',
        background: active ? 'rgba(139,92,246,0.2)' : 'transparent',
        border: active ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
        borderRadius: 5,
        color: disabled
          ? 'rgba(148,163,184,0.25)'
          : active
          ? '#a78bfa'
          : 'rgba(148,163,184,0.8)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 11,
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}