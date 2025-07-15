import { Dimensions, Platform } from 'react-native';

export const { height, width } = Dimensions.get('window');

export const OS = Platform.OS;

export const windowWidth = Dimensions.get('window').width;

export const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
export const strongRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
);
export const numbers = new RegExp(/^[0-9]+$/);
export const mobileNumber = /^[0-9]{10}$/;
export const whiteSpaceRegex = /^[^\s]+$/;
export const alphabets = new RegExp('^[A-Za-z .]*$');
export const alphabetsOnlyRegex = /^[A-Za-z]+$/;
export const decimalRegex = /^\d+(\.\d+)?$/;
// export const experienceRegex = /^(?=.*\d)(?:[7-9]\d*|[1-9]\d{2,}|6[0-9]*)$/;
export const experienceRegex = /\b(?:[6-9]\d*|[1-9]\d+\.\d+|[1-9][0-9]+)\b/;
export const SKELETON_SPEED = 1500;
export const SKELETON_BG = '#dddddd';
export const SKELETON_HIGHLIGHT = '#e7e7e7';
export const MAX_RATING_DEVIATION = 200;
export const currency = 'FCFA ';
export const fontSizes = {
  xTiny: 8,
  tiny: 10,
  small: 12,
  regularSmall: 13,
  regular: 14,
  slightlyLarge: 15,
  medium: 16,
  mediumL: 17,
  large: 18,
  extraLarge: 20,
  regularHuge:22,
  huge: 24,
  hugeL: 25,
  hugeXL: 27,
  extraHuge: 28,
  sGigantic: 30,
  mGigantic: 32,
  slightlySmall: 13,
};