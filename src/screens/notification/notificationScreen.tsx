/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {RootStackParamList, SCREENS} from '../../navigation/mainNavigation';
import colors from '../../utils/colors';
import {fontSizes} from '../../utils/utils';
import fonts from '../../assets/fonts/fonts';
import {useQuery} from '@tanstack/react-query';
import moment from 'moment';
// import IMAGE from '../../assets/images';
import {showLoader} from '../../components/loader/loader';
import TitleBackHeaderContainer from '../../components/headerContainer/titleBackHeaderContainer';
import {getNotification} from '../../utils/apiAction';
import IconsSvg from '../../assets/svg/iconsSvg';

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
};

const NotificationScreen: React.FC<NotificationScreenProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const styles = getStyles();
  const {data: getAllNotification} = useQuery({
    queryKey: ['fetchNotification'],
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

  const renderNotification = ({item}: {item: Notification}) => {
    return (
      <View style={[styles.notificationCard]}>
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
      </View>
    );
  };

  return (
    <>
      <TitleBackHeaderContainer
        isBack
        title="Notification"
        isNormalHeader={false}>
        {getAllNotification?.data?.notification?.length > 0 ? (
          <View>
            <FlatList
              data={getAllNotification?.data?.notification}
              renderItem={renderNotification}
              keyExtractor={item => item.id}
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
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.emptyText}>
              {'No notifications available.'}
            </Text>
          </View>
        )}
      </TitleBackHeaderContainer>
    </>
  );
};

export default NotificationScreen;

const getStyles = () =>
  StyleSheet.create({
    listContainer: {
      paddingHorizontal: 20,
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
      borderRadius: 5,
      marginTop: 20,
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
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
