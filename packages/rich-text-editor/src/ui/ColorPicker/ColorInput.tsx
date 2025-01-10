import { Input } from 'antd';
import { useContext, useEffect, useState, type FC } from 'react';
import { ColorPickerContext } from './config';

const hexReg = /(^#[\da-f]{6}$)|(^#[\da-f]{8}$)/i;
const isHexString = (hex?: string) => hexReg.test(`#${hex}`);
const delHashtag = (hex: string) => hex.replace(/^#/, '');

const ColorInput: FC = () => {
  const { color, handleColorChange } = useContext(ColorPickerContext);
  const [hexValue, setHexValue] = useState(delHashtag(color));

  useEffect(() => {
    if (color) {
      setHexValue(delHashtag(color));
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
