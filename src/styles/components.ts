import styled, { css } from "styled-components";
import { HexColorInput } from "react-colorful";
import { theme } from "./theme";
import { BaseButton } from "./GlobalStyles";
import type { Layout } from "../types";

// Styling mixins for layout-dependent breakpoints. A card is "narrow-stacked"
// when it's rendering vertically in a single column: either tile mode at
// ≤narrow, or row mode at ≤rowStack. "Row-wide" means row mode at >rowStack.
const rowWide = (styles: ReturnType<typeof css>) => css`
  [data-layout="row"] & {
    @media (min-width: calc(${theme.breakpoints.rowStack} + 1px)) {
      ${styles}
    }
  }
`;

const rowWideSelf = (styles: ReturnType<typeof css>) => css`
  &[data-layout="row"] {
    @media (min-width: calc(${theme.breakpoints.rowStack} + 1px)) {
      ${styles}
    }
  }
`;

const narrowStacked = (styles: ReturnType<typeof css>) => css`
  @media (max-width: ${theme.breakpoints.narrow}) {
    ${styles}
  }

  [data-layout="row"] & {
    @media (max-width: ${theme.breakpoints.rowStack}) {
      ${styles}
    }
  }
`;

const narrowStackedSelf = (styles: ReturnType<typeof css>) => css`
  @media (max-width: ${theme.breakpoints.narrow}) {
    ${styles}
  }

  &[data-layout="row"] {
    @media (max-width: ${theme.breakpoints.rowStack}) {
      ${styles}
    }
  }
`;

const inlineSelectWide = css`
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.sm};

  select {
    flex: 0 0 auto;
    min-width: 0;
  }
`;

const inlineSelectNarrow = css`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: ${theme.spacing.sm};

  select {
    flex: 0 1 auto;
    min-width: 70px;
    max-width: 150px;
  }
`;

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

  @media (max-width: ${theme.breakpoints.rowStack}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${theme.breakpoints.narrow}) {
    display: flex;
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

export const LayoutButton = styled(NavButton)`
  @media (max-width: ${theme.breakpoints.narrow}) {
    display: none;
  }
`;

// Form Components
export const FormsContainer = styled.div<{ $layout?: Layout }>`
  ${({ $layout }) =>
    $layout === "row"
      ? css`
          display: flex;
          flex-direction: column;
          gap: 5px;

          @media (max-width: ${theme.breakpoints.rowStack}) {
            gap: ${theme.spacing.lg};
          }

          @media (min-width: ${theme.breakpoints.huge}) {
            flex-direction: row;
            flex-wrap: wrap;

            & > * {
              flex: 0 0 calc(50% - 2.5px);
              max-width: calc(50% - 2.5px);
            }
          }
        `
      : css`
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: ${theme.spacing.lg};

          @media (max-width: ${theme.breakpoints.narrow}) {
            grid-template-columns: 1fr;
          }

          @media (min-width: ${theme.breakpoints.big}) {
            grid-template-columns: repeat(4, 1fr);
          }
        `}
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

  ${rowWideSelf(css`
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  `)}

  ${narrowStackedSelf(css`
    padding: 0.5rem;
  `)}
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid var(--surface-glass-border);

  ${rowWide(css`
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
    flex: 0 0 auto;
    gap: ${theme.spacing.sm};
  `)}

  ${narrowStacked(css`
    margin-bottom: ${theme.spacing.md};
  `)}
`;

export const FormHeaderContent = styled.div`
  flex: 1;
  margin-right: ${theme.spacing.md};

  ${rowWide(css`
    flex: 0 0 auto;
    margin-right: 0;
  `)}
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

  ${rowWide(css`
    width: 250px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: ${theme.breakpoints.huge}) {
      width: 150px;
    }
  `)}
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

  ${rowWide(css`
    width: 250px;

    @media (min-width: ${theme.breakpoints.huge}) {
      width: 150px;
    }
  `)}
`;

