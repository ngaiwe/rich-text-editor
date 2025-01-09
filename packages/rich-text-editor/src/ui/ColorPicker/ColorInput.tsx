import { Input } from 'antd';
import { useContext, useEffect, useState, type FC } from 'react';
import { ColorPickerContext } from './config';

const hexReg = /(^#[\da-f]{6}$)|(^#[\da-f]{8}$)/i;
const isHexString = (hex?: string) => hexReg.test(`#${hex}`);

export interface ColorInputProps {
  // value?: Color;
  // disabledAlpha?: boolean;
  // onChange?: (value?: Color, type?: HsbaColorType, pickColor?: boolean) => void;
  // onChangeComplete?: (value: Color) => void;
  // value?: string;
  // onChange?: (v: string) => void;
}

const ColorInput: FC<ColorInputProps> = () => {
  const { color, handleColorChange } = useContext(ColorPickerContext);
  // 去除井号
  const [hexValue, setHexValue] = useState(color);

  useEffect(() => {
    if (color) {
      setHexValue(color);
    }
  }, [color]);

  return (
    <Input
      value={hexValue}
      prefix="#"
      onChange={e => {
        const originValue = e.target.value;
        setHexValue(originValue);
        if (isHexString(originValue)) {
          handleColorChange(originValue);
        }
      }}
      size="small"
    />
  );
};
export default ColorInput;
