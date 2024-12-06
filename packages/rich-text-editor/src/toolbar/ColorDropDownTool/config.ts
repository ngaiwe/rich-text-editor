import {
  DEFAULT_FONT_BD_COLOR,
  DEFAULT_FONT_COLOR,
} from '../../config/DefaultStyleConfig'

export type ColorDropDownType = 'fontColor' | 'fontBdColor'

export const ColorDropDownMap = {
  fontColor: {
    defaultColor: DEFAULT_FONT_COLOR,
    disabledAlpha: true,
    allowClear: false,
    styleKey: 'color',
  },
  fontBdColor: {
    defaultColor: DEFAULT_FONT_BD_COLOR,
    disabledAlpha: false,
    allowClear: true,
    styleKey: 'background-color',
  },
}

const RecommendedRow01 = [
  '#66001B',
  '#662200',
  '#663D00',
  '#014015',
  '#004961',
  '#001A66',
  '#000052',
  '#310066',
  '#000000',
  '#D5D8DD',
]

const RecommendedRow02 = [
  '#B30024',
  '#B34700',
  '#B37700',
  '#0B8C2B',
  '#008EAD',
  '#0039B3',
  '#000B9E',
  '#6200B3',
  '#121416',
  '#E6E8EA',
]

const RecommendedRow03 = [
  '#D90024',
  '#D95E00',
  '#D99900',
  '#17B339',
  '#00B4D4',
  '#004CD9',
  '#0619C4',
  '#7E00D9',
  '#2E3238',
  '#EEF0F2',
]

const RecommendedRow04 = [
  '#FF0022',
  '#FF7700',
  '#FEBC00',
  '#27D846',
  '#06DCF9',
  '#0062FF',
  '#1330EA',
  '#9D00FF',
  '#505762',
  '#F3F5F6',
]

const RecommendedRow05 = [
  '#FFA3A3',
  '#FFDAA3',
  '#FFF3A3',
  '#D1FFD3',
  '#B8FFFE',
  '#A3D3FF',
  '#B8CBFF',
  '#E8A3FF',
  '#818997',
  '#F9FAFB',
]

const RecommendedRow06 = [
  '#FFE6E6',
  '#FFF6E6',
  '#FFFCE6',
  '#F0FFF0',
  '#E6FFFE',
  '#F0F8FF',
  '#F0F4FF',
  '#F9E6FF',
  '#B0B6BF',
  '#FFFFFF',
]

export const RecommendedColor = RecommendedRow01.concat(
  RecommendedRow02,
  RecommendedRow03,
  RecommendedRow04,
  RecommendedRow05,
  RecommendedRow06
)
