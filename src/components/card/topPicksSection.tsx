import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import {image_url} from '../../utils/api';
import {ProductData} from '../../utils/types';
import StatusBadge from './statusBadge';

const {width} = Dimensions.get('window');

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface Props {
  title?: string;
  products: ProductData[];
  onViewAll?: () => void;
  onSelect?: (item: ProductData) => void;
}

interface ProductCardProps {
  item: ProductData;
  onSelect?: (item: ProductData) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({item, onSelect}) => {

  const productImage =
    item?.product_image?.find(
      (img: {image: string}) => !img.image?.toLowerCase().endsWith('.mp4'),
    )?.image || item?.product_image?.[0]?.image;

  return (
    <TouchableOpacity
      style={styles.topPickCard}
      onPress={() => onSelect?.(item)}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: image_url + productImage}}
          style={styles.topPickImage}
        />
      </View>
      <Text style={styles.topPickName} numberOfLines={2}>
        {item?.name}
      </Text>
      <StatusBadge status={item.product_status} />
    </TouchableOpacity>
  );
};

const TopPicksSection: React.FC<Props> = ({
  title = 'Product',
  products,
  onViewAll,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{width: 10}} />}
        renderItem={({item}) => <ProductCard item={item} onSelect={onSelect} />}
      />
    </View>
  );
};

export default TopPicksSection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  listContent: {
    paddingRight: 16,
  },
  topPickCard: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  topPickImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  topPickName: {
    color: colors.primaryBlack,
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  topPickPrice: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});
