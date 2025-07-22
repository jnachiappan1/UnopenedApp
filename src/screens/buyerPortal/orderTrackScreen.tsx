import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {fontSizes, width} from '../../utils/utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import StatusBadge from '../../components/card/statusBadge';
import fonts from '../../assets/fonts/fonts';
import InfoRow from '../../components/card/infoRow';
import Button from '../../components/button/buttons';
import IconsSvg from '../../assets/svg/iconsSvg';

type OrderTrackScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.OrderTrackScreen
>;

const OrderTrackScreen: React.FC<OrderTrackScreenProps> = ({navigation, route}) => {
  // Get the order data from route params, with fallback to default data
  const passedOrderData = route.params;
  console.log("passedOrderData", passedOrderData);
  
  // const [orderData] = useState(passedOrderData);

  // Generate tracking steps based on the order status
  const generateTrackingSteps = (status: string) => {
    const baseSteps = [
      {
        id: 1,
        title: 'Order Confirmed',
        date: '7 May 2023 | 23:11',
        isCompleted: true,
      },
      {
        id: 2,
        title: 'Label Sent',
        subtitle: 'Shipping label generated, sent to seller',
        date: '16 June 2025',
        isCompleted: status === 'In Transit' || status === 'Delivered',
      },
      {
        id: 3,
        title: 'In Transit',
        subtitle: 'Package picked up and in transit',
        date: '17 June 2025',
        isCompleted: status === 'Delivered',
      },
      {
        id: 4,
        title: 'Delivered',
        subtitle: 'Order delivered to your address',
        date: '20 June 2025',
        isCompleted: status === 'Delivered',
      },
    ];

    // Filter steps based on status
    switch (status) {
      case 'Pending':
        return baseSteps.slice(0, 1);
      case 'In Transit':
        return baseSteps.slice(0, 3);
      case 'Delivered':
        return baseSteps;
      default:
        return baseSteps;
    }
  };

  const trackingSteps = generateTrackingSteps(passedOrderData?.productId?.status);

  const renderTrackingStep = (item: any, index: number) => {
    return (
      <View key={item.id} style={styles.trackingStepContainer}>
        <View style={styles.trackingIconContainer}>
          <IconsSvg name="trackOrderIcon" />
          {/* <View style={[styles.trackingIcon, item.isCompleted && styles.completedIcon]}>
            {item.isCompleted && <Text style={styles.checkMark}>✓</Text>}
          </View> */}
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
          <Text style={styles.trackingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.trackingSubtitle}>{item.subtitle}</Text>
          )}
          <Text style={styles.trackingDate}>Date: {item.date}</Text>
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
              <Text style={styles.orderId}>{passedOrderData?.productId?.order_Id}</Text>
            </View>
            <View>
              <StatusBadge status={passedOrderData?.productId?.status} />
            </View>
          </View>
          <View style={styles.borderLine} />
          {/* Product Details */}
          <View style={styles.imageDetailContainer}>
            <View style={styles.productRow}>
              <Image
                source={{uri: passedOrderData?.productId.image}}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.titleStyle}>{passedOrderData?.productId.title}</Text>
                <Text style={styles.descriptionStyle}>
                  Delivered On: {passedOrderData?.productId.delivered_On}
                </Text>
                <Text style={[styles.mrspStyle]}>{passedOrderData?.productId.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tracking Section */}
        <Text style={styles.headingStyle}>Track Your Order</Text>
        <View style={styles.container}>
          {trackingSteps.map((item, index) => renderTrackingStep(item, index))}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.headingText}>Need help with your order?</Text>
          <View style={styles.lineStyle} />
          <TouchableOpacity style={styles.helpOption}>
            <View style={styles.helpIconContainer}>
              <IconsSvg name="helpSupportIcon" />
            </View>
            <Text style={styles.helpText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpOption}>
            <View style={styles.helpIconContainer}>
              <IconsSvg name="raiseTicketIcon" />
            </View>
            <Text style={styles.helpText}>Raise a Ticket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginBottom: 16,
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
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkMark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  connectingLine: {
    width: 2,
    height: 50,
    backgroundColor: colors.primary,
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
});