import React from "react";

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // keep a breadcrumb in console so we see what's wrong
    console.error("Dashboard crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card p-6">
          <h2 className="font-semibold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600">
            The dashboard failed to render. Check the console for details.
          </p>
          {this.state.message && (
            <p className="mt-2 text-xs text-slate-500 break-all">{this.state.message}</p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
