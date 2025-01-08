import React from 'react';

export const classNameTag = 'ui-tool-color-picker';
export const dropDownPadding = 4;

type ColorPickerContextType = {
  // activeValue: string | number;
  // dropDwonChange?: (value: string | number) => void;
};
export const ColorPickerContext = React.createContext<ColorPickerContextType | null>(null);
