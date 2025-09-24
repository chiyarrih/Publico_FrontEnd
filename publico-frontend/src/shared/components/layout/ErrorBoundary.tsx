import React from "react";

type S = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, S> {
  state: S = { hasError: false };
  static getDerivedStateFromError(error: Error): S { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error("ErrorBoundary:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="m-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Something went wrong: {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}
