import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import StatusBadge from './statusBadge';

type SaleItemType = {
  id: string;
  title: string;
  buyer: string;
  date: string;
  price: number;
  status?: string; // Accept any string now
  image: string;
};

type Props = {
  item: SaleItemType;
};

// Switch-based status style resolver
const getStatusStyles = (status?: string) => {
  switch (status) {
    case 'Delivered':
      return { badgeColor: '#C8F4CE', textColor: '#38C36D' };
    case 'In Transit':
      return { badgeColor: '#FEE9CB', textColor: '#E29547' };
    case 'Cancelled':
      return { badgeColor: '#FFD4D4', textColor: '#D00000' };
    case 'Shipped':
      return { badgeColor: '#D6E4FF', textColor: '#4472C4' };
    default:
      return { badgeColor: '#EEE', textColor: '#999' }; // fallback style
  }
};

const SaleCard: React.FC<Props> = ({ item }) => {
  const { badgeColor, textColor } = getStatusStyles(item.status);

  return (
    <View style={styles.card}>
      <View>
      <Image source={{ uri: item.image }} resizeMode='contain' style={styles.image} />
      <StatusBadge status={item.status} statusStyle={{
        position:'absolute',
        alignSelf:'flex-end',
        marginTop:10
      }} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subText}>
          Sale Date: <Text style={styles.textValue}>{item.date}</Text>
        </Text>
        <Text style={styles.subText}>
          Buyer Name: <Text style={styles.textValue}>{item.buyer}</Text>
        </Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </View>
  );
};

export default SaleCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 134,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
  },
  statusText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
  },
  title: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#000',
    marginBottom: 4,
  },
  subText: {
    fontSize: fontSizes.small,
    color: '#555',
    fontFamily: fonts.regular,
  },
  textValue: {
    fontFamily: fonts.medium,
    color: '#000',
  },
  price: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: '#000',
    marginTop: 4,
  },
});
