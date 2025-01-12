import React from 'react';

export const classNameTag = 'ui-tool-drop-down';
export const dropDownPadding = 4;

type DropDownContextType = {
  activeValue: string | number;
  dropDwonChange?: (value: string | number) => void;
};

export const DropDownContext = React.createContext<DropDownContextType | null>(null);
