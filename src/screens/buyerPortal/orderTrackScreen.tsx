import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {fontSizes} from '../../utils/utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import StatusBadge from '../../components/card/statusBadge';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import {
  contactUs,
  getProductDetailByID,
  trackShipment,
  createShipping,
} from '../../utils/apiAction';
import {useMutation, useQuery} from '@tanstack/react-query';
import {image_url} from '../../utils/api';
import ContactSupportModal from '../../components/model/contactSupportModal';
import {useSelector} from 'react-redux';
import {IRootState} from '../../redux/store';
import {ContactSupportType} from '../../utils/types';
import {showLoader} from '../../components/loader/loader';
import {showAlert} from '../../components/cAlert';
import {handleError, handleSettled} from '../../utils/method';

// Add interface for tracking step data
interface TrackingStep {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  isCompleted: boolean;
}

type OrderTrackScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.OrderTrackScreen
>;

const OrderTrackScreen: React.FC<OrderTrackScreenProps> = ({
  navigation,
  route,
}) => {
  const productId = route.params;
  const [isContactSupportModalVisible, setIsContactSupportModalVisible] =
    useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [shipmentId, setShipmentId] = useState<string | null>(null);
  const userData = useSelector((state: IRootState) => state.user.userData);

  const {data: productDetail, refetch: refetchAllProduct} = useQuery({
    queryKey: ['getProductDetailByID', productId?.productId],
    queryFn: () => getProductDetailByID(productId?.productId),
  });

  const addressId = productDetail?.data?.product[0]?.address_id;

  // Create shipping when both productId and addressId are available
  const {data: createShippingData, isLoading: isCreatingShipping} = useQuery({
    queryKey: ['createShipping', productId?.productId, addressId],
    queryFn: () =>
      createShipping({
        product_id: productId?.productId?.toString() || '',
        address_id: addressId || 0,
      }),
    enabled: !!(productId?.productId && addressId),
  });

  // Extract shipment_id when createShippingData is available
  React.useEffect(() => {
    if (createShippingData?.shipment?.id) {
      setShipmentId(createShippingData.shipment.id);
    }
  }, [createShippingData]);

  const {data: shippingTrackingData, isLoading: isTrackingLoading} = useQuery({
    queryKey: ['trackShipment', shipmentId],
    queryFn: () => trackShipment(shipmentId),
    enabled: !!shipmentId,
  });

  const trackingUrl = shippingTrackingData?.data?.tracking?.tracking_url;

  const generateTrackingSteps = (status: string) => {
    // If we have shipping tracking data, use it
    if (shippingTrackingData?.data?.tracking?.details) {
      const trackingDetails = shippingTrackingData.data.tracking.details;
      const overallStatus = shippingTrackingData.data.tracking.status;

      // Group by status and get latest from each category
      const preTransitSteps = trackingDetails.filter(
        (step: any) => step.status === 'pre_transit',
      );
      const inTransitSteps = trackingDetails.filter(
        (step: any) => step.status === 'in_transit',
      );

      const outForDeliverySteps = trackingDetails.filter(
        (step: any) => step.status === 'out_for_delivery',
      );
      const deliveredSteps = trackingDetails.filter(
        (step: any) => step.status === 'delivered',
      );

      const steps: TrackingStep[] = [];

      // Helper function to get latest step from array
      const getLatestStep = (stepsArray: any[]) => {
        return stepsArray.sort(
          (a: any, b: any) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
        )[0];
      };

      // Always add Pre-Transit step
      if (preTransitSteps.length > 0) {
        const latestPreTransit = getLatestStep(preTransitSteps);
        steps.push({
          id: 1,
          title: 'Pre-Transit',
          subtitle: latestPreTransit.tracking_location?.city
            ? `${latestPreTransit.tracking_location.city}, ${latestPreTransit.tracking_location.state}`
            : latestPreTransit.message || 'Package information received',
          date: new Date(latestPreTransit.datetime).toLocaleDateString(
            'en-US',
            {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            },
          ),
          isCompleted: true,
        });
      }

      // Always add In Transit step - completed if it has occurred OR if we're past this stage
      if (inTransitSteps.length > 0) {
        const latestInTransit = getLatestStep(inTransitSteps);
        steps.push({
          id: 2,
          title: 'In Transit',
          subtitle: latestInTransit.tracking_location?.city
            ? `${latestInTransit.tracking_location.city}, ${latestInTransit.tracking_location.state}`
            : latestInTransit.message || 'Package in transit',
          date: new Date(latestInTransit.datetime).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          isCompleted: true,
        });
      } else if (outForDeliverySteps.length > 0 || deliveredSteps.length > 0) {
        // Show completed in transit if we're past this stage
        steps.push({
          id: 2,
          title: 'In Transit',
          subtitle: 'Package in transit',
          date: 'Completed',
          isCompleted: true,
        });
      } else {
        // Show as upcoming step if we're still in pre_transit
        steps.push({
          id: 2,
          title: 'In Transit',
          subtitle: 'Package will be picked up',
          date: 'Pending',
          isCompleted: false,
        });
      }

      // Always add Out for Delivery step
      if (outForDeliverySteps.length > 0) {
        const latestOutForDelivery = getLatestStep(outForDeliverySteps);
        steps.push({
          id: 3,
          title: 'Out for Delivery',
          subtitle: latestOutForDelivery.tracking_location?.city
            ? `${latestOutForDelivery.tracking_location.city}, ${latestOutForDelivery.tracking_location.state}`
            : latestOutForDelivery.message || 'Package out for delivery',
          date: new Date(latestOutForDelivery.datetime).toLocaleDateString(
            'en-US',
            {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            },
          ),
          isCompleted: true,
        });
      } else if (deliveredSteps.length > 0) {
        // Show completed out for delivery if delivered
        steps.push({
          id: 3,
          title: 'Out for Delivery',
          subtitle: 'Package out for delivery',
          date: 'Completed',
          isCompleted: true,
        });
      } else {
        // Show as upcoming step
        steps.push({
          id: 3,
          title: 'Out for Delivery',
          subtitle: 'Package will be out for delivery',
          date: 'Pending',
          isCompleted: false,
        });
      }

      // Always add Delivered step
      if (deliveredSteps.length > 0) {
        const latestDelivered = getLatestStep(deliveredSteps);
        steps.push({
          id: 4,
          title: 'Delivered',
          subtitle: latestDelivered.tracking_location?.city
            ? `${latestDelivered.tracking_location.city}, ${latestDelivered.tracking_location.state}`
            : 'Package delivered successfully',
          date: new Date(latestDelivered.datetime).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          isCompleted: true,
        });
      } else {
        // Show as upcoming step
        steps.push({
          id: 4,
          title: 'Delivered',
          subtitle: 'Package will be delivered',
          date: shippingTrackingData?.data?.tracking?.estimated_delivery
            ? new Date(
                shippingTrackingData.data.tracking.estimated_delivery,
              ).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Expected soon',
          isCompleted: false,
        });
      }

      return steps;
    }

    // Fallback to hardcoded steps if no shipping tracking data
    const baseSteps = [
      {
        id: 1,
        title: 'Pre Transit',
        subtitle: 'Package information received',
        date: 'Pending',
        isCompleted: true,
      },
      {
        id: 2,
        title: 'Label Sent',
        subtitle: 'Shipping label generated, sent to seller',
        date:
          status === 'in_transit' ||
          status === 'out_for_delivery' ||
          status === 'delivered'
            ? 'Pending'
            : 'Pending',
        isCompleted:
          status === 'in_transit' ||
          status === 'out_for_delivery' ||
          status === 'delivered',
      },
      {
        id: 3,
        title: 'In Transit',
        subtitle: 'Package picked up and in transit',
        date:
          status === 'out_for_delivery' || status === 'delivered'
            ? 'Pending'
            : 'Pending',
        isCompleted: status === 'out_for_delivery' || status === 'delivered',
      },
      {
        id: 4,
        title: 'Delivered',
        subtitle: 'Order delivered to your address',
        date: status === 'delivered' ? 'Pending' : 'Expected soon',
        isCompleted: status === 'delivered',
      },
    ];

    return baseSteps;
  };

  // Use shipping tracking status if available, otherwise use product status
  const trackingSteps = generateTrackingSteps(
    shippingTrackingData?.data?.tracking?.status ||
      productDetail?.data?.product[0]?.status,
  );
  console.log('trackingSteps', trackingSteps);

  const {mutate} = useMutation({
    mutationFn: contactUs,
    onSuccess: data => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Support Request Sent',
        description:
          'Your message has been sent successfully. Our support team will contact you shortly.',
        doneText: 'Okay',
        onDonePress: () => {
          navigation.goBack();
        },
      });
    },
    onError: handleError,
    onSettled: handleSettled,
  });

  const handleMessageSubmit = (message: string) => {
    showLoader(true);
    const supportPayload: ContactSupportType = {
      full_name: userData?.full_name,
      country_code: userData?.country_code,
      phone_number: userData?.phone_number,
      email: userData?.email,
      message: message,
      product_id: productDetail?.data?.product[0]?.id,
    };
    mutate(supportPayload);
  };

  const renderTrackingStep = (item: any, index: number) => {
    return (
      <View key={item.id} style={styles.trackingStepContainer}>
        <View style={styles.trackingIconContainer}>
          {/* Render check mark for completed steps, gray circle for incomplete */}
          <View
            style={[
              styles.trackingIcon,
              item.isCompleted && styles.completedIcon,
            ]}>
            {item.isCompleted ? (
              <Text style={styles.checkMark}>✓</Text>
            ) : (
              <View style={styles.grayCircle} />
            )}
          </View>
          {index < trackingSteps.length - 1 && (
            <View
              style={[
                styles.connectingLine,
                item.isCompleted && styles.completedLine,
              ]}
            />
          )}
        </View>
        <View style={styles.trackingContent}>
          <Text
            style={[
              styles.trackingTitle,
              !item.isCompleted && styles.incompleteText,
            ]}>
            {item.title}
          </Text>

          {/* Always show subtitle if it exists */}
          {item.subtitle && (
            <Text
              style={[
                styles.trackingSubtitle,
                !item.isCompleted && styles.incompleteText,
              ]}>
              {item.subtitle}
            </Text>
          )}

          {/* Always show date/status */}
          <Text
            style={[
              styles.trackingDate,
              !item.isCompleted && styles.incompleteText,
            ]}>
            {item.isCompleted ? `Date: ${item.date}` : `Status: ${item.date}`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <TitleBackHeaderContainer isBack title="Track Order">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.orderIdRow}>
            <View>
              <Text style={styles.orderIdLabel}>Order ID</Text>
              <Text style={styles.orderId}>{'ORD#11458'}</Text>
            </View>
            <View>
              <StatusBadge
                status={
                  productDetail?.data?.product[0]?.product_activity_status
                }
              />
            </View>
          </View>
          <View style={styles.borderLine} />
          {/* Product Details */}
          <View style={styles.imageDetailContainer}>
            <View style={styles.productRow}>
              <Image
                source={{
                  uri:
                    image_url +
                    productDetail?.data?.product[0]?.product_image[1]?.image,
                }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.titleStyle}>
                  {productDetail?.data?.product[0]?.name}
                </Text>
                <Text style={styles.descriptionStyle}>
                  Delivered On:{' '}
                  {shippingTrackingData?.data?.tracking?.actual_delivery
                    ? new Date(
                        shippingTrackingData.data.tracking.actual_delivery,
                      ).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '15 Jun, 2025'}
                </Text>
                <Text style={[styles.mrspStyle]}>
                  ${productDetail?.data?.product[0]?.price}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {isCreatingShipping || isTrackingLoading ? (
          <Text style={{padding: 16}}>
            {isCreatingShipping
              ? 'Creating shipment...'
              : 'Loading tracking info...'}
          </Text>
        ) : trackingSteps && trackingSteps.length > 0 ? (
          <>
            <Text style={styles.headingStyle}>Track Your Order</Text>
            <View style={styles.container}>
              {trackingUrl && (
                <TouchableOpacity
                  onPress={() => {
                    if (trackingUrl) {
                      Linking.openURL(trackingUrl);
                    }
                  }}
                  style={styles.trackButton}>
                  <Text style={[styles.trackText]}>Track your order</Text>
                </TouchableOpacity>
              )}

              <View>
                {trackingSteps.map((item, index) =>
                  renderTrackingStep(item, index),
                )}
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.helpSection}>
          <Text style={styles.headingText}>Need help with your order?</Text>
          <View style={styles.lineStyle} />
          <TouchableOpacity
            style={styles.helpOption}
            onPress={() => {
              setModalKey(prev => prev + 1);
              setIsContactSupportModalVisible(true);
            }}>
            <View style={styles.helpIconContainer}>
              <IconsSvg name="helpSupportIcon" />
            </View>
            <Text style={styles.helpText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ContactSupportModal
        key={modalKey}
        isModalVisible={isContactSupportModalVisible}
        setModalVisible={setIsContactSupportModalVisible}
        onMessageSubmit={handleMessageSubmit}
      />
    </TitleBackHeaderContainer>
  );
};

export default OrderTrackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginTop: 10,
  },
  borderLine: {
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 10,
  },
  lineStyle: {
    borderWidth: 0.6,
    borderColor: colors.border,
    marginTop: 10,
  },
  orderIdLabel: {
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 10,
  },
  orderId: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  imageDetailContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 10,
    paddingVertical: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImage: {
    width: 91,
    height: 96,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  productDetails: {
    flex: 1,
  },
  titleStyle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.title,
    marginBottom: 4,
  },
  descriptionStyle: {
    fontSize: fontSizes.small,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginBottom: 8,
  },
  mrspStyle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  trackingSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  headingStyle: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.darkLabel,
    marginHorizontal: 20,
    marginTop: 10,
  },
  headingText: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.darkLabel,
  },
  trackingStepContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    padding: 10,
  },
  trackingIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  trackingIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  completedIcon: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  grayCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },
  checkMark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  connectingLine: {
    width: 2,
    height: 50,
    backgroundColor: '#E5E5E5',
  },
  completedLine: {
    backgroundColor: colors.primary,
    top: 5,
  },
  trackingContent: {
    flex: 1,
  },
  trackingTitle: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 2,
  },
  trackingSubtitle: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginBottom: 4,
  },
  trackingDate: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
    color: colors.text3,
  },
  incompleteText: {
    color: '#CCCCCC',
  },
  helpSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F5F7F2',
    borderRadius: 12,
    marginTop: 10,
  },
  helpIconContainer: {
    marginRight: 12,
    marginHorizontal: 10,
  },
  helpIcon: {
    fontSize: 20,
  },
  helpText: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.bold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  trackText: {
    textAlign: 'center',
    paddingTop: 10,
    color: colors.primary,
    fontSize: fontSizes.small,
    fontFamily: fonts.bold,
    marginBottom: 10,
  },
  trackButton: {
    width: '40%',
    alignSelf: 'flex-end',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#F5F7F2',
    marginBottom: 10,
    borderWidth: 1,
    borderBlockColor: colors.primary,
  },
});
