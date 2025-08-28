import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import React, { useState } from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import { fontSizes } from '../../utils/utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SCREENS } from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import StatusBadge from '../../components/card/statusBadge';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import { contactUs, getProductDetailByID, trackShipment } from '../../utils/apiAction';
import { useMutation, useQuery } from '@tanstack/react-query';
import { image_url } from '../../utils/api';
import ContactSupportModal from '../../components/model/contactSupportModal';
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';
import { ContactSupportType } from '../../utils/types';
import { showLoader } from '../../components/loader/loader';
import { showAlert } from '../../components/cAlert';
import { handleError, handleSettled } from '../../utils/method';

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

const OrderTrackScreen: React.FC<OrderTrackScreenProps> = ({ navigation, route }) => {
  const productId = route.params;
  const [isContactSupportModalVisible, setIsContactSupportModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const userData = useSelector((state: IRootState) => state.user.userData);
  const trackingUrl =
  "https://track.easypost.com/djE6dHJrXzExZmEyZWUwNmY2NTRiM2FhMmJjZDRlNjg0ZmVhNThk";

  const { data: productDetail, refetch: refetchAllProduct } = useQuery({
    queryKey: ['getProductDetailByID', productId?.productId],
    queryFn: () => getProductDetailByID(productId?.productId),
  });

  const { data: shippingTrackingData, isLoading: isTrackingLoading } = useQuery({
    queryKey: ['trackShipment', productDetail?.data?.product[0]?.shipment_id],
    queryFn: () => trackShipment(productDetail?.data?.product[0]?.shipment_id),
    enabled: !!productDetail?.data?.product[0]?.shipment_id,
  });

  console.log(JSON.stringify(productDetail), "productDetail------");
  console.log(JSON.stringify(shippingTrackingData), "shippingTrackingData------");

  const generateTrackingSteps = (status: string) => {
    // If we have shipping tracking data, use it
    if (shippingTrackingData?.tracking?.details) {
      const trackingDetails = shippingTrackingData.tracking.details;
      const overallStatus = shippingTrackingData.tracking.status;

      // Group by status and get latest from each category
      const preTransitSteps = trackingDetails.filter((step: any) => step.status === 'pre_transit');
      const inTransitSteps = trackingDetails.filter((step: any) => step.status === 'in_transit');
      const outForDeliverySteps = trackingDetails.filter((step: any) => step.status === 'out_for_delivery');
      const deliveredSteps = trackingDetails.filter((step: any) => step.status === 'delivered');

      const steps: TrackingStep[] = [];

      // Helper function to get latest step from array
      const getLatestStep = (stepsArray: any[]) => {
        return stepsArray.sort((a: any, b: any) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        )[0];
      };

      // Always add Pre-Transit step
      if (preTransitSteps.length > 0) {
        const latestPreTransit = getLatestStep(preTransitSteps);
        console.log(latestPreTransit, "latestPreTransit===");
        steps.push({
          id: 1,
          title: 'Pre-Transit',
          subtitle: latestPreTransit.tracking_location?.city
            ? `${latestPreTransit.tracking_location.city}, ${latestPreTransit.tracking_location.state}`
            : '',
          date: new Date(latestPreTransit.datetime).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          isCompleted: true,
        });
      }

      // Add In Transit step only if it has occurred OR if we're past this stage
      if (inTransitSteps.length > 0 || outForDeliverySteps.length > 0 || deliveredSteps.length > 0) {
        if (inTransitSteps.length > 0) {
          const latestInTransit = getLatestStep(inTransitSteps);
          console.log(latestInTransit, "latestInTransit---");

          steps.push({
            id: 2,
            // title: latestInTransit.message || 'In Transit',
            title:  'In Transit',
            subtitle: latestInTransit.tracking_location?.city
              ? `${latestInTransit.tracking_location.city}, ${latestInTransit.tracking_location.state}`
              : '',
            date: new Date(latestInTransit.datetime).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            isCompleted: true,
          });
        } else {
          // Show completed in transit if we're past this stage
          steps.push({
            id: 2,
            title: 'In Transit',
            subtitle: 'Package in transit',
            date: 'Completed',
            isCompleted: true,
          });
        }
      }

      // Add Out for Delivery step only if it has occurred OR if delivered
      if (outForDeliverySteps.length > 0 || deliveredSteps.length > 0) {
        if (outForDeliverySteps.length > 0) {
          const latestOutForDelivery = getLatestStep(outForDeliverySteps);
          steps.push({
            id: 3,
            title: 'Out for Delivery',
            subtitle: latestOutForDelivery.tracking_location?.city
              ? `${latestOutForDelivery.tracking_location.city}, ${latestOutForDelivery.tracking_location.state}`
              : '',
            date: new Date(latestOutForDelivery.datetime).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
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
        }
      }

      // Add Delivered step
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
            minute: '2-digit'
          }),
          isCompleted: true,
        });
      } else {
        // Show next expected step based on current status
        if (overallStatus === 'out_for_delivery') {
          steps.push({
            id: 4,
            title: 'Delivered',
            subtitle: 'Package will be delivered',
            date: 'Expected soon',
            isCompleted: false,
          });
        }
        // Don't show delivered step if we're still in pre_transit or in_transit
      }

      return steps;
    }

    // Fallback to hardcoded steps if no shipping tracking data
    const baseSteps = [
      {
        id: 1,
        title: 'Pre Transit',
        date: '7 May 2023 | 23:11',
        isCompleted: true,
        // isCompleted: status === 'pre_transit',
      },
      {
        id: 2,
        title: 'Label Sent',
        subtitle: 'Shipping label generated, sent to seller',
        date: '16 June 2025',
        isCompleted: status === 'in_transit' || status === 'out_for_delivery' || status === 'delivered',
      },
      {
        id: 3,
        title: 'In Transit',
        subtitle: 'Package picked up and in transit',
        date: '17 June 2025',
        isCompleted: status === 'out_for_delivery' || status === 'delivered',
      },
      {
        id: 4,
        title: 'Delivered',
        subtitle: 'Order delivered to your address',
        date: '20 June 2025',
        isCompleted: status === 'delivered',
      },
    ];

    return baseSteps;
  };

  // Use shipping tracking status if available, otherwise use product status
  const trackingSteps = generateTrackingSteps(
    shippingTrackingData?.tracking?.status || productDetail?.data?.product[0]?.status
  );

  const { mutate } = useMutation({
    mutationFn: contactUs,
    onSuccess: (data) => {
      showLoader(false);
      showAlert({
        isVisible: true,
        type: 'success',
        title: 'Support Request Sent',
        description: 'Your message has been sent successfully. Our support team will contact you shortly.',
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
  }

  const renderTrackingStep = (item: any, index: number) => {
    return (
      <View key={item.id} style={styles.trackingStepContainer}>
        <View style={styles.trackingIconContainer}>
          {/* Render check mark for completed steps, gray circle for incomplete */}
          <View style={[
            styles.trackingIcon,
            item.isCompleted && styles.completedIcon
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
          <Text style={[
            styles.trackingTitle,
            !item.isCompleted && styles.incompleteText
          ]}>
            {item.title}
          </Text>
          {item.isCompleted && item.subtitle && (
            <Text
              style={[
                styles.trackingSubtitle,
                !item.isCompleted && styles.incompleteText,
              ]}
            >
              {item.subtitle}
            </Text>
          )}

          {/* Show date only if step is completed */}
          {item.isCompleted && (
            <Text
              style={[
                styles.trackingDate,
                !item.isCompleted && styles.incompleteText,
              ]}
            >
              Date: {item.date}
            </Text>
          )}

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
                source={{ uri: image_url + productDetail?.data?.product[0]?.product_image[0]?.image }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.titleStyle}>{productDetail?.data?.product[0]?.name}</Text>
                <Text style={styles.descriptionStyle}>
                  Delivered On: {
                    shippingTrackingData?.tracking?.actual_delivery
                      ? new Date(shippingTrackingData.tracking.actual_delivery).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                      : '15 Jun, 2025'
                  }
                </Text>
                <Text style={[styles.mrspStyle]}>${productDetail?.data?.product[0]?.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {isTrackingLoading ? (
          <Text style={{ padding: 16 }}>Loading tracking info...</Text>
        ) : trackingSteps && trackingSteps.length > 0 ? (
          <>
            <Text style={styles.headingStyle}>Track Your Order</Text>
            <View style={styles.container}>
            <TouchableOpacity onPress={() => Linking.openURL(trackingUrl)}>
  <Text style={styles.trackText}>Track your order</Text>
</TouchableOpacity>
            <View >
              {trackingSteps.map((item, index) => renderTrackingStep(item, index))}
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
            }}
          >
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
  trackText:{
    textAlign:'right',
    paddingHorizontal:10,
    paddingTop:10,
    color:colors.primary,fontSize:fontSizes.small,fontFamily:fonts.bold,marginBottom:10}
});