import styled, { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyles = createGlobalStyle`
  :root {
    line-height: 1.4;
    font-weight: 300;
    color-scheme: dark;
    color: ${theme.colors.textPrimary};

    --primary: ${theme.colors.primary};
    --primary-light: ${theme.colors.primaryLight};
    --primary-muted: ${theme.colors.primaryMuted};
    --surface-glass: ${theme.colors.surfaceGlass};
    --surface-glass-border: ${theme.colors.surfaceGlassBorder};
    --text-primary: ${theme.colors.textPrimary};
    --text-secondary: ${theme.colors.textSecondary};
    --danger: ${theme.colors.danger};

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background: ${theme.colors.background};
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 400px;
    min-height: 100vh;
    font-family: ${theme.fonts.family};
    overflow-x: hidden;
  }

  #app {
    max-width: 1280px;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    margin: 0 auto;
    padding: ${theme.spacing.xl};
    text-align: center;
    display: flex;
    flex-direction: column;
    @media (min-width: ${theme.breakpoints.big}) {
      max-width: 1400px;
    }
    @media (min-width: ${theme.breakpoints.huge}) {
      max-width: 1850px;
    }
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  footer {
    margin-top: auto;
  }

  a,
  a:visited {
    color: var(--primary-light);
  }

  #mothership {
    color: white;
    text-decoration: none;
  }
`;

export const Title = styled.h1`
  font-size: ${theme.fonts.sizes.h1};
  line-height: 1.1;
  color: var(--text-primary);
  text-transform: lowercase;
  font-weight: ${theme.fonts.weights.thin};
  letter-spacing: 0.05em;
  background: ${theme.gradients.textGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: ${theme.shadows.textGlow};
  margin: 0 0 ${theme.spacing.xl} 0;

  &::selection {
    background: ${theme.colors.primaryAlpha30};
    color: var(--text-primary);
    -webkit-text-fill-color: var(--text-primary);
  }
`;

export const BaseButton = styled.button`
  border-radius: ${theme.borderRadius.md};
  border: 1px solid var(--surface-glass-border);
  padding: 0.8rem 1.5rem;
  font-size: ${theme.fonts.sizes.body};
  font-weight: ${theme.fonts.weights.normal};
  font-family: inherit;
  color: var(--text-primary);
  cursor: pointer;
  transition: ${theme.transitions.default};
  text-transform: lowercase;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: ${theme.colors.surfaceInput};

  &:hover {
    border-color: var(--primary);
    background: ${theme.colors.primaryAlpha8};
    box-shadow: ${theme.shadows.button};
    color: var(--text-primary);
  }
`;

export const Label = styled.label`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;
