import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { theme } from "../styles/theme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: theme.spacing.lg,
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.family,
          }}
        >
          <h2
            style={{
              fontSize: theme.fonts.sizes.h2,
              fontWeight: theme.fonts.weights.light,
              margin: 0,
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.sizes.body,
              margin: 0,
            }}
          >
            An unexpected error occurred. Your MIDI devices are unaffected.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.surfaceGlassBorder}`,
              padding: "0.8rem 1.5rem",
              fontSize: theme.fonts.sizes.body,
              fontWeight: theme.fonts.weights.normal,
              fontFamily: "inherit",
              color: theme.colors.textPrimary,
              cursor: "pointer",
              background: theme.colors.surfaceInput,
              textTransform: "lowercase",
              letterSpacing: "0.02em",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
