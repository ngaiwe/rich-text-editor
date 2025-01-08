// import type { HsbaColorType } from '@rc-component/color-picker';
import RcColorPicker from '@rc-component/color-picker';
import type { FC } from 'react';

export interface PanelPickerProps {
  // value?: Color;
  // disabledAlpha?: boolean;
  // onChange?: (value?: Color, type?: HsbaColorType, pickColor?: boolean) => void;
  // onChangeComplete?: (value: Color) => void;
}

const PanelPicker: FC<PanelPickerProps> = () => {
  return (
    <>
      <RcColorPicker
      // value={value?.toHsb()}
      // disabledAlpha={disabledAlpha}
      // onChange={(colorValue, type) => onChange?.(colorValue, type, true)}
      // onChangeComplete={onChangeComplete}
      />
    </>
  );
};
export default PanelPicker;
