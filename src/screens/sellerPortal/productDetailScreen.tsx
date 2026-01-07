import {
  Alert,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal as RNModal,
  SafeAreaView,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {fontSizes, width, OS} from '../../utils/utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import StatusBadge from '../../components/card/statusBadge';
import fonts from '../../assets/fonts/fonts';
import InfoRow from '../../components/card/infoRow';
import Button from '../../components/button/buttons';
import WhiteButton from '../../components/button/whiteButton';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getSellerProductByID,
  updateProductStatus,
  getProductPriceDetail,
  getProductPriceChargeDetail,
} from '../../utils/apiAction';
import moment from 'moment';
import {
  handleError,
  handleSettled,
  calculateDiscount,
} from '../../utils/method';
import {showAlert} from '../../components/cAlert';
import {image_url, base_url} from '../../utils/api';
import {showLoader} from '../../components/loader/loader';
import VideoPlayer from '../../components/videoPlayer/videoPlayer';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {useForm} from 'react-hook-form';
import Input from '../../components/input/input';
import {IRootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import IconsSvg from '../../assets/svg/iconsSvg';

type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ProductDetailScreen
>;
interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

type FormData = {
  msrp: string;
  price: string;
  platform_fee: string;
  seller_final_price: string;
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const {productId} = route.params;
  const flatListRef = useRef<FlatList<ProductImage>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditPriceMode, setIsEditPriceMode] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isMsrpInfoModalVisible, setIsMsrpInfoModalVisible] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;

  const {data: ProductPriceData} = useQuery({
    queryKey: ['getProductPriceDetail'],
    queryFn: () => getProductPriceDetail(),
    enabled: isLogged && isEditPriceMode,
  });

  const {data: ProductPriceChargeData} = useQuery({
    queryKey: ['getProductPriceChargeDetail'],
    queryFn: () => getProductPriceChargeDetail(),
    enabled: isLogged && isEditPriceMode,
  });

  const sliderMin = ProductPriceData?.data?.product_price?.price || 0;
  const sliderMax = OS === 'ios' ? 90.1 : 90;

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      msrp: '',
      price: '',
      platform_fee: '',
      seller_final_price: '',
    },
  });

  const {data: productDetail, refetch: refetchProductDetail} = useQuery({
    queryKey: ['getSellerProductByID'],
    queryFn: () => getSellerProductByID(productId),
  });

  // Initialize form values when product detail is loaded and entering edit mode
  useEffect(() => {
    if (isEditPriceMode && productDetail?.data?.product?.[0]) {
      const product = productDetail.data.product[0];
      const msrp = parseFloat(product.msrp || '0');
      const price = parseFloat(product.price || '0');

      setValue('msrp', msrp.toString());
      setValue('price', price.toString());

      // Calculate discount percentage from MSRP and price
      if (msrp > 0 && price > 0) {
        const calculatedPercent = (price / msrp) * 100;
        const clampedPercent = Math.max(
          sliderMin,
          Math.min(90, calculatedPercent), // Clamp to 90% max
        );
        setDiscountPercent(clampedPercent);
      } else if (typeof sliderMin === 'number') {
        setDiscountPercent(sliderMin);
      }

      // Calculate platform fee and seller final price
      if (ProductPriceChargeData?.data?.product_price?.price_charge) {
        const platformFeePercentage =
          ProductPriceChargeData.data.product_price.price_charge;
        const platformFee = (price * platformFeePercentage) / 100;
        setValue('platform_fee', platformFee.toFixed(2));
        const sellerFinalPrice = price - platformFee;
        setValue('seller_final_price', sellerFinalPrice.toFixed(2));
      }
    }
  }, [
    isEditPriceMode,
    productDetail,
    setValue,
    sliderMin,
    ProductPriceChargeData,
  ]);

  const {mutate: withdrawMutate} = useMutation({
    mutationFn: (data: globalThis.FormData) =>
      updateProductStatus(productId, data),
    onSuccess: data => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Product',
        description: 'Product withdraw successfully',
        doneText: 'Okay',
        onDonePress: () => navigation.goBack(),
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const {mutate: updatePriceMutate} = useMutation({
    mutationFn: (data: globalThis.FormData) =>
      updateProductStatus(productId, data),
    onSuccess: data => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Product',
        description: 'Product price updated successfully',
        doneText: 'Okay',
        onDonePress: () => {
          setIsEditPriceMode(false);
          refetchProductDetail();
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });
  const Submit = async () => {
    showAlert({
      isVisible: true,
      type: 'success',
      title: 'Product',
      description: 'Are you sure you want to withdraw this product',
      doneText: 'Okay',
      deleteText: 'cancel',
      onDonePress: () => {
        const formData = new FormData();
        formData.append('product_status', 'withdrawn');

        showLoader(true);
        withdrawMutate(formData);
      },
      onDeletePress: () => {},
    });
  };

  const calculateAndUpdatePrices = (newPercent: number) => {
    // Clamp the value to maximum 90%
    const clampedPercent = Math.min(90, Math.max(sliderMin, newPercent));
    setDiscountPercent(clampedPercent);
    const msrpStr = getValues('msrp');
    const msrpNum = parseFloat(msrpStr as unknown as string);
    if (!isNaN(msrpNum) && msrpNum > 0) {
      const {amountToPay} = calculateDiscount(msrpNum, clampedPercent);
      setValue('price', amountToPay.toFixed(2));
      if (ProductPriceChargeData?.data?.product_price?.price_charge) {
        const platformFeePercentage =
          ProductPriceChargeData.data.product_price.price_charge;
        const priceAmount = parseFloat(amountToPay.toFixed(2));
        const platformFee = (priceAmount * platformFeePercentage) / 100;
        setValue('platform_fee', platformFee.toFixed(2));
        const sellerFinalPrice = priceAmount - platformFee;
        setValue('seller_final_price', sellerFinalPrice.toFixed(2));
      }
    }
  };

  const handleEditPriceSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('msrp', data.msrp);
    formData.append('price', data.price);
    formData.append('set_price', discountPercent.toString());
    formData.append('platform_fee', data.platform_fee);
    formData.append('seller_final_price', data.seller_final_price);

    showLoader(true);
    updatePriceMutate(formData);
  };
  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
    setCurrentIndex(index);
  };

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
    const list = productDetail?.data?.product[0]?.product_image || [];
    const sorted = [...list].sort(
      (a, b) => (isVideo(a) ? 1 : 0) - (isVideo(b) ? 1 : 0),
    );
    return sorted;
  }, [productDetail]);

  const renderStep2 = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.stepContainer}
      contentContainerStyle={styles.stepContentContainer}
      nestedScrollEnabled>
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Edit Pricing Information</Text>
        <View style={styles.formFieldsContainer}>
          <View style={styles.msrpContainer}>
            <Input
              control={control}
              name="msrp"
              label="MSRP *"
              required={{value: true, message: 'MSRP is required'}}
              error={errors}
              keyboardType="numeric"
              inputProps={{
                placeholder: 'Enter MSRP',
              }}
              maxLength={40}
              inputStyle={styles.inputStyle}
              inputBgColor="#E5E5E5"
              disabled={true}
              containerStyle={styles.emailContainer}
              onValueChange={text => {
                const msrpValue = parseFloat(text);
                if (!isNaN(msrpValue) && typeof discountPercent === 'number') {
                  const {amountToPay} = calculateDiscount(
                    msrpValue,
                    discountPercent,
                  );
                  setValue('price', amountToPay.toFixed(2));

                  if (
                    ProductPriceChargeData?.data?.product_price?.price_charge
                  ) {
                    const platformFeePercentage =
                      ProductPriceChargeData.data.product_price.price_charge;
                    const priceAmount = parseFloat(amountToPay.toFixed(2));

                    const platformFee =
                      (priceAmount * platformFeePercentage) / 100;
                    setValue('platform_fee', platformFee.toFixed(2));

                    const sellerFinalPrice = priceAmount - platformFee;
                    setValue('seller_final_price', sellerFinalPrice.toFixed(2));
                  }
                } else {
                  setValue('price', '');
                  setValue('platform_fee', '');
                  setValue('seller_final_price', '');
                }
              }}
            />
            <TouchableOpacity
              style={styles.infoIconContainer}
              onPress={() => setIsMsrpInfoModalVisible(true)}
              activeOpacity={0.7}>
              <View style={styles.infoIconCircle}>
                <Text style={styles.infoIconText}>i</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.discountSliderContainer}>
            <Text style={styles.discountTitle}>Listing Price Percentage</Text>
            <Text style={styles.discountValue}>
              {discountPercent?.toFixed(2)}%
            </Text>
            <View style={{marginHorizontal: 10, alignSelf: 'center'}}>
              <MultiSlider
                values={[discountPercent]}
                sliderLength={OS === 'ios' ? 280 : 300}
                trackStyle={{height: 3}}
                min={sliderMin}
                max={sliderMax}
                step={1}
                onValuesChange={values => {
                  const newPercent = values[0];
                  calculateAndUpdatePrices(newPercent);
                }}
                onValuesChangeFinish={values => {
                  const newPercent = values[0];
                  calculateAndUpdatePrices(newPercent);
                }}
                selectedStyle={{
                  backgroundColor: colors.primary,
                  alignSelf: 'center',
                }}
                unselectedStyle={{backgroundColor: '#ccc'}}
                markerStyle={{
                  backgroundColor: colors.primary,
                  height: 20,
                  width: 20,
                }}
              />
            </View>
          </View>
          <Input
            control={control}
            name="price"
            label={'Unopen Price *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Unopen Price',
              editable: false,
            }}
            required={{value: true, message: 'Unopen price is required'}}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle2}
            disabled
            textStyle
          />
          <Input
            control={control}
            name="platform_fee"
            label={'Platform Fees *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Platform Fees',
              editable: false,
            }}
            required={{value: true, message: 'Platform fees is required'}}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle2}
            disabled
            textStyle
          />
          <Input
            control={control}
            name="seller_final_price"
            label={'Seller Final Amount *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Seller Final Amount',
              editable: false,
            }}
            required={{value: true, message: 'Seller final amount is required'}}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle2}
            disabled
            textStyle
          />
        </View>
      </View>
      <View style={styles.step2Buttons}>
        <WhiteButton
          title="Cancel"
          style={styles.previousStepButton}
          textStyle={styles.cancelButtonText}
          onPress={() => setIsEditPriceMode(false)}
        />
        <Button
          title="Update Price"
          style={styles.submitReviewButton}
          onPress={handleSubmit(handleEditPriceSubmit)}
        />
      </View>
      <Modal
        isVisible={isMsrpInfoModalVisible}
        backdropOpacity={0.3}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        style={styles.modalStyle}
        onBackdropPress={() => setIsMsrpInfoModalVisible(false)}>
        <View style={styles.modalContainer}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={colors.modalBackGround}
          />
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsMsrpInfoModalVisible(false)}>
              <IconsSvg name="cancelIcon" />
            </TouchableOpacity>
            {/* <IconsSvg name="helpSupportIcon" /> */}
            <Text style={styles.modalTitle}>MSRP Information</Text>
            <Text style={styles.modalDescription}>
              MSRP is uneditable. If you want to change MSRP withdraw the
              product and add again.
            </Text>
            <Button
              title="Okay"
              style={styles.modalButton}
              onPress={() => setIsMsrpInfoModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  if (isEditPriceMode) {
    return (
      <TitleBackHeaderContainer
        isBack
        title="Edit Price"
        onBackPress={() => setIsEditPriceMode(false)}>
        {renderStep2()}
      </TitleBackHeaderContainer>
    );
  }

  return (
    <>
      <TitleBackHeaderContainer isBack title="Product Details">
        <View style={styles.imageDetailContainer}>
          <FlatList<ProductImage>
            ref={flatListRef}
            data={mediaList}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={width - 32}
            snapToAlignment="start"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            onMomentumScrollEnd={handleMomentumEnd}
            getItemLayout={(_, index) => ({
              length: width - 32,
              offset: (width - 32) * index,
              index,
            })}
            renderItem={({item}) => (
              <View style={styles.mediaContainer}>
                {isVideo(item) ? (
                  <VideoPlayer
                    source={item.image}
                    style={styles.videoPlayerContainer}
                  />
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setFullScreenImage(image_url + item.image)}>
                    <Image
                      source={{uri: image_url + item.image}}
                      style={[styles.productImage]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          {mediaList && mediaList.length > 0 && (
            <View style={styles.mediaIndicator}>
              <Text style={styles.mediaIndicatorText}>
                {currentIndex + 1} of {mediaList.length}
                {isVideo(mediaList[currentIndex]) && (
                  <Text style={styles.videoIndicator}> • Video</Text>
                )}
              </Text>
            </View>
          )}

          <StatusBadge
            status={productDetail?.data?.product[0]?.product_status}
            statusStyle={styles.statusStyle}
          />
          <Text style={styles.titleStyle}>
            {productDetail?.data?.product[0]?.name}
          </Text>
          <Text style={styles.descriptionStyle}>
            {productDetail?.data?.product[0]?.description}
          </Text>
          <InfoRow
            title="Brand"
            subtitle={productDetail?.data?.product[0]?.brand}
            subtitleStyle={styles.subtitleStyle}
          />
          <InfoRow
            title="Category"
            subtitle={productDetail?.data?.product[0]?.product_category?.name}
            subtitleStyle={styles.subtitleStyle}
          />
          <InfoRow
            title="SKU / Barcode"
            subtitle={productDetail?.data?.product[0]?.barcode}
            subtitleStyle={styles.subtitleStyle}
          />
          <InfoRow
            title="MRSP"
            subtitle={productDetail?.data?.product[0]?.msrp}
            subtitleStyle={styles.mrspStyle}
          />
          <InfoRow
            title="Listing Price"
            subtitle={productDetail?.data?.product[0]?.price}
            subtitleStyle={styles.mrspStyle}
          />
        </View>
        <View style={styles.imageDetailContainer}>
          <Text style={styles.headingStyle}>Listing Details</Text>
          <InfoRow
            title="Created On"
            style={styles.containerStyle}
            subtitle={moment(productDetail?.data?.product[0]?.createdAt).format(
              'DD MMMM YYYY',
            )}
            showColon
          />
          <InfoRow
            title="Last Updated"
            style={styles.containerStyle}
            subtitle={moment(productDetail?.data?.product[0]?.updatedAt).format(
              'DD MMMM YYYY',
            )}
            showColon
          />
        </View>
        {!['sold', 'withdrawn', 'rejected'].includes(
          productDetail?.data?.product?.[0]?.product_status,
        ) && (
          <View style={styles.buttonContainer}>
            <Button
              title={'Withdraw'}
              style={styles.withdrawButton}
              onPress={Submit}
            />
            <WhiteButton
              title={'Edit Price'}
              style={styles.editPriceButton}
              textStyle={styles.cancelButtonText}
              onPress={() => setIsEditPriceMode(true)}
            />
          </View>
        )}
      </TitleBackHeaderContainer>

      <RNModal
        visible={fullScreenImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullScreenImage(null)}>
        <SafeAreaView style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullScreenImage(null)}>
            <View style={styles.closeIconContainer}>
              <IconsSvg name="cancelIcon" />
            </View>
          </TouchableOpacity>
          {fullScreenImage && (
            <Image
              source={{uri: fullScreenImage}}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </SafeAreaView>
      </RNModal>
    </>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  imageDetailContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  containerStyle: {paddingHorizontal: 0},
  productImage: {
    width: width - 32,
    height: 210,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusStyle: {
    marginTop: 10,
  },
  subtitleStyle: {textTransform: 'capitalize'},
  titleStyle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: '#333333',
    marginVertical: 5,
    textTransform: 'capitalize',
  },
  descriptionStyle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: '#666666',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  mrspStyle: {
    fontFamily: fonts.bold,
  },
  headingStyle: {
    fontSize: fontSizes.medium,
    marginBottom: 10,
    fontFamily: fonts.bold,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
    width: '30%',
  },
  colon: {
    marginHorizontal: 4,
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 12,
    gap: 12,
  },
  editPriceButton: {
    flex: 1,
    height: 54,
    backgroundColor: 'transparent',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  withdrawButton: {
    flex: 1,
    height: 54,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  stepContentContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  detailsSection: {
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  formFieldsContainer: {
    marginTop: 24,
  },
  emailContainer: {
    marginTop: 24,
  },
  inputStyle: {
    width: '100%',
    paddingRight: 50,
  },
  inputStyle2: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  discountSliderContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  discountTitle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    color: colors.primaryBlack,
    marginBottom: 8,
  },
  discountValue: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 12,
  },
  step2Buttons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  previousStepButton: {
    flex: 1,
    height: 54,
    backgroundColor: 'transparent',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitReviewButton: {
    flex: 1,
    height: 54,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: colors.primary,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  mediaContainer: {
    width: width - 32,
    height: 210,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  videoText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    color: colors.primaryBlack,
    marginBottom: 4,
  },
  videoFileName: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
    maxWidth: width - 80,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: 'white',
  },
  mediaIndicator: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  mediaIndicatorText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.gray,
  },
  videoIndicator: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  videoTouchArea: {},
  videoPlayerContainer: {
    width: '100%',
    height: '100%',
  },
  msrpContainer: {
    position: 'relative',
  },
  infoIconContainer: {
    position: 'absolute',
    right: 16,
    top: 60,
    zIndex: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.white,
    fontWeight: 'bold',
  },
  modalStyle: {
    margin: 0,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    width: '100%',
    height: 45,
    borderRadius: 120,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
