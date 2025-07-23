import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
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
import {useForm} from 'react-hook-form';
import DropdownInput from '../../components/input/dropdownInput';
import Button from '../../components/button/buttons';
import WhiteButton from '../../components/button/whiteButton';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import ImageUpload from '../../components/input/ImageUpload';
import {categoryOptions} from '../../utils/static';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import { useFocusEffect } from '@react-navigation/native';

type FormData = {
  brandName: string;
  productName: string;
  category: string;
  msrp: string;
  price: string;
  description: string;
};

type AddProductScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddProductScreen
>;

const AddProductScreen: React.FC<AddProductScreenProps> = ({
  route,
  navigation,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isNavigatingToPreview, setIsNavigatingToPreview] = useState(false);
console.log("isNavigatingToPreview", isNavigatingToPreview);

  const {
    control,
    reset,
    formState: {errors},
    handleSubmit,
    getValues,
  } = useForm<FormData>();

  // Reset form and images if navigating away and not going to PreviewConfirm
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (!isNavigatingToPreview) {
          reset(); // Reset form fields
          setUploadedImages([]); // Clear uploaded images
        }
      };
    }, [isNavigatingToPreview, reset]),
  );

  const handlePreviewAndConfirm = () => {
    setIsNavigatingToPreview(true);
    const formData = getValues();
    const categoryValue =
      typeof formData.category === 'object'
        ? formData?.category?.name || formData?.category?.value
        : formData.category;

    const productData = {
      name: formData.productName,
      brand: formData.brandName,
      category: categoryValue,
      msrp: `$${formData.msrp}`,
      listingPrice: `$${formData.price}`,
      description: formData.description || 'No description provided',
      images:
        uploadedImages.length > 0
          ? uploadedImages
          : [
              'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
            ],
      sku: 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };

    navigation.navigate(SCREENS.PreviewConfirmScreen, {productData});
    setIsNavigatingToPreview(false);
  };

  const Submit = () => {
    const formData = getValues();
    if (
      !formData.brandName ||
      !formData.productName ||
      !formData.category ||
      !formData.msrp ||
      !formData.price
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    Alert.alert('Success', 'Product submitted for review');
  };

  return (
    <TitleBackHeaderContainer isBack title="Add Product">
      <View style={styles.scanSection}>
        <IconsSvg name="scannerIcon" />
        <Text style={styles.scanTitle}>Scan Product Barcode</Text>
        <Text style={styles.scanSubtitle}>
          Automatically fill product details by{'\n'}scanning the barcode.
        </Text>
        <WhiteButton style={styles.scanButton} title="Scan Now" />
      </View>

      {/* Product Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Product Details & Media</Text>
        <Input
          control={control}
          name="brandName"
          label={'Brand'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Brand Name',
          }}
          required={{value: true, message: 'Please enter brand name'}}
          error={errors}
          maxLength={40}
          inputStyle={styles.inputStyle}
        />
        <Input
          control={control}
          name="productName"
          label={'Product Name'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Product Name',
          }}
          required={{value: true, message: 'Please enter product name'}}
          error={errors}
          maxLength={40}
          inputStyle={styles.inputStyle}
        />
        <DropdownInput
          control={control}
          name="category"
          label="Select Category"
          error={errors}
          required="Category is required"
          placeholder="Choose a category"
          data={categoryOptions}
          valueField="value"
          labelField="name"
          onChangeValue={selectedItem => {
            console.log('Selected:', selectedItem);
          }}
          containerStyle={styles.emailContainer}
        />
        <Input
          control={control}
          name="msrp"
          label={'MSRP'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter MSRP',
          }}
          required={{value: true, message: 'Please enter MSRP'}}
          error={errors}
          maxLength={40}
          keyboardType={'numeric'}
          inputStyle={styles.inputStyle}
        />
        <Input
          control={control}
          name="price"
          label={'Price'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Price',
          }}
          required={{value: true, message: 'Please enter Price'}}
          error={errors}
          maxLength={40}
          keyboardType={'numeric'}
          inputStyle={styles.inputStyle}
        />
        <Input
          control={control}
          name="description"
          label={'Product Description'}
          containerStyle={styles.emailContainer}
          inputProps={{
            placeholder: 'Enter Product Description...',
          }}
          required={{
            value: true,
            message: 'Please enter product description',
          }}
          error={errors}
          maxLength={200}
          inputStyle={styles.inputStyle}
          multiline
        />
        <ImageUpload
          onUpload={() => {}}
          title="Upload Product Images"
          subtitle="Min 2 images or 1 video"
          uploadTitle="Upload Your Product Photo"
          uploadSubtitle="Minimum 720p quality. Ensure file is not corrupted or blurred."
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
          onPress={Submit}
        />
        <View style={{height: 130}} />
      </View>
    </TitleBackHeaderContainer>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  // Your existing styles here
  scanSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },
  scanTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    marginBottom: 10,
  },
  scanSubtitle: {
    fontSize: 14,
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
    fontSize: 18,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
  },
  emailContainer: {
    marginTop: 20,
  },
  inputStyle: {
    width: '100%',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent:'space-between',
    marginHorizontal:10,
    paddingBottom:50,
    alignSelf:"center"
  },
  submitButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginEnd:10
  },
  submitReviewButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginHorizontal: 0,
  },
});