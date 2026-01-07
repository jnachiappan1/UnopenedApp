// components/DashboardCard.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {fontSizes} from '../../utils/utils';
import {ProductData} from '../../utils/types';
import colors from '../../utils/colors';
import IconsSvg from '../../assets/svg/iconsSvg';
import fonts from '../../assets/fonts/fonts';
import StatusBadge from './statusBadge';
import {calculateDaysAgo} from '../../utils/method';
import {image_url} from '../../utils/api';

interface ProductListingCardProps {
  item: ProductData;
  cardStyle?: StyleProp<ViewStyle> | undefined;
  nameStyle?: StyleProp<TextStyle> | undefined;
  onSelect?: (item: ProductData) => void;
}

const ProductListingCard: React.FC<ProductListingCardProps> = ({
  item,
  cardStyle,
  nameStyle,
  onSelect,
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleCardPress = () => {
    onSelect?.(item);
  };

  const getProductImage = () => {
    if (!item?.product_image || item.product_image.length === 0) return null;
    const imageFile = item.product_image.find(img => {
      const imagePath = img?.image?.toLowerCase() || '';
      return (
        !imagePath.endsWith('.mp4') &&
        !imagePath.endsWith('.mov') &&
        !imagePath.endsWith('.avi') &&
        !imagePath.endsWith('.webm')
      );
    });
    return imageFile?.image || null;
  };

  const productImagePath = getProductImage();

  return (
    <View style={[styles.cardContainer, cardStyle]}>
      <View style={styles.productDetailView}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: productImagePath ? image_url + productImagePath : undefined,
            }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>
        <View style={{width: '68%'}}>
          <Text style={[styles.cardTitle, nameStyle]} numberOfLines={2}>
            {item?.name}
          </Text>
          <Text style={styles.cardPosted} numberOfLines={2}>
            Posted {calculateDaysAgo(item?.createdAt)} Days Ago
          </Text>
          <Text style={styles.cardPrice}>${item?.price?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <StatusBadge status={item.product_status} />
        <TouchableOpacity
          style={styles.viewDetailsBtn}
          activeOpacity={0.8}
          onPress={handleCardPress}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <IconsSvg name="viewDetailArrow" />
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
    shadowOffset: {width: 0, height: 2},
  },
  imageContainer: {
    width: 91,
    height: 86,
    marginRight: 12,
    position: 'relative',
  },
  cardImage: {
    width: 91,
    height: 86,
    borderRadius: 8,
    borderWidth: 0.2,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7F2',
    borderRadius: 8,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  cardTitle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#1F1F1F',
    paddingVertical: 2,
    maxWidth: '100%',
  },
  cardPrice: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
    paddingVertical: 2,
  },
  cardPosted: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: '#666666',
    paddingVertical: 2,
  },
  viewDetailsBtn: {
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#333333',
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    paddingEnd: 5,
  },
  productDetailView: {
    flexDirection: 'row',
    backgroundColor: '#F5F7F2',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
  },
});
