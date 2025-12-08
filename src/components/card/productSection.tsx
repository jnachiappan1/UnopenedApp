// components/DashboardCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import {image_url} from '../../utils/api';
import {ProductData} from '../../utils/types';
import StatusBadge from './statusBadge';

interface Props {
  title?: string;
  products: ProductData[];
  onViewAll?: () => void;
  onPress?: (item: ProductData) => void;
  showViewAll?: boolean;
}
const ProductSection: React.FC<Props> = ({
  title = 'Our Products',
  products,
  onViewAll,
  onPress,
  showViewAll = true,
}) => {
  const handlePress = (product: ProductData) => {
    if (onPress) {
      onPress(product);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onViewAll && showViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        renderItem={(item, isHorizontal = false) => {
          const imageUri = item.item?.product_image?.[1]?.image
            ? image_url + item.item?.product_image?.[1]?.image
            : item.item?.product_image?.[0]?.image
            ? image_url + item.item?.product_image?.[0]?.image
            : 'https://via.placeholder.com/150';


          return (
            <>
              {item?.item?.product_status !== 'sold' && (
                <View style={styles.productWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.productCard,
                      isHorizontal && styles.horizontalCard,
                    ]}
                    onPress={() => handlePress(item.item)}>
                    <Image
                      source={{uri: imageUri}}
                      style={[
                        styles.productImage,
                        isHorizontal && styles.horizontalImage,
                      ]}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.item?.name}
                      </Text>
                      <Text style={styles.productDescription} numberOfLines={1}>
                        {item.item?.description}
                      </Text>
                      {item?.item?.product_status === 'sold' ? (
                        <StatusBadge status={item.item?.product_status} />
                      ) : (
                        <View style={styles.priceContainer}>
                          <Text style={styles.price}>${item.item?.price.toFixed(2)}</Text>
                          {item.item?.msrp && (
                            <Text style={styles.originalPrice}>
                              ${item.item?.msrp.toFixed(2)}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </>
          );
        }}
      />
    </View>
  );
};

export default ProductSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  productWrapper: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  horizontalCard: {
    width: 300,
    marginRight: 16,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  horizontalImage: {
    height: 150,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: colors.primaryBlack,
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  productDescription: {
    color: '#666666',
    fontSize: 12,
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: colors.black,
    fontSize: 16,
    fontFamily: fonts.bold,
    marginRight: 8,
  },
  originalPrice: {
    color: '#666666',
    fontSize: 12,
    fontFamily: fonts.bold,
    textDecorationLine: 'line-through',
  },
});
