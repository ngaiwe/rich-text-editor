import React from 'react';

export const classNameTag = 'ui-tool-color-picker';
export const dropDownPadding = 4;

type ColorPickerContextType = {
  color: string;
  handleColorChange: (color: string) => void;
};
export const ColorPickerContext = React.createContext<ColorPickerContextType | null>(null);
