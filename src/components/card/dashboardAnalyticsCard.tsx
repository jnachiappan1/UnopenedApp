// components/DashboardCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconsSvg, { IconName } from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';

interface DashboardAnalyticsCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
}

const DashboardAnalyticsCard: React.FC<DashboardAnalyticsCardProps> = ({ title, subtitle, icon }) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
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
    elevation: 2,
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
    fontWeight: 'bold',
    color: colors.black,
  },
  subtitle: {
    fontSize: fontSizes.small,
    color: colors.black,
    marginTop: 4,
  },
  iconWrapper: {
    alignSelf: 'flex-start',
  },
});
