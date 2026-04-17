export const theme = {
  colors: {
    primary: "#ff8d28",
    primaryLight: "#ff5a79",
    primaryMuted: "#ff6b9d",

    background: "#1a1a1a",
    surfaceDark: "#1a1a2e",
    surfaceGlass: "rgba(255, 255, 255, 0.05)",
    surfaceGlassBorder: "rgba(255, 255, 255, 0.15)",
    surfaceSubtle: "rgba(255, 255, 255, 0.02)",
    surfaceInput: "rgba(255, 255, 255, 0.03)",
    surfacePopover: "rgba(26, 26, 46, 0.95)",

    primaryAlpha5: "rgba(255, 40, 140, 0.05)",
    primaryAlpha8: "rgba(255, 40, 140, 0.08)",
    primaryAlpha20: "rgba(255, 40, 140, 0.2)",
    primaryAlpha30: "rgba(255, 40, 140, 0.3)",

    textPrimary: "#ffffff",
    textSecondary: "#e4e4e4",

    danger: "#ff4757",
    dangerAlpha10: "rgba(255, 71, 87, 0.1)",
    dangerAlpha30: "rgba(255, 71, 87, 0.3)",

    black: "#000000",
    insetHighlight: "rgba(255, 255, 255, 0.1)",
    insetHighlightStrong: "rgba(255, 255, 255, 0.15)",
  },
  gradients: {
    rangeTrack:
      "linear-gradient(90deg, rgba(255, 40, 140, 0.2), rgba(255, 90, 158, 0.2), rgba(255, 107, 157, 0.2))",
    rangeThumb: "linear-gradient(135deg, var(--primary), var(--primary-light))",
    textGradient:
      "linear-gradient(135deg, var(--primary), var(--primary-light), var(--primary-muted))",
  },
  fonts: {
    family:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    sizes: {
      h1: "3.2em",
      h2: "2rem",
      form: "1rem",
      body: "0.95rem",
      label: "0.9rem",
    },
    weights: {
      thin: "100",
      light: "300",
      normal: "400",
      medium: "500",
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  transitions: {
    default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  shadows: {
    glass:
      "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    glassHover:
      "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
    button: "0 8px 25px rgba(0, 0, 0, 0.3)",
    textGlow: "none",
    rangeThumb: "0 4px 8px rgba(0, 0, 0, 0.3)",
    rangeThumbHover: "0 6px 12px rgba(0, 0, 0, 0.4)",
    nav: "0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  breakpoints: {
    rowStack: "1100px",
    big: "1440px",
    huge: "1900px",
  },
} as const;

export type Theme = typeof theme;
