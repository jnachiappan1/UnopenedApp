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
import { addProduct, getCategoryDetail, getProductPriceChargeDetail, getProductPriceDetail, getScanProductDetail } from '../../utils/apiAction';
import { showAlert } from '../../components/cAlert';
import { fontSizes } from '../../utils/utils';
import { IRootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { calculateDiscount, handleError, handleSettled } from '../../utils/method';
import { showLoader } from '../../components/loader/loader';
import ApplyOfferInput from '../../components/input/applyOfferInput';

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
  const [uploadedImages, setUploadedImages] = useState<MediaObject[]>([]);
  const [isNavigatingToPreview, setIsNavigatingToPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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
  const { data: ProductPriceChargeData, refetch: refetchProductPriceChargeData } = useQuery({
    queryKey: ['getProductPriceChargeDetail'],
    queryFn: () => getProductPriceChargeDetail(),
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
    watch,
  } = useForm<FormData>({
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      brandName: '',
      productName: '',
      barcode: '',
      category: '',
      msrp: '',
      price: '',
      platform_fee: '',
      seller_final_price: '',
      description: '',
      dimensions: '',
      weight: '',
      productImages: [],
    }
  });

  // Monitor category value changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'category') {
       
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Monitor price changes to recalculate platform fee and seller final price
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'price' && value.price && ProductPriceChargeData?.data?.product_price?.price_charge) {
        const priceAmount = parseFloat(value.price);
        const platformFeePercentage = ProductPriceChargeData.data.product_price.price_charge;
        
        // Calculate platform fee (17% of price)
        const platformFee = (priceAmount * platformFeePercentage) / 100;
        setValue('platform_fee', platformFee.toFixed(2));
        
        // Calculate seller final price (price - platform fee)
        const sellerFinalPrice = priceAmount - platformFee;
        setValue('seller_final_price', sellerFinalPrice.toFixed(2));
        
        
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, ProductPriceChargeData, setValue]);
      
  useEffect(() => {
    if (scanProductData?.data?.product) {
      const productData = scanProductData.data.product;
      const scannedCategoryName = productData.category || '';
      
      // Extract the first part before ">" for better category matching
      const primaryCategory = scannedCategoryName.split('>')[0]?.trim() || scannedCategoryName;
      const matchedCategory = dropdownData.find((cat) => {
        // Check if the category name is contained in the scanned category
        const isContained = primaryCategory.toLowerCase().includes(cat.name.toLowerCase()) ||
                           cat.name.toLowerCase().includes(primaryCategory.toLowerCase());
        const isExactMatch = cat.name.toLowerCase() === primaryCategory.toLowerCase();
        return isContained || isExactMatch;
      });
      
      if (matchedCategory) {
        setValue('category', matchedCategory);
      } else {
        // No category match found
      }
      
      setValue('brandName', productData.brand || '');
      setValue('productName', productData.title || '');
      setValue('barcode', productData.ean || productData.upc || scannedBarcode || '');
      
 
      // Set MSRP
      const msrpValue = productData.highest_recorded_price || '';
      setValue('msrp', msrpValue.toString());
      
      // Calculate and set price based on MSRP and discount
      if (msrpValue && discountPercentage) {
        const { amountToPay } = calculateDiscount(parseFloat(msrpValue), discountPercentage);
        setValue('price', amountToPay.toFixed(2));
        if (ProductPriceChargeData?.data?.product_price?.price_charge) {
          const platformFeePercentage = ProductPriceChargeData.data.product_price.price_charge;
          const priceAmount = parseFloat(amountToPay.toFixed(2));
          const platformFee = (priceAmount * platformFeePercentage) / 100;
          setValue('platform_fee', platformFee.toFixed(2));
          const sellerFinalPrice = priceAmount - platformFee;
          setValue('seller_final_price', sellerFinalPrice.toFixed(2));
        }
      } else {
        setValue('price', '');
        setValue('platform_fee', '');
        setValue('seller_final_price', '');
      }
      
      setValue('description', productData.description || '');
      setValue('dimensions', productData.dimension || '');
      setValue('weight', productData.weight ? productData.weight.toString() : '');
      
      // Handle images from scanned product - only set the first image, user can add more
      if (productData.images && productData.images.length > 0) {
        // Clear any existing images first to ensure clean state
        setUploadedImages([]);
        setValue('productImages', []);
        
        // Only take the first image from scanned product, not all images
        const scannedImage: MediaObject = {
          uri: productData.images[0], // Only first image
          name: 'scanned_product_image.jpg',
          type: 'image/jpeg'
        };
        // Set only the scanned image, user can add more through camera
        setUploadedImages([scannedImage]);
        setValue('productImages', [scannedImage]);
    
        if (scannedImage) {
          clearErrors('productImages');
          setImageError('');
        }
      }
      clearErrors();
    }
  }, [scanProductData, dropdownData, setValue, clearErrors, scannedBarcode, discountPercentage]);

  const handleImageUpload = (selectedImages: MediaObject[]) => {
    let finalImages;
    
    if (uploadedImages.length > 0) {
      const uniqueNewImages = selectedImages.filter(newImage => 
        !uploadedImages.some(existingImage => existingImage.uri === newImage.uri)
      );
      const scannedImages = uploadedImages.filter(img => img.name === 'scanned_product_image.jpg');
      const nonScannedImages = uploadedImages.filter(img => img.name !== 'scanned_product_image.jpg');
      const mergedImages = [...uniqueNewImages, ...nonScannedImages, ...scannedImages];
      finalImages = mergedImages.slice(0, 6);
    } else {
      finalImages = selectedImages.slice(0, 6);
    }
    
    setUploadedImages(finalImages);
    setValue('productImages', finalImages);
    
    // Check if there's at least one video
    const hasVideo = finalImages.some(media => isVideo(media));
    
    if (hasVideo && finalImages.length >= 2) {
      clearErrors('productImages');
      setImageError('');
    } else if (!hasVideo) {
      const errorMessage = 'Please upload a 360° view video of your product';
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage
      });
    } else {
      const errorMessage = `Minimum 2 media files required (1 video + at least 1 image). Currently selected: ${finalImages.length}`;
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage
      });
    }
    setIsModalVisible(false);
  };

  const validateImages = () => {
    // Check if there's at least one video
    const hasVideo = uploadedImages.some(media => isVideo(media));
    
    if (!hasVideo) {
      const errorMessage = 'Please upload a 360° view video of your product';
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage
      });
      return false;
    }
    
    // Check if there are at least 2 total media files (1 video + at least 1 image)
    if (uploadedImages.length < 2) {
      const errorMessage = `Minimum 2 media files required (1 video + at least 1 image). Currently selected: ${uploadedImages.length}`;
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
        'Please fill all required fields and upload a 360° view video plus at least 1 product image.'
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
    formData.append('platform_fee', data.platform_fee);
    formData.append('seller_final_price', data.seller_final_price);
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
        'Please fill all required fields and upload a 360° view video plus at least 1 product image.'
      );
      return;
    }
    const apiFormData = prepareFormDataForAPI(data);
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
            // Check if there's at least one video
            const hasVideo = updatedImages.some(media => isVideo(media));
            
            if (hasVideo && updatedImages.length >= 2) {
              clearErrors('productImages');
              setImageError('');
            } else if (!hasVideo) {
              const errorMessage = 'Please upload a 360° view video of your product';
              setImageError(errorMessage);
              setError('productImages', {
                type: 'manual',
                message: errorMessage
              });
            } else {
              const errorMessage = `Minimum 2 media files required (1 video + at least 1 image). Currently selected: ${updatedImages.length}`;
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
            setImageError('Please upload a 360° view video and at least 1 image');
            setError('productImages', {
              type: 'manual',
              message: 'Please upload a 360° view video and at least 1 image'
            });
          }
        }
      ]
    );
  };

  const goToNextStep = async () => {
    const isStep1Valid = await trigger(['brandName', 'productName', 'barcode', 'category', 'dimensions', 'weight', 'description']);
    const isImagesValid = validateImages();
    if (isStep1Valid && isImagesValid) {
      setCurrentStep(1);
    } else {
      console.log('Form errors:', errors);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(0);
  };

  // Render scan section with loading state
  const renderScanSection = () => {
    const getScanButtonText = () => {
      if (isScanFetching) {
        return "Loading...";
      }
      return scannedBarcode ? "Scan Again" : "Scan Now";
    };

    return (
      <View style={styles.scanSection}>
        <View style={styles.scanIconContainer}>
          <IconsSvg name="scannerIcon" />
        </View>
        <Text style={styles.scanTitle}>Scan Product Barcode</Text>
        <Text style={styles.scanSubtitle}>
          {isScanFetching 
            ? 'Loading product data...' 
            : 'Automatically fill product details by\nscanning the barcode.'
          }
        </Text>
        <WhiteButton 
          style={[styles.scanButton, isScanFetching && { opacity: 0.6 }]} 
          title={getScanButtonText()} 
          onPress={() => {
            if (!isScanFetching) {
              navigation.replace(SCREENS.BarcodeScanner);
            }
          }}
        />
        {scannedBarcode && (
          <View style={styles.scannedBarcodeContainer}>
            <Text style={styles.scannedBarcodeText}>
              Scanned: {scannedBarcode}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Step 1: Basic Product Details
  const renderStep1 = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={styles.stepContainer}
      contentContainerStyle={styles.stepContentContainer}
      nestedScrollEnabled
    >
      {renderScanSection()}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Product Details & Media</Text>
        <View style={styles.formFieldsContainer}>
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
              // Category selected
            }}
            containerStyle={styles.categoryStyle}
          />
          <Input
            control={control}
            name="dimensions"
            label={'Dimensions *'}
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
            label={'Weight *'}
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
            containerStyle={styles.descriptionContainer}
            inputProps={{
              placeholder: 'Enter Product Description...',
              multiline: true,
              textAlignVertical: 'top',
            }}
            required={{
              value: true,
              message: 'Product description is required',
            }}
            error={errors}
            maxLength={500}
            inputStyle={styles.descriptionInputStyle}
            multiline={true}
          />
        </View>
        <View style={styles.imageUploadContainer}>
          <Text style={styles.imageUploadLabel}>Product 360° Video & Images *</Text>
          <ImageUpload
            onUpload={handleUploadPress}
            title="Upload Product Media"
            subtitle={`1 video + at least 1 image (${uploadedImages.length} selected)`}
            uploadTitle={uploadedImages.length > 0 ? "Add More Images/Video" : "Upload Your Product Photos/Video"}
            uploadSubtitle={uploadedImages.length > 0 ? "Add additional images or video to your product" : "Upload a 360° view video and at least 1 product image. Minimum 720p quality."}
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
                {uploadedImages.some(media => isVideo(media)) && uploadedImages.length >= 2 && (
                  <Text style={styles.validationSuccessText}>
                    ✓ 360° video uploaded ✓ Images uploaded
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
              <View style={styles.imageActionsContainer}>
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={clearAllImages}
                >
                  <Text style={styles.clearAllButtonText}>🗑️ Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.step1Buttons}>
        
        <Button
          title="Next Step"
          style={styles.nextStepButton}
          onPress={goToNextStep}
          disabled={false}
        />
      </View>
    </ScrollView>
  );

  // Step 2: Pricing Information
  const renderStep2 = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={styles.stepContainer}
      contentContainerStyle={styles.stepContentContainer}
      nestedScrollEnabled
    >
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Pricing Information</Text>
        <View style={styles.formFieldsContainer}>
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
                
                // Calculate platform fee and seller final price when MSRP changes
                if (ProductPriceChargeData?.data?.product_price?.price_charge) {
                  const platformFeePercentage = ProductPriceChargeData.data.product_price.price_charge;
                  const priceAmount = parseFloat(amountToPay.toFixed(2));
                  
                  // Calculate platform fee (17% of price)
                  const platformFee = (priceAmount * platformFeePercentage) / 100;
                  setValue('platform_fee', platformFee.toFixed(2));
                  
                  // Calculate seller final price (price - platform fee)
                  const sellerFinalPrice = priceAmount - platformFee;
                  setValue('seller_final_price', sellerFinalPrice.toFixed(2));
                }
              }
              else {
                setValue('price', '');
                setValue('platform_fee', '');
                setValue('seller_final_price', '');
              }
            }}
          />
          <Input
            control={control}
            name="price"
            label={'Unopen Price *'}
            containerStyle={styles.emailContainer}
            inputProps={{
              placeholder: 'Enter Unopen Price',
              editable: false,
            }}
            required={{ value: true, message: 'Unopen price is required' }}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle}
            disabled
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
            required={{ value: true, message: 'Platform fees is required' }}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle}
            disabled
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
            required={{ value: true, message: 'Seller final amount is required' }}
            error={errors}
            maxLength={40}
            keyboardType={'numeric'}
            inputStyle={styles.inputStyle}
            disabled
          />
         
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
          />
          <Button
            title="Submit For Review"
            style={styles.submitReviewButton}
            onPress={handleSubmit(Submit)}
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <TitleBackHeaderContainer 
      isBack 
      title="Add Product"
      isNormalHeader={false}
    >
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={styles.stepIndicatorContainer}>
          {currentStep === 0 ? (
            <View style={[styles.stepDot, styles.stepDotActive]} />
          ) : (
            <View style={styles.stepDotComplete}>
              <Text style={styles.stepCheckIcon}>✓</Text>
            </View>
          )}
          <Text style={[styles.stepText, currentStep === 0 && styles.stepTextActive]}>Step 1</Text>
        </View>
        <View style={styles.stepIndicatorLine} />
        <View style={styles.stepIndicatorContainer}>
          <View style={[styles.stepDot, currentStep === 1 && styles.stepDotActive]} />
          <Text style={[styles.stepText, currentStep === 1 && styles.stepTextActive]}>Step 2</Text>
        </View>
      </View>

      {/* PagerView */}
      <View style={styles.pagerContainer}>
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
      </View>

      <ProductImageUpload
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        onImageSelected={handleImageUpload}
        selectedImages={uploadedImages}
      />
    </TitleBackHeaderContainer>
  );
};

