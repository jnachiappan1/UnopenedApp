// components/DashboardCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fontSizes } from '../../utils/utils';
import { ProductData } from '../../utils/types';

// Define types for the item data passed into the card
interface ProductListingCardProps {
  item: ProductData;
}

const ProductListingCard: React.FC<ProductListingCardProps> = ({item }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item?.image }} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item?.title}</Text>
        <Text style={styles.cardPrice}>${item?.price}</Text>
        <Text style={styles.cardPosted}>Posted {item?.daysAgo} Days Ago</Text>
        <TouchableOpacity style={styles.viewDetailsBtn}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductListingCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: '#333',
  },
  cardPrice: {
    fontSize: fontSizes.regular,
    fontWeight: '500',
    color: '#888',
  },
  cardPosted: {
    fontSize:fontSizes.small,
    color: '#888',
  },
  viewDetailsBtn: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  viewDetailsText: {
    color: 'white',
    fontSize: 14,
  },
});
