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
import React, { useState, useRef } from 'react';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import Button from '../../components/button/buttons';
import OrderSuccessfulModal from '../../components/model/orderSuccessfulModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProductDetailByID, getWalletDetail, soldProduct } from '../../utils/apiAction';
import { image_url } from '../../utils/api';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { showLoader } from '../../components/loader/loader';
import { handleError, handleSettled } from '../../utils/method';

const { width } = Dimensions.get('window');

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ConfirmYourOrderScreen
>;

const ConfirmYourOrderScreen: React.FC<LoginProps> = ({ navigation,route }) => {
  const { productId } = route?.params;
  const userData = useSelector((user: IRootState) => user.user.userData);
  const [quantity, setQuantity] = useState(4);
  const [walletBalance, setWalletBalance] = useState(2430.00);
  const [isSelected, setIsSelected] = useState(true);
  const itemPrice = 350;
  const totalPrice = itemPrice * quantity;
  const [isModalVisible, setModalVisible] = useState(false);
  const { data: allProductList, refetch: refetchAllProduct } = useQuery({
    queryKey: ['getProductDetailByID', productId],
    queryFn: () => getProductDetailByID(productId),
  });
  const { data: walletData, refetch: refetchWalletDetail } = useQuery({
    queryKey: ['getWalletDetail'],
    queryFn: () => getWalletDetail(),
    enabled: !!userData, 
  });
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  const { mutate } = useMutation({
    mutationFn: (productId: string | number | null | undefined) => soldProduct(productId),
    onSuccess: (data) => {
      showLoader(false);
      setModalVisible(true);
    },
    onError: handleError,
    onSettled: handleSettled,
  });
  
  const handleBuyNow = () => {
    showLoader(true); 
    mutate(productId);
  };
  const modalSucesss = () => {
    setModalVisible(false);
    navigation.navigate(SCREENS.MyOrderScreen);
  };
  return (
    <TitleBackHeaderContainer title="Confirm Your Order" isBack>
      <View style={styles.productSection}>
        <View style={styles.productContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image_url + allProductList?.data?.product[0]?.product_image[0].image  }}
              style={styles.productImage}
            />
            {/* <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                style={[styles.quantityButton, styles.minusButton]}
              >
                <Text style={styles.minusText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={increaseQuantity}
                style={[styles.quantityButton, styles.plusButton]}
              >
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>
             {allProductList?.data?.product[0]?.name}
            </Text>
            <Text style={styles.productPrice}>
              ${totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Billing Address</Text>
          <TouchableOpacity>
            <Text style={styles.changeButton}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.addressCard}>
          <View style={styles.personInfo}>
            <Text style={styles.personName}>Person Name</Text>
            <Text style={styles.phoneNumber}>{userData?.phone_number}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.addressInfo}>
            <IconsSvg
              name='locationIcon'
            />
            <Text style={styles.addressText}>
              {userData?.address}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Estimated Delivery</Text>
        <View style={styles.summaryDivider} />
        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryDate}>
            On or before 30 Feb, 2025
          </Text>
        </View>
      </View>
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Payment mode</Text>
        <View style={styles.summaryDivider} />
        <View style={styles.paymentCard}>
          <View style={styles.walletInfo}>
            <TouchableOpacity
              style={[
                styles.radioOuter,
                { borderColor: isSelected ? '#31AD52' : '#E0E0E0' }
              ]}
              onPress={() => setIsSelected(!isSelected)}
            >
              {isSelected && <View style={styles.radioInner} />}
            </TouchableOpacity>
            <View style={styles.walletDetails}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>
              {"$" + (walletData?.data?.wallet?.amount || "0.00")}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.addFundButton}>Add Fund</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buyContainer}>
        <Button title='Confirm Purchase' onPress={handleBuyNow} />
      </View>
      <OrderSuccessfulModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        onSubmit={modalSucesss}
        onContinue={() => navigation.navigate(SCREENS.BottomTab)}
        title="Are You Sure?"
        description="Please confirm you want to Delete."
      />
    </TitleBackHeaderContainer>
  );
};

export default ConfirmYourOrderScreen;

const styles = StyleSheet.create({
  buyContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  productSection: {
    backgroundColor: colors.white,
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: 'center',
    borderRadius: 12
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  quantityControls: {
    position: 'absolute',
    bottom: -10,
    justifyContent: 'center',
    right: 5,
    left: 6,
    // alignSelf:'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EAECEB',
    borderRadius: 20,
    paddingHorizontal: 4,
    height: 32,
    width: 77
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusButton: {
    backgroundColor: colors.background,
  },
  plusButton: {
    backgroundColor: colors.primary,
  },
  minusText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  plusText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  quantityText: {
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: fontSizes.regular,
    color: colors.text2,
    fontFamily: fonts.bold,
    marginBottom: 8,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.bold,
    color: '#212121',
  },
  changeButton: {
    color: '#239C43',
    fontWeight: '600',
    fontFamily: fonts.bold,
    fontSize: fontSizes.medium,
    borderBottomColor: '#239C43',
    borderBottomWidth: 1
  },
  addressCard: {
    backgroundColor: '#F5F7F2',
    borderRadius: 8,
    padding: 16,
  },
  personInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personName: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  phoneNumber: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.black,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontSize: fontSizes.regular,
    color: colors.label,
    fontFamily: fonts.medium,
    lineHeight: 20,
    paddingStart: 5
  },
  deliveryCard: {
    backgroundColor: '#F5F7F2',
    borderRadius: 8,
    padding: 12,
  },
  deliveryDate: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  paymentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  walletDetails: {
    justifyContent: 'center',
  },
  walletLabel: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  walletAmount: {
    fontSize: fontSizes.huge,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  addFundButton: {
    color: '#239C43',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 8,
  },
});