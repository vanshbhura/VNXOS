import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[VNX.OS ErrorBoundary] ${this.props.label ?? "Component"} crashed:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "rgba(15, 5, 5, 0.95)",
            color: "#f87171",
            padding: 24,
            gap: 12,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32 }}>&#x26A0;&#xFE0F;</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fca5a5" }}>
            {this.props.label ?? "Application"} encountered an error
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(248,113,113,0.6)",
              fontFamily: "monospace",
              maxWidth: 400,
              wordBreak: "break-all",
            }}
          >
            {this.state.error?.message}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 8,
              padding: "6px 16px",
              borderRadius: 6,
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
