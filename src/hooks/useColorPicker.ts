import { useState, useRef, useCallback, useEffect } from "react";

const useColorPicker = () => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const closePicker = useCallback((e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setIsPickerOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isPickerOpen) {
      document.addEventListener("mousedown", closePicker);
      return () => document.removeEventListener("mousedown", closePicker);
    }
  }, [isPickerOpen, closePicker]);

  const togglePicker = useCallback(() => {
    setIsPickerOpen((prev) => !prev);
  }, []);

  return { isPickerOpen, pickerRef, togglePicker };
};

export default useColorPicker;
