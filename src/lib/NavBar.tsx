import {
  NavBar,
  NavButton,
  LoadButton,
  Input,
  GlobalChannelContainer,
  GlobalChannelLabel,
  GlobalChannelSelect,
} from "../styles/components";
import { Label } from "../styles/GlobalStyles";
import type { Layout } from "../types";

interface NavigationProps {
  handleAddCCInput: () => void;
  handleAddPCInput: () => void;
  savePreset: () => void;
  handleLoadPreset: (event: React.ChangeEvent<HTMLInputElement>) => void;
  globalMidiChannel: number | null;
  handleGlobalMidiChannelChange: (channel: number) => void;
  layout: Layout;
  onToggleLayout: () => void;
}

const Navigation = ({
  handleAddCCInput,
  handleAddPCInput,
  savePreset,
  handleLoadPreset,
  globalMidiChannel,
  handleGlobalMidiChannelChange,
  layout,
  onToggleLayout,
}: NavigationProps) => {
  return (
    <NavBar>
      <NavButton onClick={handleAddCCInput}>Add CC Input</NavButton>
      <NavButton onClick={handleAddPCInput}>Add PC Input</NavButton>
      <NavButton onClick={savePreset}>Save Preset</NavButton>
      <LoadButton>
        Upload Preset
        <Label htmlFor="upload">Upload Preset</Label>
        <Input
          id="upload"
          type="file"
          accept=".json"
          onChange={handleLoadPreset}
          value=""
        />
      </LoadButton>
      <GlobalChannelContainer>
        <GlobalChannelLabel htmlFor="global-select">
          Global Channel:
        </GlobalChannelLabel>
        <GlobalChannelSelect
          id="global-select"
          value={globalMidiChannel ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val) handleGlobalMidiChannelChange(Number(val));
          }}
        >
          <option value="">—</option>
          {Array.from({ length: 16 }, (_, i) => i + 1).map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </GlobalChannelSelect>
      </GlobalChannelContainer>
      <NavButton
        onClick={onToggleLayout}
        aria-pressed={layout === "row"}
        aria-label={`Layout: ${layout}. Click to toggle.`}
      >
        {layout === "tile" ? "Tile" : "Row"}
      </NavButton>
    </NavBar>
  );
};

export default Navigation;
