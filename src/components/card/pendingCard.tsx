import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
export type TransactionTypeName = 'credit' | 'debit' | 'add';

type TransactionType = {
  id: string;
  title: string;
  status?: string;
  price: number;
  date: string;
  isExpected?: boolean;
};

type ProductType = {
  id: number;
  brand: string;
  name: string;
  price: number;
  product_activity_status: string;
  updatedAt: string;
  createdAt: string;
  product_status: string;
  [key: string]: any;
};

type Props = {
  item: TransactionType | ProductType;
};

const PendingCard: React.FC<Props> = ({item}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const isProductType = 'brand' in item;

  const title = isProductType ? `${item.brand} ${item.name}` : item.title;
  const status = isProductType ? item.product_activity_status : item.status;
  const price = item.price;
  const date = isProductType ? item.updatedAt : item.date;
  const isExpected = isProductType
    ? item.product_activity_status !== 'delivered'
    : item.isExpected;

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.price}>${Number(price || 0).toFixed(2)}</Text>
      </View>

      <View style={styles.dateRow}>
        <IconsSvg name={'celender'} width={20} height={20} />
        <Text style={styles.dateText}>
          {isExpected ? 'Expected: ' : 'Delivered on: '}
          <Text style={styles.date}>{formatDate(date)}</Text>
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
    width: '100%',
  },
  title: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#000',
    flexShrink: 0,
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
