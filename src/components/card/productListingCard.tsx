// components/DashboardCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { fontSizes } from '../../utils/utils';
import { ProductData } from '../../utils/types';
import colors from '../../utils/colors';
import IconsSvg from '../../assets/svg/iconsSvg';

// Define types for the item data passed into the card
interface ProductListingCardProps {
  item: ProductData;
  cardStyle?: StyleProp<ViewStyle> | undefined;
}

const ProductListingCard: React.FC<ProductListingCardProps> = ({ item,cardStyle }) => {
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'In Review':
        return {
          background: { backgroundColor: '#FBF0DB' },
          text: { color: '#AF7E15' },
        };
      case 'Sold':
        return {
          background: { backgroundColor: '#F3E4E2' },
          text: { color: '#CB1C1C' },
        };
      case 'Active':
        return {
          background: { backgroundColor: '#DBF5E2' },
          text: { color: '#239C43' },
        };
      default:
        return {
          background: {},
          text: { color: '#000' },
        };
    }
  };
  return (
    <View style={[styles.cardContainer,cardStyle]}>
      <View style={styles.productDetailView}>
        <Image source={{ uri: item?.image }} style={styles.cardImage} />
        <View>
          <Text style={styles.cardTitle}>{item?.title}</Text>
          <Text style={styles.cardPosted}>Posted {item?.daysAgo} Days Ago</Text>
          <Text style={styles.cardPrice}>${item?.price}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <View style={[styles.statusContainer, getStatusStyle(item?.status).background]}>
          <Text style={[styles.statusText, getStatusStyle(item?.status).text]}>
            {item?.status}
          </Text>
        </View>
        <TouchableOpacity style={styles.viewDetailsBtn}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <IconsSvg name='viewDetailArrow' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductListingCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 5,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: 91,
    height: 86,
    borderRadius: 8,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal:5,
    paddingVertical:5
  },
  cardTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: '#1F1F1F',
    paddingVertical: 2
  },
  cardPrice: {
    fontSize: fontSizes.medium,
    fontWeight: '500',
    color: colors.black,
    paddingVertical: 2
  },
  cardPosted: {
    fontSize: fontSizes.small,
    color: '#666666',
    paddingVertical: 2
  },
  viewDetailsBtn: {
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection:'row',
    alignItems:'center'
  },
  viewDetailsText: {
    color: '#333333',
    fontSize: fontSizes.small,
    paddingEnd:5
  },
  productDetailView: {
    flexDirection: 'row', backgroundColor: '#F5F7F2', borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 10
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
