import styled from "styled-components";
import { theme } from "./theme";
import { BaseButton } from "./GlobalStyles";

// Navigation Components
export const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: var(--surface-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.nav};

  @media (max-width: 560px) {
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }
`;

export const NavButton = styled(BaseButton)`
  margin: 0;
  min-width: 120px;
`;

export const LoadButton = styled(NavButton)`
  position: relative;

  input {
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    cursor: pointer;
  }
`;

export const GlobalChannelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin: 0;
`;

// Form Components
export const FormsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};
  margin: ${theme.spacing.xl} 0;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: ${theme.breakpoints.big}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const MidiFormContainer = styled.div`
  box-sizing: border-box;
  background: var(--surface-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.glass};
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${theme.shadows.glassHover};
    border-color: ${theme.colors.primaryAlpha30};
  }
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid var(--surface-glass-border);
`;

export const FormHeaderContent = styled.div`
  flex: 1;
  margin-right: ${theme.spacing.md};
`;

export const FormTitleDisplay = styled.h3`
  margin: 0;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.fonts.sizes.form};
  font-weight: ${theme.fonts.weights.normal};
  color: var(--text-primary);
  text-transform: lowercase;
  letter-spacing: 0.02em;
  cursor: pointer;
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.default};
  background: ${theme.colors.surfaceSubtle};
  border: 1px solid transparent;
  box-sizing: border-box;
  text-align: center;

  &:hover {
    background: ${theme.colors.primaryAlpha5};
    border-color: var(--surface-glass-border);
    color: var(--primary);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  &.header {
    font-size: 1.8rem;
  }
`;

export const FormTitleInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.fonts.sizes.form};
  font-weight: ${theme.fonts.weights.normal};
  font-family: inherit;
  color: var(--text-primary);
  background: ${theme.colors.primaryAlpha8};
  border: 1px solid var(--primary);
  border-radius: ${theme.borderRadius.md};
  outline: none;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  backdrop-filter: blur(10px);
  text-align: center;

  &.header {
    font-size: 1.8rem;
  }
`;

export const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  position: relative;
  background: ${theme.colors.surfaceSubtle};
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: ${theme.transitions.default};
  backdrop-filter: blur(10px);

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 1.5px;
    background: var(--text-secondary);
    border-radius: 1px;
    transition: background ${theme.transitions.fast};
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  &:hover {
    background: ${theme.colors.dangerAlpha10};
    border-color: ${theme.colors.dangerAlpha30};

    &::before,
    &::after {
      background: var(--danger);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const FormClickable = styled.div`
  min-height: 65px;
  margin-top: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.md};
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const ColorPicker = styled(FormGroup)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${theme.spacing.lg};
  margin-bottom: 0;
  position: relative;
`;

export const ColorSwatch = styled.button`
  width: 45%;
  height: 40px;
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: ${theme.transitions.default};
  padding: 0;

  &:hover {
    border-color: var(--primary);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;

export const ColorPopover = styled.div`
  position: absolute;
  bottom: calc(100% + ${theme.spacing.sm});
  right: 0;
  z-index: 10;
  background: ${theme.colors.surfacePopover};
  backdrop-filter: blur(20px);
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.glass};

  .react-colorful {
    width: 200px;
    height: 160px;
  }

  .react-colorful__saturation {
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  }

  .react-colorful__hue {
    border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
  }

  .react-colorful__saturation-pointer,
  .react-colorful__hue-pointer {
    width: 16px;
    height: 16px;
  }
`;

export const FormLabel = styled.label`
  color: var(--text-secondary);
  font-size: ${theme.fonts.sizes.label};
  font-weight: ${theme.fonts.weights.normal};
  text-transform: lowercase;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &::before {
    content: "";
    width: 4px;
    height: 4px;
    background: var(--primary);
    border-radius: 50%;
    box-shadow: none;
  }
`;

export const Select = styled.select`
  -webkit-appearance: none;
  appearance: none;
  background-color: ${theme.colors.surfaceInput};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23e4e4e4' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.sm} center;
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.md};
  padding: 0.8rem ${theme.spacing.lg} 0.8rem ${theme.spacing.md};
  color: var(--text-primary);
  font-family: inherit;
  font-size: ${theme.fonts.sizes.body};
  backdrop-filter: blur(10px);
  transition: ${theme.transitions.default};
  cursor: pointer;

  &:hover {
    border-color: var(--primary);
    background-color: ${theme.colors.primaryAlpha5};
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    background-color: ${theme.colors.primaryAlpha8};
  }

  option {
    background: ${theme.colors.surfaceDark};
    color: var(--text-primary);
    padding: ${theme.spacing.xs};
  }
`;

export const RangeInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: ${theme.gradients.rangeTrack};
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  position: relative;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: ${theme.gradients.rangeThumb};
    border-radius: 50%;
    cursor: pointer;
    box-shadow: ${theme.shadows.rangeThumb};
    transition: ${theme.transitions.fast};

    &:hover {
      transform: scale(1.1);
      box-shadow: ${theme.shadows.rangeThumbHover};
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: ${theme.gradients.rangeThumb};
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: ${theme.shadows.rangeThumb};
    transition: ${theme.transitions.fast};

    &:hover {
      transform: scale(1.1);
      box-shadow: ${theme.shadows.rangeThumbHover};
    }
  }
`;

export const GlobalChannelLabel = styled(FormLabel)`
  margin: 0;
  font-size: ${theme.fonts.sizes.body};
  color: var(--text-primary);

  &::before {
    display: none;
  }
`;

export const GlobalChannelSelect = styled(Select)`
  min-width: 80px;
  margin: 0;
`;

export const SendButton = styled(BaseButton)`
  width: 50%;
  min-width: 100px;
  font-weight: ${theme.fonts.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: ${theme.spacing.md};
  align-self: center;

  &.sent {
    color: var(--primary);
    border-color: var(--primary);
    animation: send-pulse 400ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes send-pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 ${theme.colors.primaryAlpha30};
    }
    40% {
      transform: scale(1.06);
      box-shadow: 0 0 0 8px transparent;
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;

export const DeviceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.md};
`;

export const DeviceHeading = styled.h3`
  margin: 0;
`;

export const FooterText = styled.p`
  font-size: 1.25rem;
`;

export const Input = styled.input`
  cursor: pointer;
`;
