// import type { HsbaColorType } from '@rc-component/color-picker';
import RcColorPicker from '@rc-component/color-picker';
import { useCallback, useContext, useState, type FC } from 'react';
import ColorInput from './ColorInput';
import { ColorPickerContext } from './config';

export interface PanelPickerProps {
  // value?: Color;
  // disabledAlpha?: boolean;
  // onChange?: (value?: Color, type?: HsbaColorType, pickColor?: boolean) => void;
  // onChangeComplete?: (value: Color) => void;
}

const PanelPicker: FC<PanelPickerProps> = () => {
  const { color, handleColorChange } = useContext(ColorPickerContext);
  // const [value, setValue] = useState(undefined);

  // const handleColorChange = useCallback(v => {
  //   console.log('handleColorChange:', v);
  // }, []);

  return (
    <>
      <RcColorPicker
        value={color}
        // disabledAlpha={disabledAlpha}
        onChange={colorValue => {
          handleColorChange(colorValue.toHexString());
        }}
      />
      {/* <ColorInput value={color} onChange={handleColorChange} /> */}
    </>
  );
};
export default PanelPicker;
