import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import IconsSvg from '../../assets/svg/iconsSvg';
import Input from '../../components/input/input';
import {useForm} from 'react-hook-form';
import Button from '../../components/button/buttons';
import WhiteButton from '../../components/button/whiteButton';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {useMutation, useQuery} from '@tanstack/react-query';
import {addProduct, getProductPriceChargeDetail, getProductPriceDetail} from '../../utils/apiAction';
import {showAlert} from '../../components/cAlert';
import {fontSizes, OS} from '../../utils/utils';
import {IRootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import {calculateDiscount, handleError, handleSettled} from '../../utils/method';
import {showLoader} from '../../components/loader/loader';

type MediaObject = {
  uri: string;
  name: string;
  type: string;
};

type FormData = {
  brandName: string;
  productName: string;
  barcode: string;
  category: DropDownType | string;
  msrp: string;
  price: string;
  platform_fee: string;
  seller_final_price: string;
  package_dimension_length: string;
  package_dimension_width: string;
  package_dimension_height: string;
  description: string;
  productImages: MediaObject[];
  address_id: string;
};

export interface DropDownType {
  id: string;
  name: string;
}

export interface PricingStepParams {
  formValues: {
    brandName: string;
    productName: string;
    barcode: string;
    category: DropDownType | string;
    msrp: string;
    price: string;
    platform_fee: string;
    seller_final_price: string;
    package_dimension_length: string;
    package_dimension_width: string;
    package_dimension_height: string;
    description: string;
  };
  uploadedImages: MediaObject[];
  selectedPackageTier: string;
  initialDiscountPercent: number;
}

type PricingStepScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.PricingStepScreen
>;

const PricingStepScreen: React.FC<PricingStepScreenProps> = ({
  route,
  navigation,
}) => {
  const {formValues, uploadedImages, selectedPackageTier, initialDiscountPercent} =
    route.params;

  const [isAgreed, setIsAgreed] = useState(false);
  const [isMsrpManuallyEdited, setIsMsrpManuallyEdited] = useState<boolean>(false);

  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;

  const {data: ProductPriceData} = useQuery({
    queryKey: ['getProductPriceDetail'],
    queryFn: () => getProductPriceDetail(),
    enabled: isLogged,
  });

  const {data: ProductPriceChargeData} = useQuery({
    queryKey: ['getProductPriceChargeDetail'],
    queryFn: () => getProductPriceChargeDetail(),
    enabled: isLogged,
  });

  const sliderMin = ProductPriceData?.data?.product_price?.price || 0;
  const sliderMax = 90;

  const [discountPercent, setDiscountPercent] = useState<number>(
    initialDiscountPercent || sliderMin,
  );

  useEffect(() => {
    if (initialDiscountPercent && initialDiscountPercent > 0) {
      setDiscountPercent(initialDiscountPercent);
    } else if (sliderMin > 0) {
      setDiscountPercent(sliderMin);
    }
  }, [initialDiscountPercent, sliderMin]);

  const {
    control,
    formState: {errors},
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      brandName: formValues.brandName || '',
      productName: formValues.productName || '',
      barcode: formValues.barcode || '',
      category: formValues.category || '',
      msrp: formValues.msrp || '',
      price: formValues.price || '',
      platform_fee: formValues.platform_fee || '',
      seller_final_price: formValues.seller_final_price || '',
      description: formValues.description || '',
      package_dimension_length: formValues.package_dimension_length || '',
      package_dimension_width: formValues.package_dimension_width || '',
      package_dimension_height: formValues.package_dimension_height || '',
      productImages: [],
    },
  });

  useEffect(() => {
    const subscription = watch((value, {name}) => {
      if (
        name === 'price' &&
        value.price &&
        ProductPriceChargeData?.data?.product_price?.price_charge
      ) {
        const priceAmount = parseFloat(value.price);
        const platformFeePercentage =
          ProductPriceChargeData.data.product_price.price_charge;

        const platformFee = (priceAmount * platformFeePercentage) / 100;
        setValue('platform_fee', platformFee.toFixed(2));

        const sellerFinalPrice = priceAmount - platformFee;
        setValue('seller_final_price', sellerFinalPrice.toFixed(2));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, ProductPriceChargeData, setValue]);

  const calculateAndUpdatePrices = (newPercent: number) => {
    setDiscountPercent(newPercent);
    const msrpStr = getValues('msrp');
    const msrpNum = parseFloat(msrpStr as unknown as string);
    if (!isNaN(msrpNum) && msrpNum > 0) {
      const {amountToPay} = calculateDiscount(msrpNum, newPercent);
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

  const isVideo = (mediaObj: MediaObject) => {
    return mediaObj.type && mediaObj.type.includes('video');
  };

  const validateImages = () => {
    const hasVideo = uploadedImages.some(media => isVideo(media));

    if (!hasVideo) {
      return false;
    }

    if (uploadedImages.length < 2) {
      return false;
    }

    return true;
  };

  const validateAllFields = async () => {
    const isImagesValid = validateImages();
    const isPackageTierSelected = selectedPackageTier !== '';

    return isImagesValid && isPackageTierSelected;
  };

  const prepareFormDataForAPI = (data: FormData) => {
    const formData = new FormData();
    formData.append('brand', data.brandName);
    formData.append('name', data.productName);
    formData.append('barcode', data.barcode);
    const categoryId =
      typeof data.category === 'object' && data.category !== null
        ? data.category.id
        : '';
    formData.append('category_id', categoryId);
    formData.append('msrp', data.msrp);
    formData.append('dimension', selectedPackageTier);
    formData.append('price', data.price);
    formData.append('platform_fee', data.platform_fee);
    formData.append('seller_final_price', data.seller_final_price);
    formData.append('description', data.description);
    formData.append('set_price', discountPercent);

    uploadedImages.forEach((media, index) => {
      let secureUri = media.uri;
      if (media.uri.startsWith('http://')) {
        secureUri = media.uri.replace('http://', 'https://');
      }

      formData.append('images', {
        uri: secureUri,
        name: media.name || `image_${index}.jpg`,
        type: media.type || 'image/jpeg',
      });
    });

    return formData;
  };

  const handlePreviewAndConfirm = async (productInput: FormData) => {
    const isValid = await validateAllFields();
    if (!isValid) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields and upload a 360° view video plus at least 1 product image.',
      );
      return;
    }

    const formDataForAPI = prepareFormDataForAPI(productInput);
    const categoryValue =
      typeof productInput.category === 'object' &&
      productInput.category !== null
        ? productInput.category.name
        : typeof productInput.category === 'string'
        ? productInput.category
        : '';

    const previewProductData = {
      name: productInput.productName,
      brand: productInput.brandName,
      barcode: productInput.barcode,
      category: categoryValue,
      msrp: `$${productInput.msrp}`,
      listingPrice: `$${productInput.price}`,
      description: productInput.description || 'No description provided',
      images:
        uploadedImages.length > 0
          ? uploadedImages.map(img => img.uri)
          : [
              'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
            ],
      sku: 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
    navigation.navigate(SCREENS.PreviewConfirmScreen, {
      productData: previewProductData,
      formData: formDataForAPI,
    });
  };

  const {mutate} = useMutation({
    mutationFn: (data: globalThis.FormData) => addProduct(data),
    onSuccess: data => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Product',
        description:
          "Product added successfully and it's under review. You will be notified once approved.",
        doneText: 'Okay',
        onDonePress: () => {
          reset();
          navigation.navigate(SCREENS.BottomTab);
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const Submit = async (data: FormData) => {
    const isValid = await validateAllFields();
    if (!isValid) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields and upload a 360° view video plus at least 1 product image.',
      );
      return;
    }
    const apiFormData = prepareFormDataForAPI(data);
    showLoader(true);
    mutate(apiFormData);
  };

  const goToPreviousStep = () => {
    // Navigate back to AddProductScreen with preserved data
    navigation.goBack();
  };

  return (
    <TitleBackHeaderContainer
      isBack={true}
      title="Add Product"
      isNormalHeader={false}
      onBackPress={goToPreviousStep}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepIndicatorContainer}>
          <View style={styles.stepDotComplete}>
            <Text style={styles.stepCheckIcon}>✓</Text>
          </View>
          <Text style={styles.stepText}>Step 1</Text>
        </View>
        <View style={styles.stepIndicatorLine} />
        <View style={styles.stepIndicatorContainer}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <Text style={[styles.stepText, styles.stepTextActive]}>Step 2</Text>
        </View>
      </View>

      <View style={styles.pagerContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.stepContainer}
          contentContainerStyle={styles.stepContentContainer}
          nestedScrollEnabled>
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Pricing Information</Text>
            <View style={styles.formFieldsContainer}>
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
                containerStyle={styles.emailContainer}
                onValueChange={text => {
                  setIsMsrpManuallyEdited(true);
                  const msrpValue = parseFloat(text);
                  if (!isNaN(msrpValue) && typeof discountPercent === 'number') {
                    const {amountToPay} = calculateDiscount(
                      msrpValue,
                      discountPercent,
                    );
                    setValue('price', amountToPay.toFixed(2));

                    if (ProductPriceChargeData?.data?.product_price?.price_charge) {
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
              <View style={styles.discountSliderContainer}>
                <Text style={styles.discountTitle}>Listing Price Percentage</Text>
                <Text style={styles.discountValue}>{discountPercent}%</Text>
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

            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationTitle}>
                Before you publish, please confirm:
              </Text>
              <View style={styles.confirmationList}>
                <View style={styles.confirmationItemRow}>
                  <Text style={styles.bulletDot}>{'\u2022'}</Text>
                  <Text style={styles.confirmationText}>
                    I confirm that this item is factory sealed and accurately
                    described. The media I uploaded is original and contemporaneous,
                    depicting this specific item.
                  </Text>
                </View>
                <View style={styles.confirmationItemRow}>
                  <Text style={styles.bulletDot}>{'\u2022'}</Text>
                  <Text style={styles.confirmationText}>
                    I will ship within 49 hours using the provided USPS label.
                  </Text>
                </View>
                <View style={styles.confirmationItemRow}>
                  <Text style={styles.bulletDot}>{'\u2022'}</Text>
                  <Text style={styles.confirmationText}>
                    I understand my payout occurs 48 hours after delivery if no
                    dispute is filed, and that misrepresentation or non-compliance
                    may result in withheld or reversed payouts, listing removal, and
                    account action.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.checkboxRow}
                onPress={() => setIsAgreed(prev => !prev)}>
                <IconsSvg
                  name={isAgreed ? 'checkBoxSelected' : 'checkBox'}
                  width={24}
                  height={24}
                  style={styles.checkboxIcon}
                />
                <Text style={styles.checkboxLabel}>
                  I agree and confirm all statements above are true.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.step2Buttons}>
            <WhiteButton
              title="Previous Step"
              style={styles.previousStepButton}
              onPress={goToPreviousStep}
            />
            <View style={styles.step2ActionButtons}>
              <WhiteButton
                title="Preview & Confirm"
                style={styles.submitButton}
                onPress={handleSubmit(handlePreviewAndConfirm)}
                disabled={!isAgreed}
              />
              <Button
                title="Submit For Review"
                style={styles.submitReviewButton}
                onPress={handleSubmit(Submit)}
                disabled={!isAgreed}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </TitleBackHeaderContainer>
  );
};

export default PricingStepScreen;

const styles = StyleSheet.create({
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotComplete: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCheckIcon: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.bold,
    lineHeight: 20,
  },
  stepText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.label,
  },
  stepTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  stepIndicatorLine: {
    width: 80,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  pagerContainer: {
    flex: 1,
    backgroundColor: 'rgba(245, 247, 242, 0.8)',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  emailContainer: {
    marginTop: 24,
  },
  inputStyle: {
    width: '100%',
  },
  inputStyle2: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  formFieldsContainer: {
    marginTop: 24,
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
  confirmationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmationTitle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginBottom: 12,
  },
  confirmationList: {
    marginTop: 4,
  },
  confirmationItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    marginTop: 2,
    marginRight: 8,
    fontSize: fontSizes.large,
    color: colors.primaryBlack,
  },
  confirmationText: {
    flex: 1,
    fontSize: fontSizes.small,
    color: colors.text,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkboxIcon: {
    marginRight: 10,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: fontSizes.small,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
  },
  step2Buttons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  step2ActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  previousStepButton: {
    backgroundColor: 'transparent',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginBottom: 20,
    paddingVertical: 16,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: 'transparent',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginEnd: 10,
    paddingVertical: 16,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitReviewButton: {
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    marginHorizontal: 0,
    paddingVertical: 16,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

