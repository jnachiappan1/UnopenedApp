// components/DashboardCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconsSvg, { IconName } from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';

interface DashboardAnalyticsCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
}

const DashboardAnalyticsCard: React.FC<DashboardAnalyticsCardProps> = ({ title, subtitle, icon }) => {
 
  const isAmount = subtitle === 'Wallet Balance';
  const hasDecimal = subtitle === 'Wallet Balance' ;

  const formatTitle = (titleStr: string): string => {
    const numericValue = parseFloat(titleStr.replace(/[^0-9.-]/g, ''));
    if (isNaN(numericValue)) return titleStr; 
    return hasDecimal ? numericValue.toFixed(2) : String(Math.round(numericValue));
  };

  const formattedTitle = formatTitle(title);
  const displayTitle = isAmount ? `$${formattedTitle}` : formattedTitle;
  const isSingleDigit = displayTitle.length === 1;

  return (
    <View style={styles.card}>
      <View style={[styles.left, isSingleDigit && styles.centered]}>
        <Text style={[styles.title, isSingleDigit && styles.centeredText]}>{displayTitle}</Text>
        <Text style={[styles.subtitle, isSingleDigit && styles.centeredText]}>{subtitle}</Text>
      </View>
      <View style={styles.iconWrapper}>
        <IconsSvg name={icon} />
      </View>
    </View>
  );
};

export default DashboardAnalyticsCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:colors.white,
    borderRadius: 16,
    padding: 16,
    margin: 8,
    // elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  left: {
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.huge,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  subtitle: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: 4,
  },
  iconWrapper: {
    alignSelf: 'flex-start',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});
