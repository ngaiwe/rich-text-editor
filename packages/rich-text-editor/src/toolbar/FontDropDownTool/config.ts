import {
  DEFAULT_FONT_LINE_HEIGHT,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_SPACING,
} from '../../config/DefaultStyleConfig';
import fontSizeIcon from '../../icons/font-size.svg';
import fontSpacingIcon from '../../icons/letter-spacing.svg';
import fontLineHeightIcon from '../../icons/line-height.svg';

const FONT_SIZE = 'fontSize';
const FONT_SPACING = 'fontSpacing';
const FONT_LINE_HEIGHT = 'fontLineHeight';

export type FontDropDowType = typeof FONT_SIZE | typeof FONT_SPACING | typeof FONT_LINE_HEIGHT;

export const HeadingDisabledSizeMap = [FONT_SIZE];

const FontSizeOptions = Array(21)
  .fill({})
  .map((_, index) => {
    const initialPx = 10;

    const value = `${initialPx + index}px`;

    return {
      label: value,
      value,
    };
  });

const FontSpacingOptions = Array(11)
  .fill({})
  .map((_, index) => {
    const value = `${index}px`;

    return {
      label: value,
      value,
    };
  });

const FontLineHeightOptions = Array(21)
  .fill({})
  .map((_, index) => {
    const initialPx = 10;

    const value = `${initialPx + index}px`;

    return {
      label: value,
      value,
    };
  });

export const FontDropDownMap = {
  fontSize: {
    options: FontSizeOptions,
    defaultValue: DEFAULT_FONT_SIZE,
    styleKey: 'font-size',
    icon: fontSizeIcon,
  },
  fontSpacing: {
    options: FontSpacingOptions,
    defaultValue: DEFAULT_FONT_SPACING,
    styleKey: 'letter-spacing',
    icon: fontSpacingIcon,
  },
  fontLineHeight: {
    options: FontLineHeightOptions,
    defaultValue: DEFAULT_FONT_LINE_HEIGHT,
    styleKey: 'line-height',
    icon: fontLineHeightIcon,
  },
};
