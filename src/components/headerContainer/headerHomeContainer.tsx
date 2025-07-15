import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
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
    refreshing,
    onRefresh,
    isNormalHeader = false,
    isNotification = true,
    onSearchPress

  } = props;
  const navigation = useNavigation<string | any>();
  const colors = getColors();
  const styles = getStyles(colors);

  const onBackPress = () => {
    navigation.goBack();
  };
  // const onSearchPress = () => {
  //   navigation.navigate(SCREENS.SearchScreen, {title: title});
  // };
  const onNotificationPress = () => {
    //navigation.navigate(SCREENS.NotificationScreen);
  };
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerRowContainer}>
        <Image source={IMAGE.profileImage} style={styles.icon} />

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
          <TouchableOpacity style={styles.userContainer}>
            <IconsSvg name='addUser' />
            <Text style={styles.buyerTitle}>
              {"Buyer"}
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
            refreshControl={
              refreshing ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                />
              ) : (
                <></>
              )
            }>
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
      fontWeight: '600',
      color: colors.title,
    },
    itemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      width: "82%"
    },
    user: {
      fontSize: fontSizes.regularSmall,
      fontWeight: '700',
      fontFamily: fonts.regular,
      color: colors.primary,
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
      fontWeight: '600',
      color: colors.primary,
      paddingHorizontal: 5
    },
  });
