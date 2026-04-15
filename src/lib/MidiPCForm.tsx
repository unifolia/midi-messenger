import { useState, useCallback, useRef, memo } from "react";
import { HexColorPicker } from "react-colorful";
import {
  MidiFormContainer,
  FormHeader,
  FormHeaderContent,
  FormTitleDisplay,
  FormTitleInput,
  RemoveButton,
  FormGroup,
  FormLabel,
  Select,
  SendButton,
  ColorPicker,
  ColorSwatch,
  ColorPopover,
} from "../styles/components";
import {
  handleLabelClick,
  handleLabelChange,
  handleLabelBlur,
  handleLabelKeyDown,
} from "../util/labelHandler";
import useColorPicker from "../hooks/useColorPicker";
import type { MidiPCFormData } from "../types";

interface MidiPCFormProps {
  id: number;
  onRemove: (id: number) => void;
  updatePCFormField: (
    id: number,
    field: keyof MidiPCFormData,
    value: string | number,
  ) => void;
  midiChannel: number;
  program: number;
  label: string;
  backgroundColor: string;
  sendPC: (channel: number, program: number) => void;
  dragRef?: (el: HTMLElement | null) => void;
  onDragPointerDown?: (e: React.PointerEvent, id: number) => void;
  isDragging?: boolean;
}

const MidiPCForm = memo(
  ({
    id,
    onRemove,
    updatePCFormField,
    midiChannel,
    program,
    label,
    backgroundColor,
    sendPC,
    dragRef,
    onDragPointerDown,
    isDragging,
  }: MidiPCFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [sent, setSent] = useState(false);
    const sentTimer = useRef<ReturnType<typeof setTimeout>>();
    const { isPickerOpen, pickerRef, togglePicker } = useColorPicker();

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        onDragPointerDown?.(e, id);
      },
      [onDragPointerDown, id],
    );

    return (
      <MidiFormContainer
        ref={dragRef}
        onPointerDown={handlePointerDown}
        style={{
          background: backgroundColor + "55",
          ...(isDragging && { opacity: 0 }),
          cursor: "grab",
          touchAction: "none",
        }}
        role="group"
        aria-label={label}
      >
        <FormHeader>
          <FormHeaderContent>
            {isEditing ? (
              <FormTitleInput
                type="text"
                value={label}
                aria-label="Control block name"
                onChange={(e) =>
                  handleLabelChange((v) => updatePCFormField(id, "label", v), e)
                }
                onBlur={() =>
                  handleLabelBlur(setIsEditing, label, (v) =>
                    updatePCFormField(id, "label", v),
                  )
                }
                onKeyDown={(e) => handleLabelKeyDown(setIsEditing, e)}
                autoFocus
              />
            ) : (
              <FormTitleDisplay
                role="button"
                tabIndex={0}
                onClick={() => handleLabelClick(setIsEditing)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleLabelClick(setIsEditing);
                  }
                }}
                aria-label={`${label} — click to rename`}
              >
                {label}
              </FormTitleDisplay>
            )}
          </FormHeaderContent>
          <RemoveButton
            onClick={() => onRemove(id)}
            aria-label={`Remove ${label}`}
          />
        </FormHeader>

        <FormGroup>
          <FormLabel htmlFor={`pc-midi-channel-${id}`}>MIDI Channel:</FormLabel>
          <Select
            id={`pc-midi-channel-${id}`}
            value={midiChannel}
            onChange={(e) =>
              updatePCFormField(id, "midiChannel", Number(e.target.value))
            }
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor={`pc-program-${id}`}>Program:</FormLabel>
          <Select
            id={`pc-program-${id}`}
            value={program}
            onChange={(e) =>
              updatePCFormField(id, "program", Number(e.target.value))
            }
          >
            {Array.from({ length: 128 }, (_, i) => i).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FormGroup>

        <SendButton
          type="button"
          className={sent ? "sent" : ""}
          onClick={() => {
            sendPC(midiChannel, program);
            clearTimeout(sentTimer.current);
            setSent(true);
            sentTimer.current = setTimeout(() => setSent(false), 400);
          }}
        >
          Send
        </SendButton>

        <ColorPicker ref={pickerRef}>
          <FormLabel>Background:</FormLabel>
          <ColorSwatch
            type="button"
            style={{ background: backgroundColor }}
            onClick={togglePicker}
            aria-label="Choose background color"
          />
          {isPickerOpen && (
            <ColorPopover>
              <HexColorPicker
                color={backgroundColor}
                onChange={(color) =>
                  updatePCFormField(id, "backgroundColor", color)
                }
              />
            </ColorPopover>
          )}
        </ColorPicker>
      </MidiFormContainer>
    );
  },
);

export default MidiPCForm;
