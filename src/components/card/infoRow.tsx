import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';

type InfoRowProps = {
  title: string;
  subtitle: string | number;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  showColon?: boolean;
};

const InfoRow: React.FC<InfoRowProps> = ({ title, subtitle, style,titleStyle,subtitleStyle ,showColon = false,}) => {
  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.title,titleStyle]}>{title}</Text>
      {showColon && <Text style={styles.colon}>{': '}</Text>}
      <Text style={[styles.subtitle,subtitleStyle]}>{subtitle}</Text>
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
    width:"30%"
  },
  subtitle: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: "#1A1A1A",
  },
  colon: {
    marginHorizontal: 4,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
  },
});
