import React, { ReactNode } from 'react';

export const classNameTag = 'ui-tool-color-picker';
export const dropDownPadding = 4;

export type PresetsType = Array<{
  label?: ReactNode;
  colors: string[];
}>;

type ColorPickerContextType = {
  color: string;
  presets?: PresetsType;
  handleColorChange: (color: string) => void;
};
export const ColorPickerContext = React.createContext<ColorPickerContextType>({
  color: '',
  handleColorChange: () => {},
});
