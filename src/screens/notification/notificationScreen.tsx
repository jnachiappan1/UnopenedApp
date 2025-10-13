/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import {useMutation, useQuery} from '@tanstack/react-query';
import moment from 'moment';
// import IMAGE from '../../assets/images';
import {showLoader} from '../../components/loader/loader';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {
  getNotification,
  updateNotificationAction,
  readSingleNotificationAction,
} from '../../utils/apiAction';
import IconsSvg from '../../assets/svg/iconsSvg';
import NotificationHeader from '../../components/headerContainer/notificationHeader';
import {formatProdErrorMessage} from '@reduxjs/toolkit';

type NotificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.NotificationScreen
>;

type Notification = {
  createdAt: string;
  body: string;
  title: string;
  id: string;
  type: string;
  date: string;
  message: string;
  color: string;
  isRead: boolean;
  meta_data: {
    product_id?: number;
    wallet_id?: number;
  } | null;
};

const NotificationScreen: React.FC<NotificationScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const styles = getStyles();
  const {data: getAllNotification, refetch} = useQuery({
    queryKey: ['notification'],
    queryFn: getNotification,
    refetchInterval: 10000,
  });

  const clearNotification = () => {
    showLoader(true);
    // deleteData();
  };
  const getRelativeTimeShort = (dateString: string) => {
    const date = moment(dateString);
    const now = moment();
    const minutes = now.diff(date, 'minutes');
    if (minutes < 60) {
      return `${Math.max(minutes, 1)}m ago`;
    }
    const hours = now.diff(date, 'hours');
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = now.diff(date, 'days');
    if (days < 7) {
      return `${days}d ago`;
    }
    return date.format('MMM D');
  };

  const handleNotificationPress = async (item: Notification) => {
    try {
      // Mark notification as read
      await readSingleNotificationAction(item.id);
      refetch();

      // Navigate based on notification type
      const meta = item.meta_data as any;

      switch (item.type) {
        case 'product':
        case 'product_approval':
          if (meta?.product_id) {
            // Navigate to ProductDetailScreen for product-related notifications
            navigation.navigate(SCREENS.ProductDetailScreen, {
              productId: meta.product_id,
            });
          }
          break;

        case 'product_sold':
          if (meta?.product_id) {
            // Seller's product sold - navigate to ProductDetailScreen
            navigation.navigate(SCREENS.ProductDetailScreen, {
              productId: meta.product_id,
            });
          } else {
            // Navigate to Sales screen if no product_id
            navigation.navigate(SCREENS.BottomTab, {
              screen: SCREENS.SalesScreen,
            });
          }
          break;

        case 'order':
        case 'purchase':
          if (meta?.product_id) {
            // Navigate to order tracking or order detail screen
            navigation.navigate(SCREENS.OrderTrackScreen, {
              productId: meta.product_id,
            });
          } else {
            // Navigate to My Orders screen
            navigation.navigate(SCREENS.BottomTab, {
              screen: SCREENS.MyOrderScreen,
            });
          }
          break;

        case 'wallet':
          // Navigate to Wallet screen
          navigation.navigate(SCREENS.BottomTab, {
            screen: SCREENS.WalletScreen,
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const renderNotification = ({item}: {item: Notification}) => {
    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
        style={[
          styles.notificationCard,
          !item.isRead && styles.unreadNotificationCard,
        ]}>
        <View style={styles.row}>
          {/* <View
            style={[
              styles.leftStatus,
              {borderColor: item.color || colors.primary},
            ]}>
            <View
              style={[
                styles.leftStatusDot,
                {backgroundColor: item.color || colors.primary},
              ]}
            />
          </View> */}
          <View style={styles.content}>
            <Text style={styles.titleText} numberOfLines={2}>
              {item?.title}
            </Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item?.body}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {getRelativeTimeShort(item?.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const {mutate: readData} = useMutation({
    mutationFn: updateNotificationAction,
    onSuccess: () => {},
    onError: (error: any) => {
      formatProdErrorMessage(error.message);
    },
    onSettled: () => {
      showLoader(false);
      refetch();
    },
  });
  const readNotification = () => {
    showLoader(true);
    readData();
  };

  const notifications = getAllNotification?.data?.notification || [];
  const allRead = getAllNotification?.data?.is_all_notification_read;

  return (
    <>
      {/* <TitleBackHeaderContainer
        isBack
        title="Notification"
        isNormalHeader={false}> */}
      <NotificationHeader
        title="Notification"
        isBack
        isDelete
        onDelete={clearNotification}
        onRead={readNotification}
        allRead={allRead}
        notificationCount={notifications.length}>
        {notifications?.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Today</Text>
              </View>
            }
            // onEndReached={loadMore}
            ListFooterComponent={
              <>
                {loading && (
                  <View style={styles.footer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}
              </>
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.container}>
            <Text style={styles.emptyText}>
              {'No notifications available.'}
            </Text>
          </View>
        )}
      </NotificationHeader>
    </>
  );
};

export default NotificationScreen;

const getStyles = () =>
  StyleSheet.create({
    listContainer: {
      paddingHorizontal: 5,
      paddingBottom: 30,
    },
    sectionHeader: {
      paddingTop: 10,
      paddingBottom: 4,
    },
    sectionHeaderText: {
      fontSize: fontSizes.medium,
      fontFamily: fonts.bold,
      color: colors.darkGray,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationCard: {
      backgroundColor: colors.white,
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      position: 'relative',
    },
    unreadNotificationCard: {
      backgroundColor: '#26000010',
    },
    row: {flexDirection: 'row', alignItems: 'flex-start'},
    leftStatus: {
      height: 36,
      width: 36,
      borderRadius: 18,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    leftStatusDot: {height: 10, width: 10, borderRadius: 5},
    content: {flex: 1},
    titleText: {
      fontSize: fontSizes.regular,
      fontFamily: fonts.bold,
      color: colors.title,
    },
    notificationMessage: {
      fontSize: fontSizes.small,
      fontFamily: fonts.regular,
      color: colors.text,
      marginTop: 10,
    },
    timeText: {
      fontSize: fontSizes.small,
      fontFamily: fonts.regular,
      color: colors.darkGray,
      marginLeft: 10,
    },
    clearButton: {
      backgroundColor: colors.lightRed,
      paddingVertical: 12,
      borderRadius: 27,
      marginHorizontal: 20,
      alignItems: 'center',
      alignSelf: 'center',

      width: '50%',
      marginTop: 30,
    },
    clearButtonText: {
      fontSize: fontSizes.regular,
      fontFamily: fonts.regular,
      color: colors.text,
    },
    emptyText: {
      fontSize: fontSizes.large,
      fontFamily: fonts.bold,
      color: colors.text,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    image: {height: 140, width: '65%', marginBottom: 100},
    footer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
  });
