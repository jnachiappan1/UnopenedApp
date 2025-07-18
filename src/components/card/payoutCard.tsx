import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconsSvg from '../../assets/svg/iconsSvg';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';

type PayoutStatus = 'Success' | 'Pending' | 'Failed';

export type PayoutItem = {
  id: string;
  title: string;
  dateTime: string;
  amount: number;
  status: PayoutStatus;
};

type Props = {
  item: PayoutItem;
};

const PayoutCard: React.FC<Props> = ({ item }) => {
  const getStatusStyle = (status: PayoutStatus) => {
    switch (status) {
      case 'Success':
        return { backgroundColor: '#E6F5EC', color: '#2DB057' };
      case 'Pending':
        return { backgroundColor: '#FEE9CB', color: '#E29547' };
      case 'Failed':
        return { backgroundColor: '#FEE2E2', color: '#D93B3B' };
      default:
        return { backgroundColor: '#EEE', color: '#666' };
    }
  };

  const { backgroundColor, color } = getStatusStyle(item.status);

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor }]}>
          <Text style={[styles.statusText, { color }]}>{item.status}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.dateRow}>
          <IconsSvg name="celender" width={16} height={16} />
          <Text style={styles.dateText}>{item.dateTime}</Text>
        </View>
        <Text style={styles.amount}>${item.amount}</Text>
      </View>
    </View>
  );
};

export default PayoutCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 10,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
    color: colors.text2,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    marginLeft: 6,
    fontSize: fontSizes.small,
    color: colors.label,
    fontFamily: fonts.regular,
  },
  amount: {
    marginTop: 8,
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#1F1F1F',
    alignSelf: 'flex-end',
    paddingEnd: 2
  },
});
