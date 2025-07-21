import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
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
import { categoryOptions } from '../../utils/static';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.AddProductScreen
>;

const AddProductScreen: React.FC<LoginProps> = ({route, navigation}) => {
  const [brand, setBrand] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [msrp, setMsrp] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const {
    control,
    formState: {errors},
    handleSubmit,
    watch,
    getValues,
  } = useForm<any>();

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Books',
    'Home & Garden',
    'Sports',
  ];

  const handleScanBarcode = () => {
    Alert.alert(
      'Barcode Scanner',
      'Barcode scanning functionality would be implemented here',
    );
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Image Upload',
      'Image upload functionality would be implemented here',
    );
  };

  const handlePreview = () => {
    Alert.alert(
      'Preview',
      'Product preview functionality would be implemented here',
    );
  };

  const Submit = () => {
    if (!brand || !productName || !category || !msrp || !price) {
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
            name="brandName"
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
            onUpload={handleImageUpload}
            title="Upload Product Images"
            subtitle="Min 2 images or 1 video"
            uploadTitle="Upload Your Product Photo"
            uploadSubtitle="Minimum 720p quality. Ensure file is not\ncorrupted or blurred."
          />
        </View>
        <View style={styles.bottomButtons}>
        <WhiteButton title="Preview & Confirm" 
        style={styles.submitButton} 
        />
        <Button title="Submit For Review" 
        style={styles.submitReviewButton} 
        />

        <View style={{height: 130}} />
      </View>
  
    
    </TitleBackHeaderContainer>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emailContainer: {
    marginTop: 20,
  },
  inputStyle: {
    width: '100%',
  },

  scrollView: {
    flex: 1,
  },
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
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.primaryBlack,
    fontFamily: fonts.bold,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '500',
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.label,
    marginBottom: 8,
  },

  textArea: {
    height: 100,
    paddingTop: 15,
  },

  uploadSection: {
    marginTop: 10,
    width: '100%',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  uploadArea: {
    borderWidth: 1.2,
    borderColor: '#B3B3B3',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadIconText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
  },
  uploadTitle: {
    fontSize: 18,
    color: colors.primaryBlack,
    marginBottom: 8,
    fontFamily: fonts.bold,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: fonts.medium,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent:'space-between',
    marginHorizontal:10,
    paddingBottom:50
  },

  submitButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  submitReviewButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginHorizontal: 0,
    
  },
});
