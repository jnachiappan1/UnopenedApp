import { Appearance, useColorScheme } from 'react-native';

export type IColors = {
  primary: string;
  secondary: string;
  background: string;
  label: string;
  text: string;
  text2: string;
  text3: string;
  black: string;
  white: string;
  inputBackground: string;
  placeholder: string;
  border: string;
  title: string;
  icon: string;
  btnTitle: string;
  btnBg: string;
  lightGreen: string;
  green: string;
  lightOrange: string;
  orange: string;
  lightRed: string;
  red: string;
  lightPrimary: string;
  primaryTint: string;
  btnSecondary: string;
  notifications: string;
  limeGreen: string;
  lightPrimaryTint: string;
  primaryBlack: string;
  darkLabel: string;
  darkGray: string;
  bottomBorder: string;
  modalBackGround: string;
  gray: string;
  chineseSilver: string;
};

export const colorScheme = Appearance.getColorScheme();

const darkColors: IColors = {
  primary: '#31AD52',
  secondary: '#268740',
  background: '#F5F7F2',
  label: '#4D4D4D',
  text: '#474747',
  text2: '#333333',
  text3: '#666666',
  black: '#000000',
  white: '#ffffff',
  inputBackground: '#464D43',
  placeholder: '#7E7585',
  border: '#E0E0E0',
  title: '#332640',
  icon: '#826C99',
  btnTitle: '#0B1B22',
  btnBg: '#EBF3F7',
  lightGreen: 'rgba(26, 156, 47, 0.1)',
  green: '#1A9C2F',
  lightOrange: 'rgba(255, 138, 72, 0.06)',
  orange: '#FF8A48',
  lightRed: 'rgba(201, 19, 52, 0.08)',
  red: '#C91334',
  lightPrimary: '#C7AFDE',
  primaryTint: '#F1EBF7',
  btnSecondary: '#03577B',
  notifications: '#78649E',
  limeGreen: '#07CF33',
  lightPrimaryTint: '#F5F4F9',
  primaryBlack: '#0B0611',
  darkLabel: '#1A1A1A',
  darkGray: '#646464',
  bottomBorder: '#E3E1E5',
  modalBackGround: '#00000099',
  gray: '#777777',
  chineseSilver: '#cccccc',
};
const lightColors: IColors = {
  primary: '#31AD52',

  secondary: '#268740',
  background: '#F5F7F2',
  label: '#4D4D4D',
  text: '#474747',
  text2: '#333333',
  text3: '#666666',
  black: '#000000',
  white: '#ffffff',
  inputBackground: '#F3F3F3',
  placeholder: '#7E7585',
  border: '#E0E0E0',
  title: '#332640',
  icon: '#826C99',
  btnTitle: '#0B1B22',
  btnBg: '#EBF3F7',
  lightGreen: 'rgba(26, 156, 47, 0.1)',
  green: '#1A9C2F',
  lightOrange: 'rgba(255, 138, 72, 0.06)',
  orange: '#FF8A48',
  lightRed: 'rgba(201, 19, 52, 0.08)',
  red: '#C91334',
  lightPrimary: '#C7AFDE',
  primaryTint: '#F1EBF7',
  btnSecondary: '#03577B',
  notifications: '#78649E',
  limeGreen: '#07CF33',
  lightPrimaryTint: '#F5F4F9',
  primaryBlack: '#1A1C1E',
  darkLabel: '#1A1A1A',
  darkGray: '#646464',
  bottomBorder: '#E3E1E5',
  modalBackGround: '#00000099',
  gray: '#777777',
  chineseSilver: '#cccccc',
};

export const getColors = (): IColors => {
  const theme = useColorScheme();
  return theme === 'light' ? lightColors : darkColors;
};

export const colors = colorScheme === 'light' ? lightColors : darkColors;

export default colors;