export default AddProductScreen;

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
    // elevation: 5,
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
  scanSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 20,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

  },
  scanIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanTitle: {
    fontSize: fontSizes.huge,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginBottom: 12,
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: fontSizes.regular,
    color: colors.text,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  scanButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 2,
  },
  detailsSection: {
    padding: 20,
    backgroundColor: 'transparent',
    // marginHorizontal: 20,
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
    marginTop: 24,
  },
  imageUploadLabel: {
    fontSize: fontSizes.medium,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    marginBottom: 12,
  },
  imageErrorText: {
    color: '#FF3B30',
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    marginTop: 8,
    marginLeft: 5,
  },
  selectedImagesContainer: {
    marginTop: 16,
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
    marginTop: 4,
    marginLeft: 5,
  },
  step1Buttons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
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
  nextStepButton: {
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
    // elevation: 2,
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
    // elevation: 2,
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
    // elevation: 2,
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
    // elevation: 2,
  },
  selectedImagesHeader: {
    marginBottom: 16,
  },
  imagesPreviewScroll: {
    marginBottom: 16,
  },
  imagesPreviewContent: {
    paddingVertical: 6,
  },
  previewImageContainer: {
    position: 'relative',
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  videoPreviewContainer: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007bff',
    borderStyle: 'dashed',
  },
  videoPreviewIcon: {
    fontSize: fontSizes.huge,
    marginBottom: 6,
  },
  videoPreviewText: {
    fontSize: fontSizes.tiny,
    color: '#007bff',
    fontWeight: '600',
    textAlign: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
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
    // elevation: 5,
  },
  removeImageText: {
    color: 'white',
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  imageNumberBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#dc3545',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // elevation: 3,
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
    marginTop: 4,
  },
  categoryStyle: {
    marginTop: 12
  },
  scannedBarcodeText: {
    fontSize: fontSizes.small,
    color: colors.primary || '#4CAF50',
    fontFamily: fonts.medium,
    marginTop: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  scannedBarcodeContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  descriptionContainer: {
    marginTop: 24,
  },
  descriptionInputStyle: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    textAlignVertical: 'top',
    height: 120,
    paddingHorizontal: 16,
  },
  testContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  testText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  formFieldsContainer: {
    marginTop: 24,
  },
  imageActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});