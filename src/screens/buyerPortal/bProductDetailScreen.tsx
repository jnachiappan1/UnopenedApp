import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
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
import {
  getProductAddressById,
  getProductDetailByID,
  getProductPriceDetail,
} from '../../utils/apiAction';
import {useQuery} from '@tanstack/react-query';
import {image_url} from '../../utils/api';
import InfoRow from '../../components/card/infoRow';
import {useSelector} from 'react-redux';
import {IRootState} from '../../redux/store';
import {showLoader} from '../../components/loader/loader';
import StatusBadge from '../../components/card/statusBadge';
import VideoPlayer from '../../components/videoPlayer/videoPlayer';

const {width} = Dimensions.get('window');

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BProductDetailScreen
>;
interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
}

const BProductDetailScreen: React.FC<LoginProps> = ({route, navigation}) => {
  const {productId} = route?.params;
  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;

  const {data: allProductList, isLoading} = useQuery({
    queryKey: ['getProductDetailByID', productId],
    queryFn: () => getProductDetailByID(productId),
  });

  const {data: addData} = useQuery({
    queryKey: ['getProductAddress', productId],
    queryFn: () => getProductAddressById(productId),
  });
  console.log('addData', addData);

  const {data: ProductPriceData, isLoading: isLoadingProductPriceData} =
    useQuery({
      queryKey: ['getProductPriceDetail'],
      queryFn: () => getProductPriceDetail(),
      enabled: isLogged,
    });

  const flatListRef = useRef<FlatList<ProductImage>>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
  };

  React.useEffect(() => {
    showLoader(isLoading);
  }, [isLoading]);

  const isVideo = (mediaItem: ProductImage) => {
    if (mediaItem.type && mediaItem.type.includes('video')) {
      return true;
    }
    if (mediaItem.image) {
      const videoExtensions = [
        '.mp4',
        '.mov',
        '.avi',
        '.mkv',
        '.wmv',
        '.flv',
        '.webm',
      ];
      return videoExtensions.some(ext =>
        mediaItem.image.toLowerCase().endsWith(ext),
      );
    }
    return false;
  };

  const mediaList = React.useMemo(() => {
    const list = allProductList?.data?.product?.[0]?.product_image || [];
    const sorted = [...list].sort(
      (a, b) => (isVideo(a) ? 1 : 0) - (isVideo(b) ? 1 : 0),
    );
    return sorted;
  }, [allProductList]);

  const deliveryTitleText = React.useMemo(() => {
    const user = addData?.data?.product?.[0]?.product_user;
    if (!user) return 'Ships from';

    const address = user?.address;

    const parts = [address].filter(Boolean);
    return parts.length ? `Ships from ${parts.join(', ')}` : 'Ships from';
  }, [addData]);

  if (!isLoading && !allProductList?.data?.product?.[0]) {
    return (
      <TitleBackHeaderContainer title="Product Detail" isBack>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </TitleBackHeaderContainer>
    );
  }

  if (isLoading) {
    return (
      <TitleBackHeaderContainer title="Product Details" isBack>
        <View style={styles.container} />
      </TitleBackHeaderContainer>
    );
  }

  const currentProduct = allProductList?.data?.product[0];

  const productImages: ProductImage[] = (currentProduct?.product_image ?? [])
    .slice()
    .reverse();
  return (
    <>
      <TitleBackHeaderContainer title="Product Details" isBack>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <View style={styles.imageCarouselContainer}>
            <FlatList
              ref={flatListRef}
              data={mediaList}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              onMomentumScrollEnd={handleImageScroll}
              snapToAlignment="center"
              decelerationRate="fast"
              renderItem={({item}) => (
                <View style={styles.imageSlide}>
                  {isVideo(item) ? (
                    <VideoPlayer
                      source={item.image}
                      style={styles.productImage}
                    />
                  ) : (
                    <Image
                      source={{uri: image_url + item.image}}
                      style={[styles.productImage]}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}
            />
            <View style={styles.dotsContainer}>
              {productImages.map((_: ProductImage, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentImageIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
            <View style={styles.productInfoInside}>
              <Text style={styles.productName}>{currentProduct?.name}</Text>
              <Text style={styles.productDescription}>
                {currentProduct?.description}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  ${Number(currentProduct?.price || 0).toFixed(2)}
                </Text>
                {currentProduct?.msrp && (
                  <Text style={styles.originalPrice}>
                    ${Number(currentProduct?.msrp || 0).toFixed(2)}
                  </Text>
                )}
                {isLoadingProductPriceData ? (
                  <View style={styles.discountContainer}>
                    <Text style={styles.stockText}>Loading...</Text>
                  </View>
                ) : (
                  ProductPriceData?.data?.product_price?.price && (
                    <View style={styles.discountContainer}>
                      <Text style={styles.stockText}>
                        {100 - addData?.data?.product[0]?.set_price}% off
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.specTitle}>Specifications</Text>
            <InfoRow
              title="Brand"
              showColon
              subtitle={currentProduct?.brand}
              style={styles.mainContainerStyle}
              subtitleStyle={styles.subtitleStyle}
            />
            <InfoRow
              title="Product Category"
              showColon
              subtitle={currentProduct?.product_category?.name}
              style={styles.mainContainerStyle}
              subtitleStyle={styles.subtitleStyle}
            />
          </View>
          {userData !== null && (
            <View style={styles.productInfo}>
              <StatusBadge
                status={
                  currentProduct?.product_status === 'active'
                    ? 'In_Stock'
                    : currentProduct?.product_status
                }
              />

              <View style={styles.deliveryInfo}>
                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryIcon}>
                    <IconsSvg name="deliverBox" />
                  </View>
                  <View style={styles.deliveryDetails}>
                    <Text style={styles.deliveryTitle}>
                      {deliveryTitleText}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.productInfo}>
            <View style={styles.trustContainer}>
              <View style={styles.trustBadge}>
                <IconsSvg name="securePayment" />
                <Text style={styles.trustText}>Secure Payment</Text>
              </View>
              <View style={styles.verticalLine} />
              <View style={styles.trustBadge}>
                <IconsSvg name="percentIcon" />
                <Text style={styles.trustText}>100% new</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </TitleBackHeaderContainer>
      <View style={styles.buyContainer}>
        {currentProduct?.product_status === 'active' && (
          <Button
            title="Buy Now"
            onPress={() => {
              if (isLogged) {
                navigation.navigate(SCREENS.ConfirmYourOrderScreen, {
                  productId: currentProduct?.id,
                });
              } else {
                navigation.navigate(SCREENS.LoginScreen);
              }
            }}
          />
        )}
      </View>
    </>
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
  imageCarouselContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  subtitleStyle: {textTransform: 'capitalize'},
  mainContainerStyle: {
    paddingHorizontal: 0,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  imageSlide: {
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: width - 60,
    height: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
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
  productInfoInside: {
    paddingHorizontal: 20,
    width: '100%',
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
    marginBottom: 8,
  },
  productDescription: {
    fontSize: fontSizes.regular,
    color: colors.text2,
    fontFamily: fonts.medium,
    lineHeight: 20,
    marginBottom: 12,
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
    fontSize: fontSizes.medium,
    color: colors.text3,
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  specTitle: {
    color: colors.text2,
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    marginBottom: 15,
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
  discountContainer: {
    backgroundColor: '#DBF5E2',
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 18,
    alignSelf: 'flex-start',
    height: 26,
    justifyContent: 'center',
  },
  videoPlayerContainer: {
    width: '100%',
    height: '100%',
  },
});
