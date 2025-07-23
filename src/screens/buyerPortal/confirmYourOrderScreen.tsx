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

const { width } = Dimensions.get('window');

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ConfirmYourOrderScreen
>;

const ConfirmYourOrderScreen: React.FC<LoginProps> = ({ navigation }) => {
  const [quantity, setQuantity] = useState(4);
  const [walletBalance, setWalletBalance] = useState(2430.00);
  const [isSelected, setIsSelected] = useState(true);
  const itemPrice = 350;
  const totalPrice = itemPrice * quantity;
  const [isModalVisible, setModalVisible] = useState(false);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  const handleBuyNow = () => {
    console.log('Buy Now pressed for:');
    setModalVisible(true);
  };
  const modalSucesss = () => {
    setModalVisible(false);
  };
  return (
    <TitleBackHeaderContainer title="Confirm Your Order" isBack>
      <View style={styles.productSection}>
        <View style={styles.productContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'data:image/jpeg;base64,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' }}
              style={styles.productImage}
            />
            <View style={styles.quantityControls}>
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
            </View>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>
              boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds
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
            <Text style={styles.phoneNumber}>+966 456546346</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.addressInfo}>
            <IconsSvg
              name='locationIcon'
            />
            <Text style={styles.addressText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
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
                ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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