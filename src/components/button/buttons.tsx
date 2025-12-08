import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors, { getColors } from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';

export interface IButtonProps {
  onPress?: any;
  title?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const Button: React.FC<IButtonProps> = props => {
  const {onPress, title = 'Submit', style, textStyle, disabled} = props;
  const colors = getColors();
  const styles = getStyles();
  const bgColor = disabled ? colors.background : colors.primary;
  const titleColor = disabled ? colors.primaryBlack : colors.white;
  return (
    <TouchableOpacity
      style={ [styles.container, { backgroundColor: bgColor, opacity: disabled ? 0.6 : 1 }, style] }
      onPress={ onPress }
      activeOpacity={ 0.8 }
      disabled={ disabled }>
      <Text style={ [styles.text,  { color: titleColor }, textStyle] }>{ title }</Text>
    </TouchableOpacity>
  );
};
export default Button;

const getStyles = () =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 24,
      paddingHorizontal: 15,
      borderRadius: 120,
      height: 54,
    },
    text: {
      fontFamily: fonts.medium,
      fontSize: 16,
      // color:colors.white,
      textAlign: 'center',
      lineHeight: 24,
    },
  });
