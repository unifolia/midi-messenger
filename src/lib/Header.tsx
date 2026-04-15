import { useState } from "react";
import {
  handleLabelClick,
  handleLabelChange,
  handleLabelBlur,
  handleLabelKeyDown,
} from "../util/labelHandler";
import {
  FormClickable,
  FormTitleDisplay,
  FormTitleInput,
} from "../styles/components";

interface HeaderProps {
  name: string;
  setName: (name: string) => void;
}

const Header = ({ name, setName }: HeaderProps) => {
  const [isEditing, setIsEditing] = useState(true);

  return (
    <FormClickable>
      {isEditing ? (
        <FormTitleInput
          id="presetName"
          type="text"
          value={name}
          aria-label="Preset name"
          onChange={(e) => handleLabelChange(setName, e)}
          onBlur={() => handleLabelBlur(setIsEditing, name, setName)}
          onKeyDown={(e) => handleLabelKeyDown(setIsEditing, e)}
          className="header"
          autoFocus
        />
      ) : (
        <FormTitleDisplay
          as="h3"
          className="header"
          role="button"
          tabIndex={0}
          onClick={() => handleLabelClick(setIsEditing)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleLabelClick(setIsEditing);
            }
          }}
          aria-label={`${name} — click to rename`}
        >
          {name}
        </FormTitleDisplay>
      )}
    </FormClickable>
  );
};

export default Header;
