import type React from "react";

export const handleLabelClick = (setIsEditing: (editing: boolean) => void) => {
  setIsEditing(true);
};

export const handleLabelChange = (
  setLabel: (label: string) => void,
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  setLabel(e.target.value);
};

export const handleLabelBlur = (
  setIsEditing: (editing: boolean) => void,
  name: string | number,
  setName: (name: string) => void,
) => {
  if (name) {
    setIsEditing(false);
  } else {
    setName("Untitled");
    setIsEditing(false);
  }
};

export const handleLabelKeyDown = (
  setIsEditing: (editing: boolean) => void,
  e: React.KeyboardEvent,
) => {
  if (e.key === "Enter" || e.key === "Escape") {
    setIsEditing(false);
  }
};
