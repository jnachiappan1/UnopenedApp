import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import Button from '../../components/button/buttons';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import {capitalizeFirstLetter, fontSizes} from '../../utils/utils';

const {width} = Dimensions.get('window');

interface ProductData {
  name: string;
  brand: string;
  category: string;
  msrp: string;
  listingPrice: string;
  description: string;
  images: string[];
  sku: string;
}

type PreviewProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.PreviewConfirmScreen
> & {
  route: {
    params?: {
      productData?: ProductData;
    };
  };
};

const PreviewConfirmScreen: React.FC<PreviewProps> = ({route, navigation}) => {
  const productData: ProductData = route.params?.productData || {
    name: 'Product Name Not Provided',
    description: 'No description provided',
    brand: 'Brand Not Provided',
    category: 'Category Not Selected',
    sku: 'SKU-GENERATED',
    msrp: '$0',
    listingPrice: '$0',
    images: [
      'https://picsum.photos/400/300?random=1',
      ' https://picsum.photos/400/300?random=2',
      ' https://picsum.photos/400/300?random=3',
    ],
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
    setCurrentIndex(index);
  };

  const handleSubmitForReview = () => {
    console.log('Submitting product for review:', productData);
    navigation.goBack();
  };

  const renderDetailRow = (label: string, value: string, isPrice?: boolean) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          isPrice && styles.priceValue,
          label === 'Listing Price' && styles.listingPrice,
        ]}>
        {value}
      </Text>
    </View>
  );

  return (
    <TitleBackHeaderContainer isBack title="Preview & Confirm">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.detailsCard}>
          <View style={styles.imageContainer}>
            <FlatList
              ref={flatListRef}
              data={productData.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              onScroll={handleScroll}
              renderItem={({item}) => (
                <Image
                  source={{uri: item}}
                  style={styles.productImage}
                  resizeMode="cover"
                  onError={e =>
                    console.log('Image load error:', e.nativeEvent.error)
                  }
                />
              )}
              contentContainerStyle={styles.flatListContent}
            />

            <View style={styles.paginationContainer}>
              {productData.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.productTitle}>
              {capitalizeFirstLetter(productData.name)}
            </Text>
            <Text style={styles.productDescription}>
              {capitalizeFirstLetter(productData.description)}
            </Text>

            <View>
              {renderDetailRow('Brand', productData.brand)}
              {renderDetailRow('Category', productData.category)}
              {renderDetailRow('SKU / Barcode', productData.sku)}
              {renderDetailRow('MSRP', productData.msrp, true)}
              <View style={[styles.detailRow, styles.lastRow]}>
                <Text style={styles.detailLabel}>Listing Price</Text>
                <Text style={styles.listingPrice}>
                  {productData.listingPrice}
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Submit For Review"
                onPress={handleSubmitForReview}
                style={styles.submitButton}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </TitleBackHeaderContainer>
  );
};

export default PreviewConfirmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#f5f5f5',
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingBottom: 16,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  imageContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: width - 32,
    height: 210,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  productTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text2,
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text3,
    lineHeight: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: colors.white,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
    width: '30%',
  },
  detailValue: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.darkLabel,
  },
  priceValue: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.darkLabel,
  },
  listingPrice: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.darkLabel,
  },
  buttonContainer: {
    paddingTop: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 16,
    marginHorizontal: 0,
  },
});
