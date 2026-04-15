import { useEffect, useState, useCallback, memo } from "react";
import { HexColorPicker } from "react-colorful";
import {
  handleLabelClick,
  handleLabelChange,
  handleLabelBlur,
  handleLabelKeyDown,
} from "../util/labelHandler";
import useColorPicker from "../hooks/useColorPicker";
import type { MidiCCFormData } from "../types";
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
  RangeInput,
  ColorPicker,
  ColorSwatch,
  ColorPopover,
} from "../styles/components";

interface MidiCCFormProps {
  id: number;
  onRemove: (id: number) => void;
  updateCCFormField: (
    id: number,
    field: keyof MidiCCFormData,
    value: string | number,
  ) => void;
  midiChannel: number;
  midiCC: number;
  value: number;
  label: string;
  backgroundColor: string;
  sendCC: (channel: number, cc: number, value: number) => void;
  dragRef?: (el: HTMLElement | null) => void;
  onDragPointerDown?: (e: React.PointerEvent, id: number) => void;
  isDragging?: boolean;
}

const MidiCCForm = memo(
  ({
    id,
    onRemove,
    updateCCFormField,
    midiChannel,
    midiCC,
    value,
    label,
    backgroundColor,
    sendCC,
    dragRef,
    onDragPointerDown,
    isDragging,
  }: MidiCCFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { isPickerOpen, pickerRef, togglePicker } = useColorPicker();

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      updateCCFormField(id, "value", newValue);
      sendCC(midiChannel, midiCC, newValue);
    };

    useEffect(() => {
      sendCC(midiChannel, midiCC, value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendCC, midiChannel, midiCC]);

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
                  handleLabelChange((v) => updateCCFormField(id, "label", v), e)
                }
                onBlur={() =>
                  handleLabelBlur(setIsEditing, label, (v) =>
                    updateCCFormField(id, "label", v),
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
          <FormLabel htmlFor={`midi-channel-${id}`}>MIDI Channel:</FormLabel>
          <Select
            id={`midi-channel-${id}`}
            value={midiChannel}
            onChange={(e) =>
              updateCCFormField(id, "midiChannel", Number(e.target.value))
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
          <FormLabel htmlFor={`midi-cc-${id}`}>MIDI CC:</FormLabel>
          <Select
            id={`midi-cc-${id}`}
            value={midiCC}
            onChange={(e) =>
              updateCCFormField(id, "midiCC", Number(e.target.value))
            }
          >
            {Array.from({ length: 128 }, (_, i) => i).map((cc) => (
              <option key={cc} value={cc}>
                {cc}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor={`value-slider-${id}`}>Value: {value}</FormLabel>
          <RangeInput
            id={`value-slider-${id}`}
            type="range"
            min="0"
            max="127"
            value={value}
            onChange={handleValueChange}
            aria-valuetext={`${value} of 127`}
          />
        </FormGroup>

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
                  updateCCFormField(id, "backgroundColor", color)
                }
              />
            </ColorPopover>
          )}
        </ColorPicker>
      </MidiFormContainer>
    );
  },
);

export default MidiCCForm;
