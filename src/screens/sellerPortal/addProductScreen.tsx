import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  RootStackParamList,
  SCREENS,
} from '../../navigation/mainNavigation';
import IconsSvg from '../../assets/svg/iconsSvg';
import Input from '../../components/input/input';
import { useForm } from 'react-hook-form';
import DropdownInput from '../../components/input/dropdownInput';
import Button from '../../components/button/buttons';
import WhiteButton from '../../components/button/whiteButton';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import ImageUpload from '../../components/input/ImageUpload';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import ProductImageUpload from '../../components/model/productImageUpload';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addProduct, getCategoryDetail, getProductPriceDetail, getScanProductDetail } from '../../utils/apiAction';
import { showAlert } from '../../components/cAlert';
import { fontSizes } from '../../utils/utils';
import { IRootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { calculateDiscount, handleError, handleSettled } from '../../utils/method';
import { showLoader } from '../../components/loader/loader';

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
  dimensions: string;
  weight: string;
  description: string;
  productImages: MediaObject[];
};

export interface DropDownType {
  id: string;
  name: string;
}

type AddProductScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddProductScreen
>;

const AddProductScreen: React.FC<AddProductScreenProps> = ({
  route,
  navigation,
}) => {
  const {
    scannedBarcode
  } = route.params || {};
  console.log(scannedBarcode,"scannedBarcode----");
  const [uploadedImages, setUploadedImages] = useState<MediaObject[]>([]);
  const [isNavigatingToPreview, setIsNavigatingToPreview] = useState(false);
  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageError, setImageError] = useState<string>('');
  const [dropdownData, setDropdownData] = useState<DropDownType[]>([]);
  const { data: categoryData, refetch: refetchcategoryDetail } = useQuery({
    queryKey: ['getCategoryDetail'],
    queryFn: () => getCategoryDetail(),
    enabled: isLogged,
  });
  const { data: ProductPriceData, refetch: refetchProductPriceData } = useQuery({
    queryKey: ['getProductPriceDetail'],
    queryFn: () => getProductPriceDetail(),
    enabled: isLogged,
  });
  const {
    data: scanProductData,
    refetch: refetchScanProductData,
    isFetching: isScanFetching,
  } = useQuery({
    queryKey: ['getScanProductDetail', scannedBarcode],
    queryFn: () => getScanProductDetail(scannedBarcode as string),
    enabled: !!scannedBarcode,
  });
  const discountPercentage = ProductPriceData?.data?.product_price?.price
  const transformCategoryData = (apiData: any): DropDownType[] => {
    if (apiData?.status === 'success' && apiData?.data?.category) {
      const transformed = apiData.data.category
        .filter((category: any) => category.status === 'active')
        .map((category: any) => ({
          id: category.id.toString(),
          name: category.name
        }));
      return transformed;
    }
    return [];
  };
  useEffect(() => {
    if (categoryData) {
      const transformedData = transformCategoryData(categoryData);
      setDropdownData(transformedData);
    }
  }, [categoryData]);
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      brandName: '',
      productName: '',
      barcode: '',
      category: '',
      msrp: '',
      price: '',
      description: '',
      dimensions: '',
      weight: '',
      productImages: [],
    }
  });
  useEffect(() => {
    if ( scanProductData?.data?.product) {
      const productData = scanProductData.data.product;
      const scannedCategoryName = productData.category || '';
      const matchedCategory = dropdownData.find((cat) =>
        scannedCategoryName.toLowerCase().includes(cat.name.toLowerCase()) ||
        cat.name.toLowerCase().includes(scannedCategoryName.toLowerCase())
      );
      if (matchedCategory) {
        setValue('category', matchedCategory);
      }
      setValue('brandName', productData.brand || '');
      setValue('productName', productData.title || '');
      setValue('barcode', productData.ean || productData.upc || scannedBarcode || '');
      setValue('description', productData.description || '');
      setValue('dimensions', productData.dimension || '');
      setValue('weight', productData.weight ? productData.weight.toString() : '');
      if (productData.images && productData.images.length > 0) {
        const imageObjects: MediaObject[] = productData.images.slice(0, 6).map((url: string, index: number) => ({
          uri: url,
          name: `product_image_${index + 1}.jpg`,
          type: 'image/jpeg'
        }));
        setUploadedImages(imageObjects);
        setValue('productImages', imageObjects);
  
        if (imageObjects.length >= 2) {
          clearErrors('productImages');
          setImageError('');
        }
      }
      clearErrors();
    }
  }, [scanProductData, dropdownData, setValue, clearErrors, scannedBarcode]);

  const handleImageUpload = (selectedImages: MediaObject[]) => {
    setUploadedImages(selectedImages);
    setValue('productImages', selectedImages);
    if (selectedImages.length >= 2) {
      clearErrors('productImages');
      setImageError('');
    } else {
      const errorMessage = `Please select at least 2 images. Currently selected: ${selectedImages.length}`;
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage
      });
    }
    setIsModalVisible(false);
  };
  const validateImages = () => {
    if (uploadedImages.length < 2) {
      const errorMessage = `Minimum 2 images required. Currently selected: ${uploadedImages.length}`;
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage
      });
      return false;
    }
    clearErrors('productImages');
    setImageError('');
    return true;
  };

  const validateAllFields = async () => {
    const isFormValid = await trigger();
    const isImagesValid = validateImages();
    return isFormValid && isImagesValid;
  };

  const handlePreviewAndConfirm = async (productInput: FormData) => {
    const isValid = await validateAllFields();
    if (!isValid) {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields and upload at least 2 product images.'
      );
      return;
    }
    setIsNavigatingToPreview(true);
    const formDataForAPI = prepareFormDataForAPI(productInput);
    const categoryValue =
      typeof productInput.category === 'object' && productInput.category !== null
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
      images: uploadedImages.length > 0
        ? uploadedImages.map(img => img.uri)
        : ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop'],
      sku: 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
    navigation.navigate(SCREENS.PreviewConfirmScreen, {
      productData: previewProductData,
      formData: formDataForAPI,
    });

    setIsNavigatingToPreview(false);
  };

  const prepareFormDataForAPI = (data: FormData) => {
    const formData = new FormData()
    formData.append('brand', data.brandName);
    formData.append('name', data.productName);
    formData.append('barcode', data.barcode);
    const categoryId = typeof data.category === 'object' && data.category !== null
      ? data.category.id
      : '';
    formData.append('category_id', categoryId);
    formData.append('msrp', data.msrp);
    data?.dimensions && formData.append('dimensions', data.dimensions);
    data?.weight && formData.append('weight', data.weight);
    formData.append('price', data.price);
    formData.append('description', data.description);
    uploadedImages.forEach((media, index) => {
      formData.append(`images`, {
        uri: media.uri,
        name: media.name,
        type: media.type,
      });
    });

    return formData;
  };

  const { mutate } = useMutation({
    mutationFn: (data: globalThis.FormData) => addProduct(data),
    onSuccess: data => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Product',
        description: 'Product added successfully',
        doneText: 'Okay',
        onDonePress: () => {
          reset();
          setUploadedImages([]);
          setImageError('');
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
        'Please fill all required fields and upload at least 2 product images.'
      );
      return;
    }
    const apiFormData = prepareFormDataForAPI(data);
    console.log("apiFormData=======",apiFormData);
    showLoader(true);
     mutate(apiFormData)
  };

  const handleUploadPress = () => {
    setIsModalVisible(true);
  };

  const isVideo = (mediaObj: MediaObject) => {
    return mediaObj.type && mediaObj.type.includes('video');
  };

  const removeImage = (index: number) => {
    Alert.alert(
      'Remove Media',
      'Are you sure you want to remove this media?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(updatedImages);
            setValue('productImages', updatedImages);
            if (updatedImages.length >= 2) {
              clearErrors('productImages');
              setImageError('');
            } else {
              const errorMessage = `Please select at least 2 images. Currently selected: ${updatedImages.length}`;
              setImageError(errorMessage);
              setError('productImages', {
                type: 'manual',
                message: errorMessage
              });
            }
          }
        }
      ]
    );
  };

  const clearAllImages = () => {
    Alert.alert(
      'Clear All Media',
      'Are you sure you want to remove all selected media?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setUploadedImages([]);
            setValue('productImages', []);
            setImageError('Please select at least 2 images');
            setError('productImages', {
              type: 'manual',
              message: 'Please select at least 2 images'
            });
          }
        }
      ]
    );
  };

  // Render scan section with loading state
  const renderScanSection = () => (
    <View style={styles.scanSection}>
      <IconsSvg name="scannerIcon" />
      <Text style={styles.scanTitle}>Scan Product Barcode</Text>
      <Text style={styles.scanSubtitle}>
        {isScanFetching 
          ? 'Loading product data...' 
          : 'Automatically fill product details by\nscanning the barcode.'
        }
      </Text>
      <WhiteButton 
        style={[styles.scanButton, isScanFetching && { opacity: 0.6 }]} 
        title={isScanFetching ? "Loading..." : "Scan Now"} 
        onPress={() => {
          if (!isScanFetching) {
            navigation.navigate(SCREENS.BarcodeScanner);
          }
        }}
      />
      {scannedBarcode && (
        <Text style={styles.scannedBarcodeText}>
          Scanned: {scannedBarcode}
        </Text>
      )}
    </View>
  );

  return (
    <TitleBackHeaderContainer isBack title="Add Product">
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderScanSection()}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Product Details & Media</Text>
          <Input
            control={control}
            name="brandName"
            label={'Brand *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Brand Name',
            }}
            required={{ value: true, message: 'Brand name is required' }}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
          />
          <Input
            control={control}
            name="productName"
            label={'Product Name *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Product Name',
            }}
            required={{ value: true, message: 'Product name is required' }}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
          />
          <Input
            control={control}
            name="barcode"
            label={'Barcode *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Barcode',
            }}
            required={{ value: true, message: 'Barcode is required' }}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
          />
          <DropdownInput
            control={control}
            name="category"
            label="Select Category *"
            data={dropdownData}
            placeholder="Choose a category..."
            isSearch={true}
            valueField="id"
            labelField="name"
            required={{ value: true, message: 'Category is required' }}
            error={errors}
            onChangeValue={(selectedItem) => {
              console.log('Selected Item:', selectedItem);
            }}
            containerStyle={styles.categoryStyle}
          />
          <Input
            control={control}
            name="msrp"
            label="MSRP *"
            required={{ value: true, message: 'MSRP is required' }}
            error={errors}
            keyboardType="numeric"
            inputProps={{
              placeholder: 'Enter MSRP',
            }}
            maxLength={40}
            inputStyle={styles.inputStyle}
            containerStyle={styles.emailContainer}
            onValueChange={(text) => {
              const msrpValue = parseFloat(text);
              if (!isNaN(msrpValue) && discountPercentage) {
                const { amountToPay } = calculateDiscount(msrpValue, discountPercentage);
                setValue('price', amountToPay.toFixed(2));
              }
              else {
                setValue('price', '');
              }
            }}
          />
          <Input
            control={control}
            name="price"
            label={'Price *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Price',
              editable: false,
            }}
            required={{ value: true, message: 'Price is required' }}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle}
            disabled
          />
          <Input
            control={control}
            name="dimensions"
            label={'Dimensions'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Dimensions'
            }}
            required={{ value: true, message: 'Dimensions is required' }}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle}
          />
          <Input
            control={control}
            name="weight"
            label={'Weight'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Weight'
            }}
            required={{ value: true, message: 'Weight is required' }}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle}
          />
          <Input
            control={control}
            name="description"
            label={'Product Description *'}
            containerStyle={{height:120}}
            inputProps={{
              placeholder: 'Enter Product Description...',
            }}
            required={{
              value: true,
              message: 'Product description is required',
            }}
            error={errors}
            maxLength={500}
            inputStyle={styles.productDesc}
            multiline
          />
          <View style={styles.imageUploadContainer}>
            <Text style={styles.imageUploadLabel}>Product Images/Video *</Text>
            <ImageUpload
              onUpload={handleUploadPress}
              title="Upload Product Media"
              subtitle={`Min 2 images or 1 video (${uploadedImages.length} selected)`}
              uploadTitle="Upload Your Product Photos/Video"
              uploadSubtitle="Minimum 720p quality. Ensure files are not corrupted or blurred."
            />
            {imageError ? (
              <Text style={styles.imageErrorText}>{imageError}</Text>
            ) : null}
            {uploadedImages.length > 0 && (
              <View style={styles.selectedImagesContainer}>
                <View style={styles.selectedImagesHeader}>
                  <Text style={styles.selectedImagesText}>
                    ✅ {uploadedImages.length} media file(s) selected
                  </Text>
                  {uploadedImages.length >= 2 && (
                    <Text style={styles.validationSuccessText}>
                      Minimum requirement met!
                    </Text>
                  )}
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagesPreviewScroll}
                  contentContainerStyle={styles.imagesPreviewContent}
                >
                  {uploadedImages.map((mediaObj, index) => (
                    <View key={index} style={styles.previewImageContainer}>
                      {isVideo(mediaObj) ? (
                        <View style={styles.videoPreviewContainer}>
                          <Text style={styles.videoPreviewIcon}>🎥</Text>
                          <Text style={styles.videoPreviewText}>Video {index + 1}</Text>
                          <Text style={styles.videoFileName} numberOfLines={1}>
                            {mediaObj.name}
                          </Text>
                        </View>
                      ) : (
                        <Image
                          source={{ uri: mediaObj.uri }}
                          style={styles.previewImage}
                          resizeMode="cover"
                        />
                      )}
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                      <View style={styles.imageNumberBadge}>
                        <Text style={styles.imageNumberText}>{index + 1}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={clearAllImages}
                >
                  <Text style={styles.clearAllButtonText}>🗑️ Clear All</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <ProductImageUpload
            isVisible={isModalVisible}
            setIsVisible={setIsModalVisible}
            onImageSelected={handleImageUpload}
            selectedImages={uploadedImages}
          />
        </View>
        <View style={styles.bottomButtons}>
          <WhiteButton
            title="Preview & Confirm"
            style={styles.submitButton}
            onPress={handleSubmit(handlePreviewAndConfirm)}
          />
          <Button
            title="Submit For Review"
            style={styles.submitReviewButton}
            onPress={handleSubmit(Submit)}
          />
          <View style={{ height: 130 }} />
        </View>
      </ScrollView>
    </TitleBackHeaderContainer>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  scanSection: {
    backgroundColor: colors.white,
    margin: 20,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  scanTitle: {
    fontSize: fontSizes.huge,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginBottom: 10,
  },
  scanSubtitle: {
    fontSize: fontSizes.regular,
    color: colors.text,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  scanButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
  },
  emailContainer: {
    marginTop: 20,
  },
  productDesc: {

    fontSize: fontSizes.regular,
    minHeight:  100,
    paddingVertical: 12 ,
    borderRadius: 16,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    width: '100%',
    textAlignVertical: 'top'

},
  inputStyle: {
    width: '100%',
  },
  imageUploadContainer: {
    marginTop: 20,
  },
  imageUploadLabel: {
    fontSize: fontSizes.medium,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    marginBottom: 10,
  },
  imageErrorText: {
    color: '#FF3B30',
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    marginTop: 5,
    marginLeft: 5,
  },
  selectedImagesContainer: {
    marginTop: 10,
  },
  selectedImagesText: {
    color: colors.primary || '#4CAF50',
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    marginLeft: 5,
  },
  validationSuccessText: {
    color: '#4CAF50',
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    marginTop: 2,
    marginLeft: 5,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingBottom: 50,
    alignSelf: "center"
  },
  submitButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginEnd: 10
  },
  submitReviewButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginHorizontal: 0,
  },
  selectedImagesHeader: {
    marginBottom: 12,
  },
  imagesPreviewScroll: {
    marginBottom: 12,
  },
  imagesPreviewContent: {
    paddingVertical: 4,
  },
  previewImageContainer: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  videoPreviewContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007bff',
    borderStyle: 'dashed',
  },
  videoPreviewIcon: {
    fontSize: fontSizes.huge,
    marginBottom: 4,
  },
  videoPreviewText: {
    fontSize: fontSizes.tiny,
    color: '#007bff',
    fontWeight: '600',
    textAlign: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: 2,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeImageText: {
    color: 'white',
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  imageNumberBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumberText: {
    color: 'white',
    fontSize: fontSizes.tiny,
    fontWeight: 'bold',
  },
  clearAllButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'center',
  },
  clearAllButtonText: {
    color: 'white',
    fontSize: fontSizes.small,
    fontWeight: '600',
  },
  videoFileName: {
    fontSize: fontSizes.xTiny,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  categoryStyle: {
    marginTop: 10
  },
  scannedBarcodeText: {
    fontSize: fontSizes.small,
    color: colors.primary || '#4CAF50',
    fontFamily: fonts.medium,
    marginTop: 10,
    textAlign: 'center',
  },
});