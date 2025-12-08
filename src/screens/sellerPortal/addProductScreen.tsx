import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import IMAGE from '../../assets/images';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import IconsSvg from '../../assets/svg/iconsSvg';
import Input from '../../components/input/input';
import {useForm} from 'react-hook-form';
import DropdownInput from '../../components/input/dropdownInput';
import Button from '../../components/button/buttons';
import WhiteButton from '../../components/button/whiteButton';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import ImageUpload from '../../components/input/ImageUpload';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import ProductImageUpload from '../../components/model/productImageUpload';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  addProduct,
  getCategoryDetail,
  getProductPriceChargeDetail,
  getProductPriceDetail,
  getScanProductDetail,
} from '../../utils/apiAction';
import {showAlert} from '../../components/cAlert';
import {fontSizes} from '../../utils/utils';
import {IRootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import {
  calculateDiscount,
  handleError,
  handleSettled,
} from '../../utils/method';
import {showLoader} from '../../components/loader/loader';
import {image_url} from '../../utils/api';
import commonStyles from '../../utils/common-styles';

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

type AddProductScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddProductScreen
>;

const AddProductScreen: React.FC<AddProductScreenProps> = ({
  route,
  navigation,
}) => {
  const {scannedBarcode} = route.params || {};
  const [uploadedImages, setUploadedImages] = useState<MediaObject[]>([]);
  const [isNavigatingToPreview, setIsNavigatingToPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedPackageTier, setSelectedPackageTier] = useState<string>('');
  const [packageTierError, setPackageTierError] = useState<string>('');

  const userData = useSelector((user: IRootState) => user.user.userData);
  const isLogged = userData ? true : false;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageError, setImageError] = useState<string>('');
  const [dropdownData, setDropdownData] = useState<DropDownType[]>([]);
  const [scannedCategoryName, setScannedCategoryName] = useState<string>('');
  const [hasShownScanError, setHasShownScanError] = useState<boolean>(false);
  const {data: categoryData} = useQuery({
    queryKey: ['getCategoryDetail'],
    queryFn: () => getCategoryDetail(),
    enabled: isLogged,
  });
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

  const {
    data: scanProductData,
    isFetching: isScanFetching,
    error: scanError,
    isError: isScanError,
  } = useQuery({
    queryKey: ['getScanProductDetail', scannedBarcode],
    queryFn: () => getScanProductDetail(scannedBarcode as string),
    enabled: !!scannedBarcode,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  const discountPercentage = ProductPriceData?.data?.product_price?.price;

  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const sliderMin = ProductPriceData?.data?.product_price?.price;
  const sliderMax = 90;

  useEffect(() => {
    if (typeof discountPercentage === 'number') {
      const clampedValue = Math.max(
        sliderMin,
        Math.min(sliderMax, discountPercentage),
      );
      setDiscountPercent(clampedValue);
    }
  }, [discountPercentage, sliderMin, sliderMax]);

  const TIER_1_RETAILERS = [
    'walmart.com',
    'target.com',
    'bestbuy.com',
    'costco.com',
    'homedepot.com',
  ];
  const TIER_2_RETAILERS = [
    'macys.com',
    'kohls.com',
    'staples.com',
    'dickssportinggoods.com',
    'sephora.com',
    'ulta.com',
  ];

  const PACKAGE_TIERS = [
    {
      id: 'small',
      title: 'Small',
      displayCm: '20×15×2 cm',
      dimsInches: {l: '12', w: '9', h: '2'},
      color: '#4F7BFF',
      description: '≤ 2 lb (0.9 kg)',
      image: IMAGE.smallBox,
      typicalItem: 'Tees, small apparel, accessories, phone cases',
    },
    {
      id: 'medium',
      title: 'Medium',
      displayCm: '30×25×20 cm',
      dimsInches: {l: '14', w: '10', h: '5'},
      color: '#2CC36B',
      description: '≤ 5 lb (2.3 kg)',
      image: IMAGE.mediumBox,
      typicalItem: 'Sneakers, headphones, small gadgets',
    },
    {
      id: 'large',
      title: 'Large',
      displayCm: '45×35×30 cm',
      dimsInches: {l: '18', w: '12', h: '8'},
      color: '#F58020',
      description: '≤ 12 lb (5.4 kg)',
      image: IMAGE.largeBox,
      typicalItem: 'Mid-size electronics, LEGO sets, small kitchenware',
    },
    {
      id: 'extra_large',
      title: 'XL',
      displayCm: '60×50×40 cm',
      dimsInches: {l: '22', w: '14', h: '10'},
      color: '#E74C3C',
      description: '≤ 20 lb (9.1 kg)',
      image: IMAGE.xlBox,
      typicalItem: 'Consoles + controllers, larger appliances (compact)',
    },
  ] as const;

  const calculateMSRP = (productData: any): number => {
    if (!productData.offers || productData.offers.length === 0) {
      return productData.highest_recorded_price || 0;
    }

    const validOffers = productData.offers.filter((offer: any) => {
      const domain = offer.domain?.toLowerCase() || '';
      const merchant = offer.merchant?.toLowerCase() || '';
      if (merchant.includes('marketplace')) {
        return false;
      }

      return true;
    });

    const tier1Offers = validOffers.filter((offer: any) =>
      TIER_1_RETAILERS.some(retailer =>
        offer.domain?.toLowerCase().includes(retailer),
      ),
    );

    if (tier1Offers.length > 0) {
      const tier1Prices = tier1Offers
        .map((offer: any) => offer.list_price || offer.price)
        .filter((price: any) => price && price > 0);

      if (tier1Prices.length > 0) {
        const average =
          tier1Prices.reduce((sum: number, price: number) => sum + price, 0) /
          tier1Prices.length;
        return Math.round(average * 100) / 100;
      }
    }

    const tier2Offers = validOffers.filter((offer: any) =>
      TIER_2_RETAILERS.some(retailer =>
        offer.domain?.toLowerCase().includes(retailer),
      ),
    );

    if (tier2Offers.length > 0) {
      const tier2Prices = tier2Offers
        .map((offer: any) => offer.list_price || offer.price)
        .filter((price: any) => price && price > 0);

      if (tier2Prices.length > 0) {
        const average =
          tier2Prices.reduce((sum: number, price: number) => sum + price, 0) /
          tier2Prices.length;
        return Math.round(average * 100) / 100;
      }
    }

    const marketplaceOffers = validOffers.filter((offer: any) => {
      const domain = offer.domain?.toLowerCase() || '';
      const merchant = offer.merchant?.toLowerCase() || '';

      if (
        domain.includes('amazon.com') &&
        merchant.includes('amazon') &&
        !merchant.includes('marketplace')
      ) {
        return true;
      }

      return false;
    });

    if (marketplaceOffers.length > 0) {
      const marketplacePrices = marketplaceOffers
        .map((offer: any) => offer.list_price || offer.price)
        .filter((price: any) => price && price > 0);

      if (marketplacePrices.length > 0) {
        const maxPrice = Math.max(...marketplacePrices);
        return maxPrice;
      }
    }

    const allListPrices = validOffers
      .map((offer: any) => offer.list_price)
      .filter((price: any) => price && price > 0);

    if (allListPrices.length > 0) {
      const maxListPrice = Math.max(...allListPrices);
      return maxListPrice;
    }

    return productData.highest_recorded_price || 0;
  };

  const transformCategoryData = (apiData: any): DropDownType[] => {
    if (apiData?.status === 'success' && apiData?.data?.category) {
      const transformed = apiData.data.category
        .filter((category: any) => category.status === 'active')
        .map((category: any) => ({
          id: category.id.toString(),
          name: category.name,
        }));
      return transformed;
    }
    return [];
  };
  const {
    control,
    reset,
    formState: {errors},
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    trigger,
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
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
      package_dimension_length: '',
      package_dimension_width: '',
      package_dimension_height: '',
      productImages: [],
    },
  });

  useEffect(() => {
    const activeTier = PACKAGE_TIERS.find(t => t.id === selectedPackageTier);
    if (activeTier) {
      setValue('package_dimension_length', activeTier.dimsInches.l);
      setValue('package_dimension_width', activeTier.dimsInches.w);
      setValue('package_dimension_height', activeTier.dimsInches.h);
      clearErrors([
        'package_dimension_length',
        'package_dimension_width',
        'package_dimension_height',
      ]);
    }
  }, [selectedPackageTier, setValue, clearErrors]);

  useEffect(() => {
    if (categoryData) {
      const transformedData = transformCategoryData(categoryData);
      setDropdownData(transformedData);

      const currentCategory = getValues('category');
      if (!currentCategory && transformedData.length > 0) {
        setError('category', {
          type: 'manual',
          message: 'Category is required',
        });
      }
    }
  }, [categoryData, getValues, setError]);

  useEffect(() => {
    const subscription = watch((value, {name}) => {
      if (name === 'category') {
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

  const watchedFields = watch([
    'brandName',
    'productName',
    'barcode',
    'category',
    'package_dimension_length',
    'package_dimension_width',
    'package_dimension_height',
    'description',
  ]);

  const isStep1Complete = () => {
    const [
      brandName,
      productName,
      barcode,
      category,
      length,
      width,
      height,
      description,
    ] = watchedFields;

    const allFieldsFilled =
      brandName?.trim() &&
      productName?.trim() &&
      barcode?.trim() &&
      category &&
      length?.trim() &&
      width?.trim() &&
      height?.trim() &&
      description?.trim();

    const hasVideo = uploadedImages.some(media => isVideo(media));
    const hasValidImages = hasVideo && uploadedImages.length >= 2;

    const isPackageTierSelected = selectedPackageTier !== '';

    return allFieldsFilled && hasValidImages && isPackageTierSelected;
  };

  useEffect(() => {
    // Reset error state when barcode changes
    if (scannedBarcode) {
      setHasShownScanError(false);
    }
  }, [scannedBarcode]);

  useEffect(() => {
    // Handle scan errors (timeout, network error, or API error)
    if (
      scannedBarcode &&
      !isScanFetching &&
      !hasShownScanError &&
      (isScanError ||
        !scanProductData?.data?.product ||
        (scanProductData?.data?.product &&
          !scanProductData.data.product.title &&
          !scanProductData.data.product.brand))
    ) {
      setHasShownScanError(true);
      const errorMessage = scanError?.message || '';
      const errorCode = (scanError as any)?.code || '';
      const isTimeoutError =
        errorMessage.toLowerCase().includes('timeout') ||
        errorCode === 'ECONNABORTED' ||
        errorMessage.toLowerCase().includes('network');

      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Failed to Get Product Information',
        description: isTimeoutError
          ? 'Request timed out. Failed to get information, please scan again or add manually'
          : 'Failed to get information, please scan again or add manually',
        doneText: 'Okay',
        onDonePress: () => {},
      });
      return;
    }

    if (scanProductData?.data?.product) {
      const productData = scanProductData.data.product;
      const scannedCategory = productData.category;

      setScannedCategoryName(scannedCategory || '');

      if (
        scannedCategory &&
        scannedCategory.toLowerCase().includes('food') &&
        scannedCategory.toLowerCase().includes('tobacco')
      ) {
        setValue('category', '');
        setScannedCategoryName('');
        setError('category', {
          type: 'manual',
          message: 'Category is required',
        });
      } else if (scannedCategory && dropdownData.length > 0) {
        const primaryCategory =
          scannedCategory.split('>')[0]?.trim() || scannedCategory;

        const matchedCategory = dropdownData.find(cat => {
          const catNameLower = cat.name.toLowerCase();
          const primaryCategoryLower = primaryCategory.toLowerCase();

          return (
            catNameLower === primaryCategoryLower ||
            catNameLower.includes(primaryCategoryLower) ||
            primaryCategoryLower.includes(catNameLower)
          );
        });

        if (matchedCategory) {
          setValue('category', matchedCategory);
          clearErrors('category');
        } else {
          // If no category match found, set error to show validation message
          setError('category', {
            type: 'manual',
            message: 'Category is required',
          });
        }
      }

      setValue('brandName', productData.brand || '');
      setValue('productName', productData.title || '');
      setValue(
        'barcode',
        productData.ean || productData.upc || scannedBarcode || '',
      );

      const msrpValue = calculateMSRP(productData);
      setValue('msrp', msrpValue > 0 ? msrpValue.toString() : '');

      if (msrpValue && typeof discountPercent === 'number') {
        const {amountToPay} = calculateDiscount(msrpValue, discountPercent);
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
      } else {
        setValue('price', '');
        setValue('platform_fee', '');
        setValue('seller_final_price', '');
      }

      setValue('description', productData.description || '');

      if (productData.dimension) {
        const cleanDimension = productData.dimension
          .replace(/\s*inches?/i, '')
          .trim();
        const dimensionParts = cleanDimension
          .split(/[xX]/)
          .map((part: string) => part.trim());

        if (dimensionParts.length >= 3) {
          setValue('package_dimension_length', dimensionParts[0] || '');
          setValue('package_dimension_width', dimensionParts[1] || '');
          setValue('package_dimension_height', dimensionParts[2] || '');
        } else if (dimensionParts.length === 1) {
          setValue('package_dimension_length', dimensionParts[0] || '');
          setValue('package_dimension_width', '');
          setValue('package_dimension_height', '');
        } else {
          setValue('package_dimension_length', '');
          setValue('package_dimension_width', '');
          setValue('package_dimension_height', '');
        }
      } else {
        setValue('package_dimension_length', '');
        setValue('package_dimension_width', '');
        setValue('package_dimension_height', '');
      }

      // setValue(
      //   'weight',
      //   productData.weight ? productData.weight.toString() : '',
      // );

      if (productData.images && productData.images.length > 0) {
        setUploadedImages([]);
        setValue('productImages', []);

        const firstImageUrl = productData.images[0]
          ? productData.images[0]
          : productData.images;

        const handleRemoteImage = async (url: string) => {
          try {
            const scannedImage: MediaObject = {
              uri: url,
              name: 'scanned_product_image.jpg',
              type: 'image/jpeg',
            };

            setUploadedImages([scannedImage]);
            setValue('productImages', [scannedImage]);
            clearErrors('productImages');
            setImageError('');
          } catch (error) {
            const scannedImage: MediaObject = {
              uri: url,
              name: 'scanned_product_image.jpg',
              type: 'image/jpeg',
            };
            setUploadedImages([scannedImage]);
            setValue('productImages', [scannedImage]);
            clearErrors('productImages');
            setImageError('');
          }
        };

        if (firstImageUrl.startsWith('http')) {
          handleRemoteImage(firstImageUrl);
        } else {
          const scannedImage: MediaObject = {
            uri: firstImageUrl,
            name: 'scanned_product_image.jpg',
            type: 'image/jpeg',
          };
          setUploadedImages([scannedImage]);
          setValue('productImages', [scannedImage]);
          clearErrors('productImages');
          setImageError('');
        }
      }

      clearErrors();
      // Reset error state on successful data fetch
      if (scanProductData?.data?.product) {
        setHasShownScanError(false);
      }
    }
  }, [
    scanProductData,
    dropdownData,
    setValue,
    clearErrors,
    scannedBarcode,
    discountPercentage,
    ProductPriceChargeData,
    isScanFetching,
    isScanError,
    scanError,
    hasShownScanError,
  ]);

  const handleImageUpload = (selectedImages: MediaObject[]) => {
    let finalImages;

    if (uploadedImages.length > 0) {
      const uniqueNewImages = selectedImages.filter(
        newImage =>
          !uploadedImages.some(
            existingImage => existingImage.uri === newImage.uri,
          ),
      );
      const scannedImages = uploadedImages.filter(
        img => img.name === 'scanned_product_image.jpg',
      );
      const nonScannedImages = uploadedImages.filter(
        img => img.name !== 'scanned_product_image.jpg',
      );
      const mergedImages = [
        ...uniqueNewImages,
        ...nonScannedImages,
        ...scannedImages,
      ];
      finalImages = mergedImages.slice(0, 6);
    } else {
      finalImages = selectedImages.slice(0, 6);
    }

    setUploadedImages(finalImages);
    setValue('productImages', finalImages);

    const hasVideo = finalImages.some(media => isVideo(media));

    if (hasVideo && finalImages.length >= 2) {
      clearErrors('productImages');
      setImageError('');
    } else if (!hasVideo) {
      const errorMessage = 'Please upload a 360° view video of your product';
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage,
      });
    } else {
      const errorMessage = `Minimum 2 media files required (1 video + at least 1 image). Currently selected: ${finalImages.length}`;
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage,
      });
    }
    setIsModalVisible(false);
  };

  const validateImages = () => {
    const hasVideo = uploadedImages.some(media => isVideo(media));

    if (!hasVideo) {
      const errorMessage = 'Please upload a 360° view video of your product';
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage,
      });
      return false;
    }

    if (uploadedImages.length < 2) {
      const errorMessage = `Minimum 2 media files required (1 video + at least 1 image). Currently selected: ${uploadedImages.length}`;
      setImageError(errorMessage);
      setError('productImages', {
        type: 'manual',
        message: errorMessage,
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
    const isPackageTierSelected = selectedPackageTier !== '';

    if (!isPackageTierSelected) {
      setPackageTierError('Please select a product size');
    } else {
      setPackageTierError('');
    }

    return isFormValid && isImagesValid && isPackageTierSelected;
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
    setIsNavigatingToPreview(true);
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

    setIsNavigatingToPreview(false);
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
      formData.append('images', {
        uri: media.uri,
        name: media.name || `image_${index}.jpg`,
        type: media.type || 'image/jpeg',
      });
    });

    return formData;
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
          setUploadedImages([]);
          setImageError('');
          setScannedCategoryName('');
          setSelectedPackageTier('');
          setPackageTierError('');
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

  const handleUploadPress = () => {
    setIsModalVisible(true);
  };

  const isVideo = (mediaObj: MediaObject) => {
    return mediaObj.type && mediaObj.type.includes('video');
  };

  const removeImage = (index: number) => {
    Alert.alert('Remove Media', 'Are you sure you want to remove this media?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updatedImages = uploadedImages.filter((_, i) => i !== index);
          setUploadedImages(updatedImages);
          setValue('productImages', updatedImages);
          const hasVideo = updatedImages.some(media => isVideo(media));

          if (hasVideo && updatedImages.length >= 2) {
            clearErrors('productImages');
            setImageError('');
          } else if (!hasVideo) {
            const errorMessage =
              'Please upload a 360° view video of your product';
            setImageError(errorMessage);
            setError('productImages', {
              type: 'manual',
              message: errorMessage,
            });
          } else {
            const errorMessage = `Minimum 2 media files required (1 video + at least 1 image). Currently selected: ${updatedImages.length}`;
            setImageError(errorMessage);
            setError('productImages', {
              type: 'manual',
              message: errorMessage,
            });
          }
        },
      },
    ]);
  };

  const clearAllImages = () => {
    Alert.alert(
      'Clear All Media',
      'Are you sure you want to remove all selected media?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setUploadedImages([]);
            setValue('productImages', []);
            setImageError(
              'Please upload a 360° view video and at least 1 image',
            );
            setError('productImages', {
              type: 'manual',
              message: 'Please upload a 360° view video and at least 1 image',
            });
          },
        },
      ],
    );
  };

  const goToNextStep = async () => {
    const isStep1Valid = await trigger([
      'brandName',
      'productName',
      'barcode',
      'category',
      'package_dimension_length',
      'package_dimension_width',
      'package_dimension_height',
      'description',
    ]);
    const isImagesValid = validateImages();
    const isPackageTierSelected = selectedPackageTier !== '';

    if (!isPackageTierSelected) {
      setPackageTierError('Please select a product size');
    } else {
      setPackageTierError('');
    }

    if (isStep1Valid && isImagesValid && isPackageTierSelected) {
      setCurrentStep(1);
    } else {
      const currentCategory = getValues('category');
      if (!currentCategory) {
        setError('category', {
          type: 'manual',
          message: 'Category is required',
        });
      }
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(0);
  };

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

  const renderScanSection = () => {
    const getScanButtonText = () => {
      if (isScanFetching) {
        return 'Loading...';
      }
      return scannedBarcode ? 'Scan Again' : 'Scan Now';
    };

    const hasScanError =
      scannedBarcode &&
      !isScanFetching &&
      (isScanError ||
        !scanProductData?.data?.product ||
        (scanProductData?.data?.product &&
          !scanProductData.data.product.title &&
          !scanProductData.data.product.brand));

    return (
      <View style={styles.scanSection}>
        <View style={styles.scanIconContainer}>
          <IconsSvg name="scannerIcon" />
        </View>
        <Text style={styles.scanTitle}>Scan Product Barcode</Text>
        <Text style={styles.scanSubtitle}>
          {isScanFetching
            ? 'Loading product data...'
            : hasScanError
            ? 'Failed to get information, please scan again or add manually'
            : 'Automatically fill product details by\nscanning the barcode.'}
        </Text>
        <WhiteButton
          style={[styles.scanButton, isScanFetching && {opacity: 0.6}]}
          title={getScanButtonText()}
          onPress={() => {
            if (!isScanFetching) {
              navigation.navigate(SCREENS.BarcodeScanner);
            }
          }}
        />
        {scannedBarcode && (
          <View style={styles.scannedBarcodeContainer}>
            <Text
              style={[
                styles.scannedBarcodeText,
                hasScanError && styles.scannedBarcodeError,
              ]}>
              {hasScanError
                ? `Scanned: ${scannedBarcode} (Failed to fetch data)`
                : `Scanned: ${scannedBarcode}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderStep1 = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.stepContainer}
      contentContainerStyle={styles.stepContentContainer}
      nestedScrollEnabled>
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
            required={{value: true, message: 'Brand name is required'}}
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
            required={{value: true, message: 'Product name is required'}}
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
            required={{value: true, message: 'Barcode is required'}}
            error={errors}
            maxLength={40}
            inputStyle={styles.inputStyle}
          />
          <DropdownInput
            control={control}
            name="category"
            label="Select Category *"
            data={dropdownData}
            placeholder={
              scannedCategoryName
                ? `Scanned: ${scannedCategoryName} - Please select or confirm`
                : 'Choose a category...'
            }
            isSearch={true}
            valueField="id"
            labelField="name"
            required={{value: true, message: 'Category is required'}}
            error={errors}
            onChangeValue={selectedItem => {
              // Category selected - clear error immediately
              setValue('category', selectedItem);
              clearErrors('category');
            }}
            containerStyle={styles.categoryStyle}
          />
          <Text style={styles.label}>{'Select Product Size *'}</Text>
          <View style={styles.packageGridContainer}>
            {PACKAGE_TIERS.map(tier => {
              const isSelected = selectedPackageTier === tier.id;
              return (
                <TouchableOpacity
                  key={tier.id}
                  activeOpacity={0.9}
                  style={[
                    styles.packageCard,
                    {backgroundColor: colors.white},

                    isSelected && styles.packageCardSelected,
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedPackageTier('');
                      setValue('package_dimension_length', '');
                      setValue('package_dimension_width', '');
                      setValue('package_dimension_height', '');
                      setPackageTierError('Please select a product size');
                      setError('package_dimension_length', {
                        type: 'manual',
                        message: 'Package dimensions are required',
                      });
                      setError('package_dimension_width', {
                        type: 'manual',
                        message: 'Package dimensions are required',
                      });
                      setError('package_dimension_height', {
                        type: 'manual',
                        message: 'Package dimensions are required',
                      });
                    } else {
                      setSelectedPackageTier(tier.id);
                      setValue('package_dimension_length', tier.dimsInches.l);
                      setValue('package_dimension_width', tier.dimsInches.w);
                      setValue('package_dimension_height', tier.dimsInches.h);
                      clearErrors([
                        'package_dimension_length',
                        'package_dimension_width',
                        'package_dimension_height',
                      ]);
                      setPackageTierError('');
                    }
                  }}>
                  <View
                    style={[
                      styles.packageIconWrap,
                      {backgroundColor: tier.color},
                    ]}>
                    <Image source={tier?.image} style={styles.packageIcon} />
                  </View>
                  <Text style={styles.packageTitle}>{tier.title}</Text>
                  <Text style={styles.packageSubtitle}>{tier.description}</Text>
                  <Text style={styles.packageSubtitle}>{tier.typicalItem}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {packageTierError ? (
            <Text style={commonStyles.error}>{packageTierError}</Text>
          ) : null}

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
          <Text style={styles.imageUploadLabel}>
            Product 360° Video & Images *
          </Text>
          <ImageUpload
            onUpload={handleUploadPress}
            title="Upload Product Media"
            subtitle={`1 video + at least 1 image (${uploadedImages.length} selected)`}
            uploadTitle={
              uploadedImages.length > 0
                ? 'Add More Images/Video'
                : 'Upload Your Product Photos/Video'
            }
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
                {uploadedImages.some(media => isVideo(media)) &&
                  uploadedImages.length >= 2 && (
                    <Text style={styles.validationSuccessText}>
                      ✓ 360° video uploaded ✓ Images uploaded
                    </Text>
                  )}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagesPreviewScroll}
                contentContainerStyle={styles.imagesPreviewContent}>
                {uploadedImages.map((mediaObj, index) => {
                  return (
                    <View key={index} style={styles.previewImageContainer}>
                      {isVideo(mediaObj) ? (
                        <View style={styles.videoPreviewContainer}>
                          <Text style={styles.videoPreviewIcon}>🎥</Text>
                          <Text style={styles.videoPreviewText}>
                            Video {index + 1}
                          </Text>
                          <Text style={styles.videoFileName} numberOfLines={1}>
                            {mediaObj.name}
                          </Text>
                        </View>
                      ) : (
                        <Image
                          source={{
                            uri: mediaObj.uri.startsWith('http')
                              ? mediaObj.uri
                              : image_url + mediaObj.uri,
                          }}
                          style={styles.previewImage}
                          resizeMode="cover"
                          onError={error => {}}
                          onLoad={() => {}}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}>
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                      <View style={styles.imageNumberBadge}>
                        <Text style={styles.imageNumberText}>{index + 1}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
              <View style={styles.imageActionsContainer}>
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={clearAllImages}>
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
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
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
                sliderLength={300}
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
  );

  return (
    <TitleBackHeaderContainer
      isBack={true}
      title="Add Product"
      isNormalHeader={false}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepIndicatorContainer}>
          {currentStep === 0 ? (
            <View style={[styles.stepDot, styles.stepDotActive]} />
          ) : (
            <View style={styles.stepDotComplete}>
              <Text style={styles.stepCheckIcon}>✓</Text>
            </View>
          )}
          <Text
            style={[
              styles.stepText,
              currentStep === 0 && styles.stepTextActive,
            ]}>
            Step 1
          </Text>
        </View>
        <View style={styles.stepIndicatorLine} />
        <View style={styles.stepIndicatorContainer}>
          <View
            style={[styles.stepDot, currentStep === 1 && styles.stepDotActive]}
          />
          <Text
            style={[
              styles.stepText,
              currentStep === 1 && styles.stepTextActive,
            ]}>
            Step 2
          </Text>
        </View>
      </View>

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
  productDesc: {
    fontSize: fontSizes.regular,
    minHeight: 100,
    paddingVertical: 12,
    borderRadius: 16,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    width: '100%',
    textAlignVertical: 'top',
  },
  inputStyle: {
    width: '100%',
  },
  inputStyle2: {
    width: '100%',
    backgroundColor: colors.primary,
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
    // paddingVertical: 16,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginTop: 12,
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
  scannedBarcodeError: {
    color: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
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
  dimensionContainer: {
    marginTop: 24,
  },
  dimensionLabel: {
    fontSize: fontSizes.medium,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    marginBottom: 12,
  },
  dimensionInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dimensionInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  dimensionInputStyle: {
    width: '100%',
    textAlign: 'center',
  },
  xLabel: {
    fontSize: fontSizes.medium,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
    marginHorizontal: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  imageActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  packageGridContainer: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packageCard: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  packageCardSelected: {
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderWidth: 2,
  },
  packageIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  packageIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  packageTitle: {
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    fontSize: fontSizes.small,
    textAlign: 'center',
  },
  packageSubtitle: {
    marginTop: 2,
    color: colors.primaryBlack,
    fontFamily: fonts.medium,
    fontSize: fontSizes.small,
    textAlign: 'center',
  },
  label: {
    fontWeight: '500',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.label,
    marginTop: 20,
  },
});
