export interface MidiCCFormData {
  id: number;
  midiChannel: number;
  midiCC: number;
  value: number;
  label: string;
  backgroundColor: string;
}

export interface MidiPCFormData {
  id: number;
  midiChannel: number;
  program: number;
  label: string;
  backgroundColor: string;
}

export type Layout = "tile" | "row";
