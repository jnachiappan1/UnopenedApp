import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
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
import { getProductDetailByID, getWalletDetail, getAddresses, makePayment, soldProduct, validateCoupon, applyCoupon, createShipping, getShippingRates } from '../../utils/apiAction';
import { image_url } from '../../utils/api';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { AddressType } from '../../utils/types';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';
import { useStripe } from '@stripe/stripe-react-native';
import { useForm } from 'react-hook-form';
import ApplyOfferInput from '../../components/input/applyOfferInput';

const { width } = Dimensions.get('window');

type LoginProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.ConfirmYourOrderScreen
>;

const ConfirmYourOrderScreen: React.FC<LoginProps> = ({ navigation, route }) => {
  const { productId } = route?.params;
  const userData = useSelector((user: IRootState) => user.user.userData);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [quantity, setQuantity] = useState(4);
  const [walletBalance, setWalletBalance] = useState(2430.00);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe'>('stripe');
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<AddressType | null>(null);
  const itemPrice = 350;
  const totalPrice = itemPrice * quantity;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isStripeModalVisible, setStripeModalVisible] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Form setup for discount code
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      discount_code: '',
    }
  });

  // Watch the discount code value
  const discountCode = watch('discount_code');
  
  // Store the applied discount code for payment success flow
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string>('');

  // Track shipping API calls
  const [shippingApiCalled, setShippingApiCalled] = useState(false);
  const [selectedShippingRate, setSelectedShippingRate] = useState<any>(null);
  const [isShippingRatesLoading, setIsShippingRatesLoading] = useState(false);
  const [priorityShippingRate, setPriorityShippingRate] = useState<any>(null);
  const [shippingID, setShippingID] = useState<any>(null);
  const [lastAddressId, setLastAddressId] = useState<number | null>(null);



  // Shipping API mutation
  const { mutate: createShippingMutation, isPending: isShippingPending } = useMutation({
    mutationFn: createShipping,
    onSuccess: async (response) => {
      setShippingApiCalled(true);
      setIsShippingRatesLoading(false); // No need for loading state since we're using direct response
      // Use shipping rates directly from the shipping response (no need for separate API call)
      const resData = (response as any)?.data ?? response;
      
      if (resData?.success && resData?.shipment?.rates) {
        setShippingID(resData.shipment.id);
        const shippingRates = resData.shipment.rates;
        
        if (Array.isArray(shippingRates) && shippingRates.length > 0) {
          
          // First, try to find USPS Priority service
          const uspsPriorityRate = shippingRates.find(
            (rate: any) =>
              rate.carrier === "USPS" && rate.service?.trim().toLowerCase() === "priority"
          );
          
          if (uspsPriorityRate) {
            setPriorityShippingRate(uspsPriorityRate);
            setSelectedShippingRate(uspsPriorityRate);
          } else {
            // Fallback: try to find any Priority service
            const priorityRate = shippingRates.find((rate: any) => rate.service === 'Priority');
            if (priorityRate) {
              setPriorityShippingRate(priorityRate);
              setSelectedShippingRate(priorityRate);
            } else {
              const firstRate = shippingRates[0];
              setSelectedShippingRate(firstRate);
              setPriorityShippingRate(firstRate); 
            }
          }
        } 
      } 
    },
    onError: (error: any) => {
      setShippingApiCalled(false);
    },
  });
  const callShippingAPI = (addressId: number) => {
    if (!productId) {
      return;
    }
    
    if (!addressId || addressId <= 0) {
      return;
    }
    if (!userData?.id) {
      return;
    }
    if (lastAddressId === addressId && shippingApiCalled) {
      return;
    }
    setLastAddressId(addressId);
    const shippingPayload = {
      product_id: productId.toString(),
      address_id: addressId
    };
    setShippingApiCalled(false);    
    createShippingMutation(shippingPayload);
  };
  const resetShippingStatus = () => {
    setShippingApiCalled(false);
    setLastAddressId(null);
    setIsShippingRatesLoading(false); 
  };
  const handleDiscountCodeApply = async (code: string) => {
    try {
      const subtotal = getSubtotal();
      if (subtotal <= 0) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Invalid Amount',
          description: 'Please select a shipping option before applying discount code.',
          doneText: 'OK',
        });
        return;
      }

      const couponPayload = {
        coupon_code: code,
        purchase_amount: subtotal
      };
      // Make API call to validate coupon
      const response = await validateCoupon(couponPayload);
      // Access the response data properly from axios response
      const responseData = response;

      if (responseData?.data?.is_valid && responseData?.data?.is_available) {
        const couponData = responseData.data.coupon;
        const discountAmountValue = parseFloat(couponData.discount_amount);
        const minimumPurchase = couponData.minimum_purchase_amount;
        
        // Store the discount amount for payment calculations
        setDiscountAmount(discountAmountValue);
        // Store the applied discount code for payment success flow
        setAppliedDiscountCode(code);
        
        showAlert({
          isVisible: true,
          type: 'success',
          title: 'Coupon Applied Successfully!',
          description: `Coupon "${couponData.title}" applied! You get $${discountAmountValue} off on minimum purchase of $${minimumPurchase}`,
          doneText: 'OK',
          onDonePress: () => {
            // Do nothing - just close the modal
          },
        });
      } else {
        // Check specific validation failures
        if (responseData?.data?.is_valid === false) {
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Invalid Coupon',
            description: 'This coupon code is not valid. Please check and try again.',
            doneText: 'OK',
          });
        } else if (responseData?.data?.is_available === false) {
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Coupon Not Available',
            description: 'This coupon is no longer available or has expired.',
            doneText: 'OK',
          });
        } else {
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Coupon Validation Failed',
            description: responseData?.data?.message || 'Failed to validate coupon. Please try again.',
            doneText: 'OK',
          });
        }
      }
    } catch (error: any) {
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Coupon Validation Error',
        description: error?.response?.data?.message || 'Failed to validate coupon. Please try again.',
        doneText: 'OK',
      });
    }
  };

  const { data: allProductList, refetch: refetchAllProduct } = useQuery({
    queryKey: ['getProductDetailByID', productId],
    queryFn: () => getProductDetailByID(productId),
  });

  const { data: walletData, refetch: refetchWalletDetail, isLoading: isWalletLoading } = useQuery({
    queryKey: ['getWalletDetail'],
    queryFn: () => getWalletDetail(),
    enabled: !!userData,
  });

  const { data: addressesData, refetch: refetchAddresses } = useQuery({
    queryKey: ['getAddresses'],
    queryFn: getAddresses,
    enabled: !!userData,
  });

  // Helper function to check if wallet payment should be disabled
  const isWalletPaymentDisabled = () => {
    const walletBalance = getSafeNumber(walletData?.data?.wallet?.amount);
    const productPrice = getSafeNumber(allProductList?.data?.product[0]?.price);
    
    // Disable if wallet balance is 0, negative, or product price is 0/negative
    return walletBalance <= 0 || productPrice <= 0 || isWalletLoading;
  };

  // Set default address from API data
  useEffect(() => {
    if (addressesData?.data?.address && addressesData.data.address.length > 0) {
      const firstAddress = addressesData.data.address[0];
      setDefaultAddress(firstAddress);
      if (!selectedAddress && !isAddressChanged) {
        setSelectedAddress(firstAddress);
      }
    }
  }, [addressesData, selectedAddress, isAddressChanged]);

  // Auto-switch to Stripe if wallet becomes disabled
  useEffect(() => {
    if (isWalletPaymentDisabled() && paymentMethod === 'wallet') {
      setPaymentMethod('stripe');
    }
  }, [walletData, allProductList, isWalletLoading, paymentMethod]);
  useEffect(() => {
    const currentAddressId = getCurrentAddressId();
    if (currentAddressId && productId && !shippingApiCalled && addressesData?.data?.address && defaultAddress) {
      callShippingAPI(currentAddressId);
    } 
  }, [addressesData, defaultAddress]); 

  // Monitor priorityShippingRate changes
  useEffect(() => {
   
  }, [priorityShippingRate, selectedShippingRate, shippingApiCalled, isShippingRatesLoading]);

  // Debug shipping display state
  useEffect(() => {
   
  }, [selectedShippingRate, isShippingRatesLoading, shippingApiCalled, priorityShippingRate]);
  const handleBuyNow = async () => {
    try {
      if (!productId) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Product ID is missing. Please try again.',
        });
        return;
      }

      if (!allProductList?.data?.product?.[0]) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Product information not loaded. Please try again.',
        });
        return;
      }

      const addressId = getCurrentAddressId();
      if (!addressId) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Please select an address before proceeding.',
        });
        return;
      }

      // Check if shipping rate is selected
      if (!selectedShippingRate) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Please select a shipping option before proceeding.',
        });
        return;
      }

      // Validate shipping rate has required properties
      if (!selectedShippingRate.id || !selectedShippingRate.rate) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Selected shipping option is missing required information. Please try selecting a different shipping option.',
        });
        return;
      }

      const productPrice = getSafeNumber(allProductList.data.product[0].price);
      if (!productPrice || productPrice <= 0) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Invalid product price. Please try again.',
        });
        return;
      }

      // Check if wallet payment is disabled and user selected wallet
      if (paymentMethod === 'wallet' && isWalletPaymentDisabled()) {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Wallet Payment Unavailable',
          description: 'Wallet payment is not available. Please add funds to your wallet or use Stripe payment.',
        });
        return;
      }

      const paymentPayload = {
        amount: productPrice.toString(),
        address_id: addressId
      };
      if (paymentMethod === 'wallet') {
        const currentWalletBalance = getSafeNumber(walletData?.data?.wallet?.amount);
        const finalAmount = getFinalAmount(); 

        if (currentWalletBalance >= finalAmount) {
          showLoader(true);
          const walletPaymentPayload = {
            wallet_amount: finalAmount.toString(), 
            address_id: addressId
          };

          try {
            const walletPaymentPayload = {
              amount: finalAmount.toString(),
              wallet_amount: finalAmount.toString(),
              rate_amount: selectedShippingRate ? selectedShippingRate.rate.toString() : '0',
              address_id: addressId,
              rate_id: selectedShippingRate ? selectedShippingRate.id : '',
              shipmentId: shippingID
            };
            const walletPaymentResponse = await makePayment('wallet_funds', walletPaymentPayload, productId);

            if (walletPaymentResponse?.data?.status === 'success' ||
              walletPaymentResponse?.data?.success === true) {
              showLoader(false);
              // Apply coupon after successful wallet payment
              await applyCouponAfterPayment();
              setModalVisible(true);
            } else {
              showLoader(false);
              showAlert({
                isVisible: true,
                type: 'error',
                title: 'Wallet Payment Failed',
                description: walletPaymentResponse?.data?.message || 'Wallet payment failed. Please try again.',
              });
            }
          } catch (walletError: any) {
            showLoader(false);
            showAlert({
              isVisible: true,
              type: 'error',
              title: 'Wallet Payment Error',
              description: walletError?.response?.data?.message || 'Wallet payment failed. Please try again.',
            });
          }
        } else {
          const walletAmount = getSafeNumber(currentWalletBalance);
          const remainingAmount = finalAmount - walletAmount; // Use discounted amount
          showAlert({
            isVisible: true,
            type: 'info',
            title: 'Hybrid Payment',
            description: `Use $${Number(walletAmount).toFixed(2)} from wallet + $${Number(remainingAmount).toFixed(2)} via Stripe?`,
            doneText: 'Proceed',
            deleteText: 'Cancel',
            onDonePress: async () => {
              try {
                showLoader(true);
                const hybridPaymentPayload = {
                  amount: remainingAmount.toString(),      // Stripe amount (discounted)
                  wallet_amount: walletAmount.toString(), // Wallet amount
                  rate_amount: selectedShippingRate ? selectedShippingRate.rate.toString() : '0',
                  address_id: addressId,
                  rate_id: selectedShippingRate ? selectedShippingRate.id : '',
                  shipmentId: shippingID
                };
                const hybridResponse = await makePayment('wallet_buy_product_funds', hybridPaymentPayload, productId);
                if (hybridResponse?.data?.status === 'success' &&
                  hybridResponse?.data?.clientSecret) {
                  const { clientSecret, ephemeralKey, customer, paymentIntentId } = hybridResponse.data;
                  if (!clientSecret || !ephemeralKey || !customer) {
                    showLoader(false);
                    showAlert({
                      isVisible: true,
                      type: 'error',
                      title: 'Stripe Configuration Error',
                      description: 'Missing payment credentials. Please contact support.',
                    });
                    return;
                  }
                  const { error: initError } = await initPaymentSheet({
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

                  if (initError) {
                    showLoader(false);
                    showAlert({
                      isVisible: true,
                      type: 'error',
                      title: 'Payment Initialization Error',
                      description: `Failed to initialize payment: ${initError.message}`,
                    });
                    return;
                  }
                  const { error: presentError } = await presentPaymentSheet();

                  if (presentError) {
                    showLoader(false);
                    showAlert({
                      isVisible: true,
                      type: 'error',
                      title: 'Payment Presentation Error',
                      description: `Payment sheet error: ${presentError.message}`,
                    });
                  } else {
                    showLoader(false);
                    // Apply coupon after successful hybrid payment
                    await applyCouponAfterPayment();
                    setModalVisible(true);
                  }
                } else {
                  showLoader(false);
                  showAlert({
                    isVisible: true,
                    type: 'error',
                    title: 'Hybrid Payment Failed',
                    description: hybridResponse?.data?.message ||
                      hybridResponse?.data?.error ||
                      'Hybrid payment failed. Please try again.',
                  });
                  return;
                }
              } catch (hybridError: any) {
                showLoader(false);
                showAlert({
                  isVisible: true,
                  type: 'error',
                  title: 'Hybrid Payment Error',
                  description: hybridError?.response?.data?.message || 'Hybrid payment failed. Please try again.',
                });
              }
            },
            onDeletePress: () => {
              showAlert({
                isVisible: true,
                type: 'info',
                title: 'Payment Cancelled',
                description: 'You can choose a different payment method or add funds to your wallet.',
              });
            }
          });
        }
      } else if (paymentMethod === 'stripe') {
        const finalAmount = getFinalAmount(); // Use discounted amount
              const stripePaymentPayload = {
        amount: finalAmount.toString(), // Use discounted amount
        rate_amount: selectedShippingRate ? selectedShippingRate.rate.toString() : '0',
        address_id: addressId,
        rate_id: selectedShippingRate ? selectedShippingRate.id : '',
        shipmentId: shippingID 
      };
        handleStripePayment(stripePaymentPayload);
      } else {
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Invalid payment method selected.',
        });
      }
    } catch (error) {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleStripePayment = async (paymentPayload: { 
    amount: string; 
    rate_amount: string;
    address_id: number; 
    rate_id: string;
    shipmentId: string;
  }) => {
    try {
      showLoader(true);
      if (!productId) {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Error',
          description: 'Product ID is missing. Please try again.',
        });
        return;
      }
      const paymentResponse = await makePayment('buy_product', paymentPayload, productId);
      if (!paymentResponse || !paymentResponse.data) {
        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Payment Error',
          description: 'No response received from payment server. Please try again.',
        });
        return;
      }
      const isSuccess = paymentResponse.data.status === 'success' ||
        paymentResponse.data.success === true ||
        paymentResponse.data.paymentIntentId;

      if (isSuccess) {
        const { clientSecret, ephemeralKey, customer, paymentIntentId } = paymentResponse.data;
        const missingCredentials = [];
        if (!clientSecret) missingCredentials.push('Client Secret');
        if (!ephemeralKey) missingCredentials.push('Ephemeral Key');
        if (!customer) missingCredentials.push('Customer ID');
        if (missingCredentials.length > 0) {
          showLoader(false);
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Payment Configuration Error',
            description: `Missing payment credentials: ${missingCredentials.join(', ')}. Please contact support.`,
          });
          return;
        }
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

        if (error) {
          showLoader(false);
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Payment Initialization Error',
            description: `Failed to initialize payment: ${error.message}`,
          });
          return;
        }

        const { error: presentError } = await presentPaymentSheet();

        if (presentError) {
          showLoader(false);
          showAlert({
            isVisible: true,
            type: 'error',
            title: 'Payment Presentation Error',
            description: `Payment sheet error: ${presentError.message}`,
          });
        } else {
          showLoader(false);
          // Apply coupon after successful Stripe payment
          await applyCouponAfterPayment();
          setModalVisible(true);
        }
      } else {
        const errorMessage = paymentResponse.data.message ||
          paymentResponse.data.error ||
          'Unknown payment error';

        showLoader(false);
        showAlert({
          isVisible: true,
          type: 'error',
          title: 'Payment Failed',
          description: `Payment setup failed: ${errorMessage}`,
        });
      }
    } catch (error: any) {
      showLoader(false);
      let errorDescription = 'Payment failed. Please try again.';

      if (error?.response?.data?.message) {
        errorDescription = error.response.data.message;
      } else if (error?.message) {
        errorDescription = error.message;
      } else if (error?.code) {
        errorDescription = `Payment error (${error.code}). Please try again.`;
      }

      showAlert({
        isVisible: true,
        type: 'error',
        title: 'Payment Error',
        description: errorDescription,
      });
    }
  };

  const modalSucesss = () => {
    setModalVisible(false);
    navigation.replace(SCREENS.OrderTrackScreen, {
      productId: productId,
    });
  };

  const handleChangeAddress = () => {
    navigation.navigate(SCREENS.AddressSelectionScreen, {
      onAddressSelect: async (address: AddressType) => {
        setSelectedAddress(address);
        setIsAddressChanged(true);
        setShippingApiCalled(false);
        setLastAddressId(null);
        setSelectedShippingRate(null);
        setPriorityShippingRate(null);
        
        // Automatically fetch new shipping rates for the new address
        if (address?.id && productId) {
          callShippingAPI(address.id);
        }
      },
      selectedAddressId: getCurrentAddressId() ?? null,
    });
  };

  const resetToDefaultAddress = () => {
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
      setIsAddressChanged(false);
      setShippingApiCalled(false);
      setLastAddressId(null);
      setSelectedShippingRate(null);
      setPriorityShippingRate(null);
      
      // Automatically fetch new shipping rates for the default address
      if (defaultAddress?.id && productId) {
        callShippingAPI(defaultAddress.id);
      }
    }
  };

  const getCurrentAddress = () => {
    if (isAddressChanged && selectedAddress) {
      return selectedAddress;
    } else if (defaultAddress) {
      return defaultAddress;
    }
    return null;
  };

  const getCurrentAddressId = () => {
    const currentAddress = getCurrentAddress();
    if (currentAddress?.id) {
      return currentAddress.id;
    }
    return null;
  };

  const getSafeNumber = (value: any, defaultValue: number = 0): number => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Calculate subtotal (product price + shipping)
  const getSubtotal = (): number => {
    const productPrice = getSafeNumber(allProductList?.data?.product[0]?.price);
    const shippingCost = selectedShippingRate ? getSafeNumber(selectedShippingRate.rate) : 0;
    return productPrice + shippingCost;
  };

  // Calculate final amount after applying discount and shipping
  const getFinalAmount = (): number => {
    const subtotal = getSubtotal();
    return Math.max(0, subtotal - discountAmount);
  };

  // Get discount display text
  const getDiscountDisplay = (): string => {
    if (discountAmount > 0) {
      return `-$${discountAmount.toFixed(2)}`;
    }
    return '';
  };

  // Clear discount amount
  const clearDiscount = () => {
    setDiscountAmount(0);
    setAppliedDiscountCode('');
  };

  // Helper function to generate shipment ID
  const generateShipmentId = (): string => {
    return 'shp_' + Math.random().toString(36).substr(2, 15);
  };

  // Apply coupon after successful payment
  const applyCouponAfterPayment = async () => {
    if (appliedDiscountCode && discountAmount > 0) {
      try {
        const purchaseAmount = getSafeNumber(allProductList?.data?.product[0]?.price);
        if (purchaseAmount > 0) {
          const couponPayload = {
            coupon_code: appliedDiscountCode,
            purchase_amount: purchaseAmount
          };
          const response = await applyCoupon(couponPayload);
          // Clear the discount after successful application
          setDiscountAmount(0);
          setAppliedDiscountCode('');
        }
      } catch (error) {
      }
    }
  };

  const getPaymentBreakdown = () => {
    if (isWalletLoading || !walletData?.data?.wallet?.amount || !allProductList?.data?.product[0]?.price) {
      return {
        walletAmount: 0,
        stripeAmount: 0,
        isHybrid: false,
        message: 'Loading payment details...'
      };
    }

    const currentWalletBalance = getSafeNumber(walletData.data.wallet.amount);
    const finalAmount = getFinalAmount(); // Use discounted amount

    if (currentWalletBalance >= finalAmount) {
      return {
        walletAmount: finalAmount,
        stripeAmount: 0,
        isHybrid: false,
        message: `Full payment from wallet: $${finalAmount.toFixed(2)}`
      };
    } else {
      return {
        walletAmount: currentWalletBalance,
        stripeAmount: finalAmount - currentWalletBalance,
        isHybrid: true,
        message: `Hybrid payment: $${currentWalletBalance.toFixed(2)} from wallet + $${(finalAmount - currentWalletBalance).toFixed(2)} via Stripe`
      };
    }
  };

  // Build estimated delivery text using est_delivery_days (fallback to delivery_days or delivery_date)
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const getEstimatedDeliveryText = (): string => {
    if (!selectedShippingRate) {
      return 'Select a shipping option';
    }
    const daysValue = Number(selectedShippingRate?.est_delivery_days ?? selectedShippingRate?.delivery_days);
    if (Number.isFinite(daysValue) && daysValue > 0) {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + Math.floor(daysValue));
      const formatted = formatDate(estimatedDate);
      const daysLabel = Math.floor(daysValue) === 1 ? '1 day' : `${Math.floor(daysValue)} days`;
      return `On or before ${formatted} (${daysLabel})`;
    }
    if (selectedShippingRate?.delivery_date) {
      const dateFromCarrier = new Date(selectedShippingRate.delivery_date);
      if (!isNaN(dateFromCarrier.getTime())) {
        const formatted = formatDate(dateFromCarrier);
        const prefix = selectedShippingRate?.delivery_date_guaranteed ? 'Guaranteed by' : 'Estimated by';
        return `${prefix} ${formatted}`;
      }
    }
    return 'Estimate unavailable';
  };

  return (
    <TitleBackHeaderContainer title="Confirm Your Order" isBack>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productSection}>
          <View style={styles.productContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image_url + allProductList?.data?.product[0]?.product_image[1]?.image }}
                style={styles.productImage}
              />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>
                {allProductList?.data?.product[0]?.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>
                  ${allProductList?.data?.product[0]?.price}
                </Text>
                {discountAmount > 0 && (
                  <Text style={styles.discountText}>
                    {getDiscountDisplay()}
                  </Text>
                )}
              </View>
              
              {/* Shipping Cost Display */}
              {selectedShippingRate && (
                <View style={styles.shippingCostContainer}>
                  <Text style={styles.shippingCostLabel}>Shipping:</Text>
                  <Text style={styles.shippingCostAmount}>${selectedShippingRate.rate}</Text>
                </View>
              )}
              
              {/* Subtotal and Final Price */}
              {selectedShippingRate && (
                <View style={styles.totalContainer}>
                  <Text style={styles.subtotalText}>
                    Subtotal: ${getSubtotal().toFixed(2)}
                  </Text>
                  {discountAmount > 0 && (
                    <Text style={styles.finalPrice}>
                      Final Price: ${getFinalAmount().toFixed(2)}
                    </Text>
                  )}
                </View>
              )}
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
              {getEstimatedDeliveryText()}
            </Text>
          </View>
        </View>
   {/* Shipping Rates Selection */}
   <View style={styles.productSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping Option</Text>
            <Text style={styles.requiredText}>* Required</Text>
          </View>

          <View style={styles.summaryDivider} />
          
          {/* Show loading state while fetching shipping rates */}
          {isShippingRatesLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>🔄 Loading shipping options...</Text>
              <Text style={styles.loadingSubtext}>Please wait while we calculate shipping rates</Text>
            </View>
          )}



          {/* Show shipping option when available */}
          {selectedShippingRate && !isShippingRatesLoading ? (
            <View style={[
              styles.shippingOptionCard,
              selectedShippingRate.carrier === 'USPS' && selectedShippingRate.service === 'Priority' && styles.uspsPriorityCard
            ]}>
              
              <View style={styles.shippingOptionHeader}>
                <View style={styles.shippingOptionInfo}>
                  <View style={styles.shippingOptionTitleRow}>
                    <Text style={styles.shippingOptionTitle}>
                      {selectedShippingRate.carrier} - {selectedShippingRate.service}
                    </Text>
                    {selectedShippingRate.carrier === 'USPS' && selectedShippingRate.service === 'Priority' && (
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityBadgeText}>⭐ Priority</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.shippingOptionSubtitle}>
                    {selectedShippingRate.delivery_days === 1 ? 'Next Day Delivery' : `${selectedShippingRate.delivery_days} Days Delivery`}
                  </Text>
                </View>
                <View style={styles.shippingOptionPrice}>
                  <Text style={styles.shippingPriceAmount}>
                    ${selectedShippingRate.rate}
                  </Text>
                  <Text style={styles.shippingPriceCurrency}>
                    USD
                  </Text>
                </View>
              </View>
              <View style={styles.shippingOptionDetails}>
                <Text style={styles.shippingOptionDetailsText}>
                  Estimated delivery: {selectedShippingRate.delivery_days === 1 ? 'Next business day' : `Within ${selectedShippingRate.delivery_days} business days`}
                </Text>
                {selectedShippingRate.carrier === 'USPS' && selectedShippingRate.service === 'Priority' && (
                  <Text style={styles.uspsPriorityInfo}>
                    🚀 USPS Priority Mail - Fastest reliable shipping option
                  </Text>
                )}
              </View>
             
            </View>
            
          ) : null}
 <Text style={styles.shippingText}>
              The shipping is 100% insured by unopened 
                  </Text>
          {/* Show no rates message when no shipping options available */}
          {!selectedShippingRate && !isShippingRatesLoading && shippingApiCalled ? (
            <View style={styles.noRatesContainer}>
              <Text style={styles.noRatesText}>⚠️ No shipping options available</Text>
              <Text style={styles.noRatesSubtext}>Please try a different address or contact support</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>Payment mode</Text>
          <View style={styles.summaryDivider} />

          {/* Wallet Payment Option */}
          <TouchableOpacity
            style={[
              styles.paymentCard,
              paymentMethod === 'wallet' && styles.selectedPaymentCard,
              isWalletPaymentDisabled() && styles.disabledPaymentCard
            ]}
            onPress={() => {
              // Don't allow selection if wallet payment is disabled
              if (isWalletPaymentDisabled()) {
                const walletBalance = getSafeNumber(walletData?.data?.wallet?.amount);
                const productPrice = getSafeNumber(allProductList?.data?.product[0]?.price);
                
                let message = 'Wallet payment is not available.';
                if (walletBalance <= 0) {
                  message = 'Your wallet balance is insufficient. Please add funds to your wallet or use Stripe payment.';
                } else if (productPrice <= 0) {
                  message = 'Invalid product price. Please try again.';
                }
                
                showAlert({
                  isVisible: true,
                  type: 'error',
                  title: 'Wallet Payment Unavailable',
                  description: message,
                  doneText: 'OK',
                });
                return;
              }

              // Don't allow selection while loading
              if (isWalletLoading) {
                return;
              }

              const walletBalance = getSafeNumber(walletData?.data?.wallet?.amount);
              const productPrice = getSafeNumber(allProductList?.data?.product[0]?.price);

              if (walletBalance < productPrice) {
                // Hybrid payment logic
                showAlert({
                  isVisible: true,
                  type: 'info',
                  title: 'Hybrid Payment',
                  description: `Use $${walletBalance.toFixed(2)} from wallet + $${(productPrice - walletBalance).toFixed(2)} via Stripe?`,
                  doneText: 'Yes',
                  deleteText: 'No',
                  onDonePress: () => {
                    setPaymentMethod('wallet');
                    showAlert({
                      isVisible: true,
                      type: 'info',
                      title: 'Hybrid Payment Selected',
                      description: 'Click "Pay with Wallet + Stripe" button to proceed with hybrid payment.',
                      doneText: 'OK',
                    });
                  },
                  onDeletePress: () => {
                    setPaymentMethod('stripe');
                  }
                });
                return;
              }
              
              // Full wallet payment available
              setPaymentMethod('wallet');
            }}
            disabled={isWalletPaymentDisabled()}
          >
            <View style={styles.paymentOption}>
              <View
                style={[
                  styles.radioOuter,
                  { 
                    borderColor: isWalletPaymentDisabled() 
                      ? '#E0E0E0' 
                      : paymentMethod === 'wallet' 
                        ? '#31AD52' 
                        : '#E0E0E0' 
                  }
                ]}
              >
                {paymentMethod === 'wallet' && !isWalletPaymentDisabled() && <View style={styles.radioInner} />}
              </View>
              <View style={styles.paymentDetails}>
                <Text style={[
                  styles.paymentLabel,
                  isWalletPaymentDisabled() && { color: '#999999' }
                ]}>
                  Wallet Payment
                </Text>
                <Text style={[
                  styles.paymentAmount,
                  isWalletPaymentDisabled() && { color: '#999999' }
                ]}>
                  ${getFinalAmount().toFixed(2)}
                </Text>
                <Text style={[
                  styles.walletBalanceText,
                  { 
                    color: isWalletPaymentDisabled() 
                      ? '#999999' 
                      : getSafeNumber(walletData?.data?.wallet?.amount) < getSafeNumber(allProductList?.data?.product[0]?.price) 
                        ? '#FF6B6B' 
                        : colors.text3 
                  }
                ]}>
                  {isWalletLoading 
                    ? 'Loading...' 
                    : getSafeNumber(walletData?.data?.wallet?.amount) <= 0
                      ? 'No funds available'
                      : `$${getSafeNumber(walletData?.data?.wallet?.amount).toFixed(2)} available`
                  }
                </Text>
                {!isWalletLoading && 
                 !isWalletPaymentDisabled() && 
                 getSafeNumber(walletData?.data?.wallet?.amount) < getSafeNumber(allProductList?.data?.product[0]?.price) && (
                  <Text style={styles.hybridPaymentInfo}>
                    💳 Hybrid payment available
                  </Text>
                )}
                {isWalletPaymentDisabled() && !isWalletLoading && (
                  <Text style={styles.disabledPaymentInfo}>
                    ❌ Wallet payment unavailable
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                // Navigate to add fund screen or show add fund modal
                navigation.navigate(SCREENS.AddFundScreen); // Adjust screen name as needed
              }}
              disabled={isWalletLoading}
            >
              <Text style={[
                styles.addFundButton,
                isWalletLoading && { color: '#999999' }
              ]}>
                Add Fund
              </Text>
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
                  ${getFinalAmount().toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

     


        <ApplyOfferInput
          control={control}
          name="discount_code"
          label={'Discount Code'}
          containerStyle={styles.discountContainer}
          inputStyle={{}}
          inputProps={{
            placeholder: 'Enter discount code',
          }}
          error={errors}
          onApply={handleDiscountCodeApply}
        />
          
        {/* Applied Coupon Display */}
        {discountAmount > 0 && appliedDiscountCode && (
            <View style={styles.appliedCouponContainer}>
              <View style={styles.appliedCouponBadge}>
                <Text style={styles.appliedCouponText}>{appliedDiscountCode}</Text>
              </View>
              <Text style={styles.appliedCouponAmount}>
                {getDiscountDisplay()}
              </Text>
              <TouchableOpacity 
                style={styles.removeCouponButton}
                onPress={clearDiscount}
              >
                <Text style={styles.removeCouponButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        {/* Payment Summary */}
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryDivider} />
          <View style={styles.paymentSummaryCard}>
            {/* Product Price */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Product Price:</Text>
              <Text style={styles.summaryAmount}>${getSafeNumber(allProductList?.data?.product[0]?.price).toFixed(2)}</Text>
            </View>
            
            {/* Shipping Cost */}
            {selectedShippingRate && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping Cost:</Text>
                <Text style={styles.summaryAmount}>${getSafeNumber(selectedShippingRate.rate).toFixed(2)}</Text>
              </View>
            )}
            
            {/* Subtotal */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={[styles.summaryAmount, { fontFamily: fonts.bold }]}>${getSubtotal().toFixed(2)}</Text>
            </View>
            
            {/* Discount */}
            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount:</Text>
                <Text style={[styles.summaryAmount, { color: '#FF6B6B' }]}>{getDiscountDisplay()}</Text>
              </View>
            )}
            
            {/* Final Total */}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={[styles.summaryAmount, { color: colors.primary, fontFamily: fonts.bold, fontSize: fontSizes.huge }]}>${getFinalAmount().toFixed(2)}</Text>
            </View>
            
            {/* Payment Method Breakdown */}
            {paymentMethod === 'wallet' && !isWalletPaymentDisabled() && (
              <>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Payment Method:</Text>
                  <Text style={[styles.summaryAmount, { color: colors.primary }]}>Wallet Payment</Text>
                </View>
                
                {getSafeNumber(walletData?.data?.wallet?.amount) >= getFinalAmount() ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Wallet Balance:</Text>
                    <Text style={[styles.summaryAmount, { color: colors.primary }]}>${getSafeNumber(walletData?.data?.wallet?.amount).toFixed(2)}</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>From Wallet:</Text>
                      <Text style={[styles.summaryAmount, { color: colors.primary }]}>${getSafeNumber(walletData?.data?.wallet?.amount).toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>From Stripe:</Text>
                      <Text style={styles.summaryAmount}>${(getFinalAmount() - getSafeNumber(walletData?.data?.wallet?.amount)).toFixed(2)}</Text>
                    </View>
                  </>
                )}
              </>
            )}
            
            {paymentMethod === 'stripe' && (
              <>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Payment Method:</Text>
                  <Text style={[styles.summaryAmount, { color: colors.primary }]}>Credit/Debit Card</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buyContainer}>
        <Button
          title={
            !isWalletLoading && paymentMethod === 'wallet' && !isWalletPaymentDisabled() && getSafeNumber(walletData?.data?.wallet?.amount) < getFinalAmount()
              ? `Pay $${getFinalAmount().toFixed(2)} (Wallet + Stripe)`
              : paymentMethod === 'stripe'
                ? `Pay $${getFinalAmount().toFixed(2)} with Card`
                : `Confirm Purchase - $${getFinalAmount().toFixed(2)}`
          }
          onPress={handleBuyNow}
          disabled={!selectedAddress || !allProductList?.data?.product[0] || !selectedShippingRate} // Disable if no address, product, or shipping
          style={[
            (!selectedAddress || !allProductList?.data?.product[0] || !selectedShippingRate) && styles.disabledButton
          ]}
        />
        
        {/* Show helpful message when button is disabled */}
        {(!selectedAddress || !allProductList?.data?.product[0] || !selectedShippingRate) && (
          <View style={styles.disabledButtonMessage}>
            <Text style={styles.disabledButtonText}>
              {!selectedAddress ? '📍 Please select a delivery address' :
               !allProductList?.data?.product[0] ? '📦 Product information is loading...' :
               !selectedShippingRate ? (isAddressChanged ? '🚚 Shipping rates not available for new address - click refresh button above' : '🚚 Please select a shipping option') : ''}
            </Text>
          </View>
        )}
      </View>

      <OrderSuccessfulModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        onSubmit={modalSucesss}
        onContinue={() => navigation.navigate(SCREENS.BottomTab)}
        title="Are You Sure?"
        description="Please confirm you want to Delete."
        estimatedDeliveryText={getEstimatedDeliveryText()}
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
                  rate_amount: selectedShippingRate ? selectedShippingRate.rate.toString() : '0',
                  address_id: addressId || 0,
                  rate_id: selectedShippingRate ? selectedShippingRate.id : '',
                  shipmentId: shippingID
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  discountText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#FF6B6B',
    marginLeft: 8,
  },
  finalPrice: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginTop: 4,
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
  disabledPaymentCard: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  hybridPaymentInfo: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.primary,
    marginTop: 6,
    textAlign: 'center',
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledPaymentInfo: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: '#FF6B6B',
    marginTop: 6,
    textAlign: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  // Payment Summary Styles
  paymentSummaryCard: {
    backgroundColor: '#F5F7F2',
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text2,
  },
  summaryAmount: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  discountContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  appliedCouponContainer: {
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appliedCouponBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  appliedCouponText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  appliedCouponAmount: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  removeCouponButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  removeCouponButtonText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: '#FF6B6B',
  },
  shippingStatusContainer: {
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  shippingStatusText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  shippingRatesText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginTop: 4,
  },
  // Additional styles for shipping rates
  requiredText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: '#FF6B6B',
  },
  errorText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: '#FF6B6B',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedRate: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  deliveryDateText: {
    color: colors.primary,
    fontFamily: fonts.medium,
  },

  // New pricing display styles
  shippingCostContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  shippingCostLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.text3,
  },
  shippingCostAmount: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  totalContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  subtotalText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    color: colors.text2,
    marginBottom: 4,
  },

  noRatesContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  noRatesText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    color: '#E65100',
    marginBottom: 4,
  },
  noRatesSubtext: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: '#E65100',
    textAlign: 'center',
  },
  addressChangedContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  addressChangedText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    color: '#E65100',
    marginBottom: 4,
  },
  addressChangedSubtext: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 12,
  },
  refreshRatesButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  refreshRatesButtonText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  disabledButtonMessage: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
    alignItems: 'center',
  },
  disabledButtonText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: '#E65100',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Shipping Option Card Styles
  shippingOptionCard: {
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  shippingOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  shippingOptionInfo: {
    flex: 1,
    marginRight: 16,
  },
  shippingOptionTitle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  shippingOptionSubtitle: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: colors.text2,
  },
  shippingOptionPrice: {
    alignItems: 'flex-end',
  },
  shippingPriceAmount: {
    fontSize: fontSizes.huge,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  shippingPriceCurrency: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.text3,
  },
  shippingOptionDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  shippingOptionDetailsText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.text3,
    textAlign: 'center',
  },

  // Loading styles for shipping options
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  loadingText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: '#1976D2',
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: '#1976D2',
    textAlign: 'center',
  },

  // USPS Priority specific styles
  uspsPriorityCard: {
    backgroundColor: '#e8f5e8',
    borderColor: '#2e7d32',
    borderWidth: 2,
  },
  shippingOptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priorityBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityBadgeText: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  uspsPriorityInfo: {
    fontSize: fontSizes.small,
    fontFamily: fonts.medium,
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  shippingText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: '#2e7d32',
    marginTop: 8,
    fontStyle: 'italic',
  },

});