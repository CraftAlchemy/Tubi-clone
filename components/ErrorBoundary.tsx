// FIX: Import global type definitions to resolve errors with JSX intrinsic elements and incorrect 'this.props' type resolution.
import '../types';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Reverted to a standard constructor for state initialization to resolve `this.props` typing issues in some environments.
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
          return this.props.fallback;
      }
      return (
        <div className="p-8 m-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-300 text-center">
            <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
            <p>We're sorry, this part of the application failed to load. Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;