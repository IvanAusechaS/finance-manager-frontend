import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          padding: "1rem"
        }}>
          <div style={{
            maxWidth: "32rem",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "2rem"
          }}>
            <div style={{ textAlign: "center" }}>
              <h1 style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#dc2626",
                marginBottom: "1rem"
              }}>
                Oops! Something went wrong
              </h1>
              <p style={{
                color: "#6b7280",
                marginBottom: "1.5rem"
              }}>
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              
              {this.state.error && (
                <div style={{
                  textAlign: "left",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  marginBottom: "1.5rem"
                }}>
                  <h2 style={{
                    fontWeight: 600,
                    color: "#991b1b",
                    marginBottom: "0.5rem"
                  }}>
                    Error Details:
                  </h2>
                  <p style={{
                    fontSize: "0.875rem",
                    color: "#b91c1c",
                    fontFamily: "monospace"
                  }}>
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <button
                onClick={() => globalThis.location.reload()}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  fontWeight: 600,
                  padding: "0.5rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                onFocus={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                onBlur={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
