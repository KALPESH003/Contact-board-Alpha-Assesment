import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** A crash in one view shows a recoverable message instead of a blank page. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label}]`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="m-6 max-w-md rounded-md border border-line bg-hover p-4">
          <p className="text-sm font-medium">The {this.props.label} could not be displayed.</p>
          <p className="mt-1 text-sm text-muted">Your contacts are unchanged. Try again, or switch to the other view.</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="focus-ring mt-3 rounded-md border border-line bg-canvas px-3 py-1.5 text-sm hover:bg-hover"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
