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
    onSearchPress

  } = props;
  const navigation = useNavigation<string | any>();
  const colors = getColors();
  const styles = getStyles(colors);
  const dispatch = useDispatch();
  const container = useContainer();
  const userType = useSelector((state: IRootState) => state.user.userType);
  
  const onBackPress = () => {
    navigation.goBack();
  };
  
  const onNotificationPress = () => {
    //navigation.navigate(SCREENS.NotificationScreen);
  };

  // Always provide RefreshControl, but only make it functional when onRefresh is provided
  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh || (() => {
        console.log('RefreshControl triggered but no onRefresh handler provided');
      })}
      tintColor={colors.primary}
      enabled={!!onRefresh} // Only enable pull-to-refresh when onRefresh is provided
    />
  );

  return (
    <View style={[container, commonStyles.container]}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <View style={commonStyles.headerRowContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.ProfileScreen)}>
          <Image source={IMAGE.profileImage} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.itemContainer}>
          <View style={{ width: '48%', paddingStart: 5 }}>
            {isHome && userName && (
              <Text style={styles.user}>{userName}</Text>
            )}
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          </View>
          <IconsSvg name='notificationIcon' />
          <TouchableOpacity style={styles.userContainer}
            onPress={() => {
              const newType = userType === 'buyer' ? 'seller' : 'buyer';
              dispatch(saveUserType(newType));
            }}
          >
            <IconsSvg name='addUser' />
            <Text style={styles.buyerTitle}>
              {userType === 'buyer' ? 'Seller' : 'Buyer'}
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
      marginStart: 10,
      borderRadius: 50,
      borderColor: colors.primary,
      backgroundColor: colors.white,
      borderWidth: 1
    },
    buyerTitle: {
      fontSize: fontSizes.medium,
      fontFamily: fonts.bold,
      color: colors.primary,
      paddingHorizontal: 5
    },
  });