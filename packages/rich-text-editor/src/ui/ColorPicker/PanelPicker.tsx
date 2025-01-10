// import type { HsbaColorType } from '@rc-component/color-picker';
import RcColorPicker from '@rc-component/color-picker';
import { useContext, type FC } from 'react';
import { ColorPickerContext } from './config';

export interface PanelPickerProps {
  // value?: Color;
  // disabledAlpha?: boolean;
  // onChange?: (value?: Color, type?: HsbaColorType, pickColor?: boolean) => void;
  // onChangeComplete?: (value: Color) => void;
}

const PanelPicker: FC<PanelPickerProps> = () => {
  const { color, handleColorChange } = useContext(ColorPickerContext);

  return (
    <>
      <RcColorPicker
        value={color}
        // disabledAlpha={disabledAlpha}
        onChange={colorValue => {
          handleColorChange(colorValue.toHexString());
        }}
      />
    </>
  );
};
export default PanelPicker;