// Rendered twice per card — once inside FormHeader (data-placement="header")
// for tile mode / narrow-stacked, once at the card end (data-placement="end")
// for row-wide. CSS toggles display: none so only one is visible at a time,
// keeping the hidden duplicate out of the accessibility tree.
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

  &[data-placement="end"] {
    display: none;
  }

  ${rowWide(css`
    &[data-placement="end"] {
      display: inline-block;
      width: 26px;
      height: 26px;
      min-width: 26px;

      &::before,
      &::after {
        width: 12px;
      }
    }

    &[data-placement="header"] {
      display: none;
    }
  `)}
`;

export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  ${rowWide(css`
    margin-bottom: 0;
    flex: 1 1 0;
    min-width: 0;
  `)}

  ${narrowStacked(css`
    margin-bottom: 0;
  `)}

  [data-layout="row"] &:has(input[type="range"]) {
    @media (min-width: calc(${theme.breakpoints.rowStack} + 1px)) {
      min-width: 150px;
    }
  }

  [data-layout="row"] &:has(select) {
    @media (min-width: calc(${theme.breakpoints.rowStack} + 1px)) {
      ${inlineSelectWide}
    }

    @media (max-width: ${theme.breakpoints.rowStack}) {
      ${inlineSelectNarrow}
    }
  }

  &:has(select) {
    @media (max-width: ${theme.breakpoints.narrow}) {
      ${inlineSelectNarrow}
    }
  }
`;

export const FormClickable = styled.div`
  margin-top: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

export const ColorPicker = styled(FormGroup)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${theme.spacing.lg};
  margin-bottom: 0;
  position: relative;

  ${rowWide(css`
    margin-top: 0;
    padding-top: 0;
    margin-left: auto;
    flex: 0 0 auto;
    gap: ${theme.spacing.sm};
  `)}
`;

export const ColorSwatch = styled.button`
  width: 45%;
  height: 40px;
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  padding: 0;

  &:hover {
    border-color: var(--primary);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  ${rowWide(css`
    width: 36px;
    height: 26px;
  `)}

  ${narrowStacked(css`
    height: 28px;
  `)}
`;

export const ColorPopover = styled.div`
  position: absolute;
  bottom: calc(100% + ${theme.spacing.sm});
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  background: ${theme.colors.background};
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

export const HexInput = styled(HexColorInput)`
  width: 200px;
  box-sizing: border-box;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-family: inherit;
  font-size: ${theme.fonts.sizes.label};
  letter-spacing: 0.04em;
  text-align: center;
  text-transform: uppercase;
  color: var(--text-primary);
  background: ${theme.colors.surfaceInput};
  border: 1px solid var(--surface-glass-border);
  border-radius: ${theme.borderRadius.md};
  outline: none;
  transition: ${theme.transitions.default};

  &:hover {
    border-color: var(--primary);
  }

  &:focus {
    border-color: var(--primary);
    background: ${theme.colors.primaryAlpha8};
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

  ${rowWide(css`
    padding: 0.35rem ${theme.spacing.lg} 0.35rem ${theme.spacing.sm};
    font-size: ${theme.fonts.sizes.label};
    max-width: 65px;
  `)}

  ${narrowStacked(css`
    padding: 0.35rem ${theme.spacing.lg} 0.35rem ${theme.spacing.md};
  `)}
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

  ${rowWide(css`
    margin-top: 0;
    width: auto;
    flex: 0 0 auto;
    padding: 0.35rem ${theme.spacing.md};
    font-size: ${theme.fonts.sizes.label};
    min-width: auto;
  `)}

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

export const DeviceHeading = styled.h2`
  margin: 0;
`;

export const FooterText = styled.p`
  font-size: 1.25rem;
`;

export const Input = styled.input`
  cursor: pointer;
`;

export const SelectRow = styled.div`
  display: contents;

  ${narrowStacked(css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: ${theme.spacing.md};

    & > * {
      flex: 0 1 auto;
      min-width: 0;
    }
  `)}
`;
