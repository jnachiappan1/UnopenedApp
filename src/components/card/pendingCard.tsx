import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import IconsSvg, { IconName } from '../../assets/svg/iconsSvg';
import colors from '../../utils/colors';
export type TransactionTypeName = 'credit' | 'debit' | 'add';

type TransactionType = {
  id: string;
  title: string;
  status?: string;
  price: number;
  date:string;
  isExpected?: boolean;
};

type Props = {
  item: TransactionType;
};

const PendingCard: React.FC<Props> = ({ item }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.card}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{item.status}</Text>
    </View>

    <View style={styles.rowBetween}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>

    <View style={styles.dateRow}>
    <IconsSvg name={'celender'} width={20} height={20} />
      <Text style={styles.dateText}>
        {item.isExpected ? 'Expected: ' : 'Delivered on: '}
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </Text>
    </View>
  </View>
  );
};

export default PendingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    // elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEE9CB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: fonts.medium,
    color: '#E29547',
    fontSize: fontSizes.small,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#000',
  },
  price: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#000',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: '#666',
    marginLeft: 6,
  },
  date: {
    fontFamily: fonts.medium,
    color: '#000',
  },
});
