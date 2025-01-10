import { forwardRef } from 'react';
import PanelPicker from './PanelPicker';
import { addClassName } from '@/utils/className';
import { classNameTag } from './config';
import ColorInput from './ColorInput';
import ColorPresets from './ColorPresets';

interface ColorPickerPanelRef extends HTMLDivElement {}
interface ColorPickerPanelProps {
  children?: React.ReactNode;
}

const ColorPickerPanel = forwardRef<ColorPickerPanelRef, ColorPickerPanelProps>((props, ref) => {
  return (
    <div ref={ref} className={addClassName([`${classNameTag}-panel`])}>
      <div>推荐颜色</div>
      <ColorPresets />
      <div>最近使用</div>
      <div>更多颜色</div>
      <PanelPicker />
      <ColorInput />
    </div>
  );
});
ColorPickerPanel.displayName = 'ColorPickerPanel';

export default ColorPickerPanel;
