import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import StatusBadge from './statusBadge';
import { ProductData } from '../../utils/types';
import { image_url } from '../../utils/api';
import moment from 'moment';

type Props = {
  item: ProductData;
  onSelect?: (item: ProductData) => void;
};

const SaleCard: React.FC<Props> = ({ item ,onSelect}) => {
  const handleCardPress = () => {
    onSelect?.(item);
  };
  const formattedDate = moment(item.updatedAt).format('DD MMMM YYYY');
  const imageUrl = item.product_image?.[0]?.image
    ? `${image_url}${item.product_image[1].image}`
    : 'https://via.placeholder.com/100';
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handleCardPress}>
      <View>
        <Image
          source={{ uri: imageUrl }}
          resizeMode='cover'
          style={styles.image}
        />
        <StatusBadge
          status={item.product_activity_status}
          statusStyle={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subText}>
          Sale Date: <Text style={styles.textValue}>{formattedDate}</Text>
        </Text>
        <Text style={styles.subText}>
          Buyer Name: <Text style={styles.textValue}>{item.buyer_user?.full_name}</Text>
        </Text>
        <Text style={styles.price}>${Number(item.price || 0).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SaleCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 10
  },
  image: {
    width: 129,
    height: 122,
    borderRadius: 12,
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
    color: '#4D4D4D',
    fontFamily: fonts.medium,
    paddingVertical: 2
  },
  textValue: {
    fontFamily: fonts.medium,
    color: '#000',
    fontSize: fontSizes.small,
  },
  price: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#000',
    marginTop: 4,
  },
});
