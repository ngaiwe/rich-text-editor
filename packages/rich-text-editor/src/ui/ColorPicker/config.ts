import React from 'react';

export const classNameTag = 'ui-tool-color-picker';

type ColorPickerContextType = {
  // activeValue: string | number;
  // dropDwonChange?: (value: string | number) => void;
};
export const ColorPickerContext = React.createContext<ColorPickerContextType | null>(null);
