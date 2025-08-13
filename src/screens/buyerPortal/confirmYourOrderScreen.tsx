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
import React, { useState, useRef, useEffect } from 'react';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import colors from '../../utils/colors';
import { fontSizes } from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import Button from '../../components/button/buttons';
import OrderSuccessfulModal from '../../components/model/orderSuccessfulModal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProductDetailByID, getWalletDetail, getAddresses, makePayment, soldProduct } from '../../utils/apiAction';
import { image_url } from '../../utils/api';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { AddressType } from '../../utils/types';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';
import { useStripe } from '@stripe/stripe-react-native';

const { width } = Dimensions.get('window');

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ConfirmYourOrderScreen
>;

const ConfirmYourOrderScreen: React.FC<LoginProps> = ({ navigation,route }) => {
  const { productId } = route?.params;
  const userData = useSelector((user: IRootState) => user.user.userData);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [quantity, setQuantity] = useState(4);
  const [walletBalance, setWalletBalance] = useState(2430.00);
  // const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe'>('wallet');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe'>('stripe');
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<AddressType | null>(null);
  const itemPrice = 350;
  const totalPrice = itemPrice * quantity;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isStripeModalVisible, setStripeModalVisible] = useState(false);
  const { data: allProductList, refetch: refetchAllProduct } = useQuery({
    queryKey: ['getProductDetailByID', productId],
    queryFn: () => getProductDetailByID(productId),
  });
  const { data: walletData, refetch: refetchWalletDetail } = useQuery({
    queryKey: ['getWalletDetail'],
    queryFn: () => getWalletDetail(),
    enabled: !!userData, 
  });
  const { data: addressesData, refetch: refetchAddresses } = useQuery({
    queryKey: ['getAddresses'],
    queryFn: getAddresses,
    enabled: !!userData,
  });

  // Set default address when addresses data is loaded
  useEffect(() => {
    if (addressesData?.data?.address && addressesData.data.address.length > 0) {
      const firstAddress = addressesData.data.address[0];
      setDefaultAddress(firstAddress);
      
      // If no address has been manually selected, use the default
      if (!selectedAddress && !isAddressChanged) {
        setSelectedAddress(firstAddress);
      }
      
      console.log('Default address set:', firstAddress);
    }
  }, [addressesData, selectedAddress, isAddressChanged]);
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Old wallet payment mutation - keep this for wallet payments
  const { mutate } = useMutation({
    mutationFn: (data: { productId: string | number | null | undefined; address_id: number }) => 
      soldProduct(data.productId, { address_id: data.address_id }),
    onSuccess: (data: any) => {
      showLoader(false);
      setModalVisible(true);
    },
    onError: (error: any) => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Payment Failed',
        description: 'Wallet payment failed. Please try again.',
      });
    },
  });
  console.log(addressesData,"addressesData-----------");
  
  const handleBuyNow = async () => {
    // Get current address ID
    const addressId = getCurrentAddressId();
    
    console.log('Buy Now - Current address state:', {
      selectedAddress: selectedAddress?.full_name,
      defaultAddress: defaultAddress?.full_name,
      isAddressChanged,
      addressId
    });
    
    if (!addressId) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'Please select an address before proceeding.',
      });
      return;
    }

    // Get product price
    const productPrice = allProductList?.data?.product[0]?.price || '0';
    
    // Prepare payment payload
    const paymentPayload = {
      amount: productPrice.toString(),
      address_id: addressId
    };

    console.log('Payment payload prepared:', paymentPayload);

    if (paymentMethod === 'wallet') {
      showLoader(true);
      // Use old wallet payment API (soldProduct) with address_id
      mutate({ productId, address_id: addressId });
    } else if (paymentMethod === 'stripe') {
      handleStripePayment(paymentPayload);
    }
  };

  const handleStripePayment = async (paymentPayload: { amount: string; address_id: number }) => {
    try {
      showLoader(true);
      
      // First, call your backend to create payment intent and get Stripe credentials
      const paymentResponse = await makePayment(productId, paymentPayload);
      
      console.log('Payment API Response:', paymentResponse);
      
      if (paymentResponse?.data?.status === 'success') {
        const { clientSecret, ephemeralKey, customer, paymentIntentId } = paymentResponse.data;
        
        console.log('Stripe Credentials:', { clientSecret, ephemeralKey, customer, paymentIntentId });
        
        // Validate Stripe credentials
        if (!clientSecret || !ephemeralKey || !customer) {
          showLoader(false);
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Payment Error',
            description: 'Invalid payment credentials received. Please try again.',
          });
          return;
        }
        
        // Initialize Stripe payment sheet with real data from your backend
        console.log('Initializing Stripe payment sheet...');
        const { error } = await initPaymentSheet({
          merchantDisplayName: 'Unopened Mobile',
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: clientSecret,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: userData?.full_name || 'Customer',
          },
          returnURL: 'https://your-app.com/return',
        });
        console.log('Stripe initPaymentSheet result:', { error });

        if (error) {
          showLoader(false);
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Error',
            description: error.message,
          });
          return;
        }

        console.log('Presenting Stripe payment sheet...');
        const { error: presentError } = await presentPaymentSheet();
        console.log('Stripe presentPaymentSheet result:', { presentError });
        
        if (presentError) {
          showLoader(false);
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Error',
            description: presentError.message,
          });
        } else {
          // Stripe payment successful - no need to call payment API again since it was already called
          console.log('Stripe payment completed successfully');
          showLoader(false);
          setModalVisible(true);
        }
      } else {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Payment Failed',
          description: 'Failed to create payment intent. Please try again.',
        });
      }
    } catch (error) {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'Payment failed. Please try again.',
      });
    }
  };
  const modalSucesss = () => {
    setModalVisible(false);
    // Reset navigation to bottom tab and navigate to MyOrder screen
    navigation.replace(SCREENS.OrderTrackScreen, {
      productId: productId,

    });
  };

  const handleChangeAddress = () => {
    navigation.navigate(SCREENS.AddressSelectionScreen, {
      onAddressSelect: (address: AddressType) => {
        console.log('Address selected:', address.full_name);
        setSelectedAddress(address);
        setIsAddressChanged(true);
      },
    });
  };

  // Function to reset to default address
  const resetToDefaultAddress = () => {
    if (defaultAddress) {
      console.log('Resetting to default address:', defaultAddress.full_name);
      setSelectedAddress(defaultAddress);
      setIsAddressChanged(false);
    }
  };

  // Helper function to get current address (either selected or default)
  const getCurrentAddress = () => {
    if (isAddressChanged && selectedAddress) {
      return selectedAddress;
    } else if (defaultAddress) {
      return defaultAddress;
    }
    return null;
  };

  // Helper function to get current address ID
  const getCurrentAddressId = () => {
    const currentAddress = getCurrentAddress();
    if (currentAddress?.id) {
      console.log('Using address ID:', currentAddress.id, 'for address:', currentAddress.full_name);
      return currentAddress.id;
    }
    console.log('No valid address ID found');
    return null;
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
              ${allProductList?.data?.product[0]?.price}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Billing Address</Text>
          <TouchableOpacity onPress={handleChangeAddress}>
            <Text style={styles.changeButton}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.summaryDivider} />
        {isAddressChanged && selectedAddress ? (
          // Show selected address after user changes it
          <View style={styles.addressCard}>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{selectedAddress.full_name}</Text>
              <Text style={styles.phoneNumber}>
                {selectedAddress.country_code} {selectedAddress.phone_number}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.addressInfo}>
              <IconsSvg name='locationIcon' />
              <Text style={styles.addressText}>
                {selectedAddress.address}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <Text style={styles.addressLocation}>
              {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country} - {selectedAddress.pincode}
            </Text>
          </View>
        ) : defaultAddress ? (
          // Show default address
          <View style={styles.addressCard}>
            <View style={styles.personInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.personName}>{defaultAddress.full_name || 'Person Name'}</Text>
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              </View>
              <Text style={styles.phoneNumber}>
                {defaultAddress.country_code || '+91'} {defaultAddress.phone_number || ''}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.addressInfo}>
              <IconsSvg name='locationIcon' />
              <Text style={styles.addressText}>
                {defaultAddress.address || ''}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <Text style={styles.addressLocation}>
              {defaultAddress.city || ''}, {defaultAddress.state || ''}, {defaultAddress.country || ''}{defaultAddress.pincode ? ` - ${defaultAddress.pincode}` : ''}
            </Text>
          </View>
        ) : (
          // Show no address state if user has no default address
          <View style={styles.noAddressContainer}>
            <Text style={styles.noAddressText}>No address selected</Text>
            <TouchableOpacity style={styles.addAddressButton} onPress={handleChangeAddress}>
              <Text style={styles.addAddressButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        )}
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
        
        {/* Wallet Payment Option */}
        <TouchableOpacity 
          style={[
            styles.paymentCard,
            paymentMethod === 'wallet' && styles.selectedPaymentCard
          ]}
          disabled={true}
          onPress={() => setPaymentMethod('wallet')}
        >
          <View style={styles.paymentOption}>
            <View
              style={[
                styles.radioOuter,
                { borderColor: paymentMethod === 'wallet' ? '#31AD52' : '#E0E0E0' }
              ]}
            >
              {paymentMethod === 'wallet' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentLabel}>Wallet Payment</Text>
              <Text style={styles.paymentAmount}>
                ${allProductList?.data?.product[0]?.price || '0.00'}
              </Text>
              <Text style={styles.walletBalanceText}>
                Available: ${walletData?.data?.wallet?.amount || '0.00'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            // Add fund functionality
          }}>
            <Text style={styles.addFundButton}>Add Fund</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Stripe Payment Option */}
        <TouchableOpacity 
          style={[
            styles.paymentCard,
            paymentMethod === 'stripe' && styles.selectedPaymentCard,
            styles.stripePaymentCard
          ]}
          onPress={() => setPaymentMethod('stripe')}
        >
          <View style={styles.paymentOption}>
            <View
              style={[
                styles.radioOuter,
                { borderColor: paymentMethod === 'stripe' ? '#31AD52' : '#E0E0E0' }
              ]}
            >
              {paymentMethod === 'stripe' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentLabel}>Stripe</Text>
              <Text style={styles.paymentAmount}>
                ${allProductList?.data?.product[0]?.price || '0.00'}
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            setStripeModalVisible(true);
          }}>
            <Text style={styles.stripeButton}>Pay with Card</Text>
          </TouchableOpacity> */}
        </TouchableOpacity>
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

      {/* Stripe Payment Modal */}
      <View style={[styles.modalOverlay, { display: isStripeModalVisible ? 'flex' : 'none' }]}>
        <View style={styles.stripeModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Payment Details</Text>
            <TouchableOpacity onPress={() => setStripeModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Total Amount: ${totalPrice}
            </Text>
            <Text style={styles.modalDescription}>
              You will be redirected to Stripe to complete your payment securely.
            </Text>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setStripeModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.proceedButton}
              onPress={() => {
                setStripeModalVisible(false);
                // Get payment payload for Stripe payment
                const addressId = getCurrentAddressId();
                const productPrice = allProductList?.data?.product[0]?.price || '0';
                const paymentPayload = {
                  amount: productPrice.toString(),
                  address_id: addressId || 0
                };
                handleStripePayment(paymentPayload);
              }}
            >
              <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  selectedPaymentCard: {
    backgroundColor: '#f0f8f0',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  stripePaymentCard: {
    marginTop: 12,
  },
  paymentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Add subtle shadow for better visual feedback
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  paymentDetails: {
    justifyContent: 'center',
  },
  paymentLabel: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: fontSizes.huge,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  walletBalanceText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginTop: 4,
  },
  addFundButton: {
    color: '#239C43',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  stripeButton: {
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
  addressLocation: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginTop: 4,
  },
  noAddressContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noAddressText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginBottom: 12,
  },
  addAddressButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addAddressButtonText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  // Stripe Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  stripeModal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: fontSizes.extraLarge,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  closeButton: {
    fontSize: 24,
    color: colors.text3,
    fontWeight: 'bold',
  },
  modalContent: {
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text2,
    marginBottom: 10,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.text2,
  },
  proceedButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});