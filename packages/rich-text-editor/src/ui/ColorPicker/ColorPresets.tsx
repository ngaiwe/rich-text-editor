import { useContext, type FC } from 'react';
import { classNameTag, ColorPickerContext } from './config';
import { addClassName } from '@/utils/className';

const ColorPresets: FC = () => {
  const { presets } = useContext(ColorPickerContext);

  return (
    <>
      {presets?.map((preset, index) => (
        <div key={index} className={addClassName([`${classNameTag}-presets`])}>
          {preset.label && (
            <span className={addClassName([`${classNameTag}-presets-label`])}>{preset.label}</span>
          )}
          <div className={addClassName([`${classNameTag}-presets-colors`])}>
            {preset.colors.map((color, colorIndex) => (
              <span
                key={colorIndex}
                className={addClassName([`${classNameTag}-presets-color`])}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
export default ColorPresets;
