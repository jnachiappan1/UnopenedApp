import {
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import {useNavigation} from '@react-navigation/native';
import commonStyles from '../../utils/common-styles';
import colors from '../../utils/colors';
import {fontSizes, OS, width} from '../../utils/utils';
import { useContainer, useNormalContainer } from '../hooks/useContainer';
import { SafeAreaView } from 'react-native-safe-area-context';

type TitleBackHeaderContainerProps = {
  children?: React.ReactNode | undefined;
  title?: string;
  isBack?: boolean;
  userName?: string;
  isRight?: boolean;
  isSearch?: boolean;
  isMenu?: boolean;
  isDriver?: boolean;
  isUpload?: boolean;
  isScanner?: boolean;
  isThreeDot?: boolean;
  refreshing?: boolean;
  isNormalHeader?: boolean;
  onRefresh?: (() => void) | undefined;
  isAddMore?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  headerRowContainerStyle?: StyleProp<ViewStyle>;
  onThreeDotPress?: () => void;
  isScannerPress?: () => void;
};

const TitleBackHeaderContainer: React.FC<
  TitleBackHeaderContainerProps
> = props => {
  const {
    children,
    title = '',
    isBack = false,
    isSearch = false,
    isMenu = false,
    isUpload = false,
    isScanner = false,
    isDriver = false,
    isThreeDot = false,
    isAddMore = false,
    isNormalHeader = true,
    containerStyle,
    refreshing,
    onRefresh,
    headerRowContainerStyle,
    onThreeDotPress,
    isScannerPress,
  } = props;
  const navigation = useNavigation<string | any>();
  const container = useNormalContainer();
  const onBackPress = () => {
    navigation.goBack();
  };
  const HEADER_MIN_HEIGHT = 30;
  return (
    <View style={[container,{ flex: 1, backgroundColor: colors.background }, containerStyle]}>
      <View style={[styles.headerRowContainer, headerRowContainerStyle]}>
        {isBack && (
            <TouchableOpacity
              style={[styles.back, {}]}
              onPress={onBackPress}>
              <IconsSvg name="backArrow" />
            </TouchableOpacity>
          )}
           <Text style={styles.title}>
            {title}
          </Text>
      </View>
      {!isNormalHeader ? (
  <View style={{ flex: 1 }}>
    {children}</View>
) : (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={OS === 'ios' ? 'padding' : 'height'}
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
        ) : <></>
      }>
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
)}
      {/* <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={OS === 'ios' ? 'padding' : 'height'}
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
        </KeyboardAvoidingView> */}
      {/* <View style={[styles.childrenView, containerStyle]}>{children}</View> */}
    </View>
  );
};

export default TitleBackHeaderContainer;

const styles = StyleSheet.create({
  headerRowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width:width,
    height:60,
    marginStart:4,
    paddingHorizontal:10,
  },
  childrenView: {backgroundColor: colors.background},
  back: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
  },
  searchIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: 40,
    marginEnd: 10,
  },
  title: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.black,
    flex: 1,
    paddingStart:10,
  },
  addMoreText: {
    fontSize: fontSizes.regular,
    // fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
