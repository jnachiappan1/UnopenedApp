import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import commonStyles from '../../utils/common-styles';
import { IColors, getColors } from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../navigation/mainNavigation';
import { KeyboardAvoidingView } from 'react-native';
import IconsSvg from '../../assets/svg/iconsSvg';
import IMAGE from '../../assets/images';
import { fontSizes } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserType } from '../../redux/reducers/user/UserReducer';
import { IRootState } from '../../redux/store';
import { useContainer } from '../hooks/useContainer';
import { image_url } from '../../utils/api';
import { viewProfile, getNotification } from '../../utils/apiAction';
import { useQuery } from '@tanstack/react-query';

type HeaderHomeContainerProps = {
  children?: React.ReactNode | undefined;
  title?: string;
  isBack?: boolean;
  isSearch?: boolean;
  isHome?: boolean;
  userName?: string;
  onPressBack?: () => void;
  isBackNavigation?: boolean;
  isNewNotification?: boolean;
  refreshing?: boolean;
  onRefresh?: (() => void) | undefined;
  isNormalHeader?: boolean;
  isNotification?: boolean;
  onSearchPress?: () => void;
  profileImage?: string;
};
const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 30;

const HeaderHomeContainer: React.FC<HeaderHomeContainerProps> = props => {
  const {
    children,
    title = '',
    isBack = false,
    isSearch = true,
    isHome = false,
    userName = '',
    onPressBack = () => { },
    isBackNavigation = false,
    isNewNotification = false,
    refreshing = false,
    onRefresh,
    isNormalHeader = false,
    isNotification = true,
    onSearchPress,
    profileImage
  } = props;
  const navigation = useNavigation<string | any>();
  const colors = getColors();
  const styles = getStyles(colors);
  const dispatch = useDispatch();
  const container = useContainer();
  const userType = useSelector((state: IRootState) => state.user.userType);
  const token = useSelector((state: IRootState) => state.user.token);
  
  const { data: notificationData } = useQuery({
    queryKey: ['notification'],
    queryFn: getNotification,
    refetchInterval: 10000,
    enabled: !!token, 
  });

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh || (() => {
     
      })}
      tintColor={colors.primary}
      enabled={!!onRefresh} 
    />
  );

  return (
    <View style={[container, commonStyles.container]}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <View style={commonStyles.headerRowContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.ProfileScreen)}>
          <Image
            source={
              profileImage
                ? { uri: profileImage.startsWith('http') ? profileImage : `${image_url}${profileImage}` }
                : IMAGE.profileImage
            }
            style={styles.icon}
          />
         
        </TouchableOpacity>
        <View style={styles.itemContainer}>
          <View style={{ width: '40%', paddingStart: 5}}>
            {isHome && userName && (
              <Text style={styles.user} numberOfLines={2}>{userName}</Text>
            )}
            <Text numberOfLines={1} style={styles.title}>
              {title} 
            </Text>
          </View>
          <View>
            <IconsSvg name='notificationIcon' onPress={() => navigation.navigate(SCREENS.NotificationScreen)} />
            {token && !notificationData?.data?.is_all_notification_read && (
              <View style={styles.notificationDot} />
            )}
          </View>
          <TouchableOpacity style={styles.userContainer}
            onPress={async () => {
              try {
                const newType = userType === 'buyer' ? 'seller' : 'buyer';
                if (newType === 'seller') {
                  try {
                    const response = await viewProfile();
                    const isAccepted = response?.data?.user?.is_seller_agreement === true;
                    dispatch(saveUserType('seller'));
                    navigation.navigate(
                      SCREENS.BottomTab,
                      !isAccepted
                        ? { screen: SCREENS.SHomeScreen, params: { openSellerAgreement: true } }
                        : { screen: SCREENS.SHomeScreen }
                    );
                  } catch (error) {
                    dispatch(saveUserType('seller'));
                    navigation.navigate(SCREENS.BottomTab, { screen: SCREENS.SHomeScreen });
                  }
                } else {
                  dispatch(saveUserType('buyer'));
                  navigation.navigate(SCREENS.BottomTab, { screen: SCREENS.BHomeScreen });
                }
              } catch (e) {}
            }}
          >
            <IconsSvg name='addUser' />
            <Text style={styles.buyerTitle}>
              {userType === 'buyer' ? 'Sell' : 'Buy'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isNormalHeader ? (
        <View style={{ flex: 1 }}>
          {children}
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={HEADER_MIN_HEIGHT}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default HeaderHomeContainer;

const getStyles = (colors: IColors) =>
  StyleSheet.create({
    icon: {
      height: 48,
      width: 48,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 24,
    },
    back: {
      width: 24,
      height: 24,
      marginEnd: 8,
      justifyContent: 'center',
    },
    dot: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 12,
      width: 12,
      right: 12,
      bottom: 14,
    },
    title: {
      fontSize: fontSizes.large,
      fontFamily: fonts.bold,
      color: colors.title,
    },
    itemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent:'space-between'
      // width: "82%"
    },
    user: {
      fontSize: fontSizes.regularSmall,
      fontFamily: fonts.medium,
      color: colors.text,
      marginTop: 2,
    },
    userContainer: {
      flexDirection: "row",
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginStart: 8,
      borderRadius: 50,
      borderColor: colors.primary,
      backgroundColor: colors.white,
      borderWidth: 1,
    
    },
    buyerTitle: {
      fontSize: fontSizes.medium,
      fontFamily: fonts.bold,
      color: colors.primary,
      paddingHorizontal: 5
    },
    notificationDot: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: 'red',
      borderRadius: 6,
      height: 12,
      width: 12,
      borderWidth: 2,
      borderColor: colors.background,
    },
  });