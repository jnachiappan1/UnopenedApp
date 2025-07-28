import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import Button from '../../components/button/buttons';

const {width} = Dimensions.get('window');

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BProductDetailScreen
>;

interface Product {
  description: string;
  originalPrice: string;
  id: number;
  name: string;
  price: string;
  image: string;
  images?: string[]; // Multiple images support
}

interface SpecificationItem {
  id: string;
  label: string;
  value: string;
}

const BProductDetailScreen: React.FC<LoginProps> = ({route, navigation}) => {
  const {item} = route?.params;
  const product : Product = item?.item;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageScrollRef = useRef<FlatList>(null);
  // Sample images array - replace with actual product images
  const productImages = product?.images || [
    product?.image,
    product?.image, // Duplicate for demo - replace with actual different images
    product?.image,
  ];

  // Specifications data for FlatList
  const specificationsData: SpecificationItem[] = [
    {id: '1', label: 'Brand', value: 'AudioTech'},
    {id: '2', label: 'Connectivity', value: 'Bluetooth 5.2'},
    {id: '3', label: 'Weight', value: '4.5g each'},
    {id: '4', label: 'Battery Life', value: '24 hours'},
    {id: '5', label: 'Charging Case', value: 'USB-C'},
    {id: '6', label: 'Water Resistance', value: 'IPX4'},
  ];

  const calculateDiscount = () => {
    const original = parseFloat(product.originalPrice.replace('$', ''));
    const current = parseFloat(product.price.replace('$', ''));
    return Math.round(((original - current) / original) * 100);
  };

  const handleBuyNow = () => {
    navigation.navigate(SCREENS.ConfirmYourOrderScreen)
  };

  const onImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentImageIndex(roundIndex);
  };

  const renderImage = ({item, index}: {item: string; index: number}) => (
    <View style={styles.imageSlide}>
      <Image source={{uri: item}} style={styles.productImage} />
    </View>
  );

  const renderSpecificationItem = ({item}: {item: SpecificationItem}) => (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{item.label}</Text>
      <Text style={styles.specValue}>: {item.value}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {productImages.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentImageIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  if (!product) {
    return (
      <TitleBackHeaderContainer title="Product Detail" isBack>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </TitleBackHeaderContainer>
    );
  }

  return (
    <TitleBackHeaderContainer title="Product Details" isBack>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Images with Swipe */}
        <View style={styles.imageContainer}>
          <FlatList
            ref={imageScrollRef}
            data={productImages}
            renderItem={renderImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onImageScroll}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => index.toString()}
          />
          {productImages.length > 1 && renderDots()}
          
          <View style={{marginRight: 2, paddingHorizontal: 20}}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{product.price}</Text>
              <Text style={styles.originalPrice}>{product.originalPrice}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {calculateDiscount()}% off
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Specifications with FlatList */}
        <View style={styles.productInfo}>
          <Text style={styles.specTitle}>Specifications</Text>
          <FlatList
            data={specificationsData}
            renderItem={renderSpecificationItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.productInfo}>
          {/* Stock Status */}
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>In Stock</Text>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIcon}>
                <IconsSvg name="vehicle" />
              </View>
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryTitle}>
                  Estimated delivery by Friday, 11 July
                </Text>
                <Text style={styles.deliverySubtitle}>Standard delivery</Text>
              </View>
            </View>

            <View style={styles.deliveryRow}>
              <View style={styles.deliveryIcon}>
                <IconsSvg name="deliverBox" />
              </View>
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryTitle}>
                  Ships from California, Sacramento
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trust Badges with Vertical Line */}
        <View style={styles.productInfo}>
          <View style={styles.trustContainer}>
            <View style={styles.trustBadge}>
              <IconsSvg name="securePayment" />
              <Text style={styles.trustText}>Secure Payment</Text>
            </View>
            
            {/* Vertical Line */}
            <View style={styles.verticalLine} />
            
            <View style={styles.trustBadge}>
              <IconsSvg name="percentIcon" />
              <Text style={styles.trustText}>100% new</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Buy Now Button */}
      <View style={styles.buyContainer}>
      <Button title='Buy Now'  onPress={handleBuyNow}/>
      </View>
      
    </TitleBackHeaderContainer>
  );
};

export default BProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    backgroundColor: colors.white,
    paddingVertical: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 20,
  },
  imageSlide: {
    width: width,
    alignItems: 'center',
  },
  productImage: {
    width: width * 0.8,
    height: 200,
    resizeMode: 'contain',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 10,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  productInfo: {
    backgroundColor: colors.white,
    padding: 20,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 18,
  },
  productName: {
    fontSize: fontSizes.large,
    color: colors.text2,
    fontFamily: fonts.bold,
    marginTop: 10,
  },
  productDescription: {
    fontSize: fontSizes.regular,
    color: colors.text2,
    fontFamily: fonts.medium,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.black,
    marginRight: 10,
  },
  originalPrice: {
    fontSize: fontSizes.medium,
    color: colors.text3,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: '#DBF5E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 18,
  },
  discountText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  specTitle: {
    color: colors.text2,
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    marginBottom: 15,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 2,
  },
  specLabel: {
    color: colors.label,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    width: 100,
  },
  specValue: {
    color: colors.darkLabel,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    flex: 1,
  },
  stockContainer: {
    marginVertical: 20,
  },
  stockBadge: {
    backgroundColor: '#DBF5E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  stockText: {
    color: colors.primary,
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
  },
  deliveryInfo: {
    marginBottom: 20,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  deliveryIcon: {
    width: 24,
    marginRight: 12,
  },
  deliveryIconText: {
    fontSize: 16,
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryTitle: {
    color: colors.title,
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
  },
  deliverySubtitle: {
    color: colors.text3,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  trustBadge: {
    alignItems: 'center',
    flex: 1,
  },
  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  trustIcon: {
    fontSize: 24,
  },
  trustPercentage: {
    fontSize: 24,
    marginBottom: 8,
  },
  trustText: {
    color: colors.title,
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    marginTop: 8,
  },
  buyContainer: {
    padding: 20,
    paddingBottom: 30,
  },
 
});