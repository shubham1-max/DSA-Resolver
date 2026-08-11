import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UI Error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-page" role="alert" aria-live="assertive">
          <div className="error-boundary-inner">
            <span className="error-boundary-code" aria-hidden="true">!</span>
            <h1>Something went wrong</h1>
            <p>An unexpected error occurred. Try refreshing the page.</p>
            <button
              className="primary"
              type="button"
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
            >
              Back to safety
            </button>
            {this.state.error && (
              <details className="error-boundary-details">
                <summary>Error details</summary>
                <pre>{this.state.error.message}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
