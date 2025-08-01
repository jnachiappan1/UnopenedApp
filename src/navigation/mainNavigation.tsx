/* eslint-disable @typescript-eslint/no-shadow */
// In App.js in a new project
import React from 'react';
import { View } from 'react-native';
// import BottomTabNav from './bottomTabNav';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useContainer } from '../components/hooks/useContainer';
import VerifyOTP from '../screens/auth/verifyOTP';
import LoginScreen from '../screens/auth/loginScreen';
import SignUpScreen from '../screens/auth/signUpScreen';
import BottomTabNav from './bottomTabNav';
import ProductDetailScreen from '../screens/sellerPortal/productDetailScreen';
import ProductListScreen from '../screens/sellerPortal/productListScreen';
import CashOutScreen from '../screens/wallet/cashOutScreen';
import AddFundScreen from '../screens/wallet/addFundScreen';
import BrowseScreen from '../screens/buyerPortal/browseScreen';
import MyOrderScreen from '../screens/buyerPortal/myOrderScreen';
import ProfileScreen from '../screens/profile/profileScreen';
import HelpSupportScreen from '../screens/profile/helpSupportScreen';
import PrivacyPolicyScreen from '../screens/profile/privacyPolicyScreen';
import TermsConditionsScreen from '../screens/profile/termsConditionsScreen';
import EditProfileScreen from '../screens/profile/editProfileScreen';
import ChangePasswordScreen from '../screens/profile/changePasswordScreen';
import ProfileLoginScreen from '../screens/profile/profileLoginScreen';
import ProfileVerifyScreen from '../screens/profile/profileVerifyScreen';
import PreviewConfirmScreen from '../screens/sellerPortal/previewConfirmScreen';
import { OrderData, Product, ProductCategory, ProductData, ProductDetail } from '../utils/types';
import FilterSortScreen from '../screens/buyerPortal/filterSortScreen';
import OrderTrackScreen from '../screens/buyerPortal/orderTrackScreen';
import BProductDetailScreen from '../screens/buyerPortal/bProductDetailScreen';
import ConfirmYourOrderScreen from '../screens/buyerPortal/confirmYourOrderScreen';
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/store';
import AddProductScreen from '../screens/sellerPortal/addProductScreen';

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigation: React.FC = () => {
  const container = useContainer();
  const userData = useSelector((user: IRootState) => user.user.userData);

  const renderFirstScreen =
  userData != null ? SCREENS.BottomTab : SCREENS.LoginScreen;
  //   let planOwnerData = useSelector(
  //     (type: IRootState) => type.user.planOwnerData,
  //   );
  //   let memberData = useSelector((type: IRootState) => type.user.memberData);
  //   let providerData = useSelector((type: IRootState) => type.user.providerData);

  //   const firstName =
  //     planOwnerData || memberData || providerData
  //       ? SCREENS.BottomTab
  //       : SCREENS.SelectUserType;

  return (
    // <View style={container}>
    <Stack.Navigator
    initialRouteName={renderFirstScreen}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name={SCREENS.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={SCREENS.VerifyOTP} component={VerifyOTP} />
      <Stack.Screen name={SCREENS.SignUpScreen} component={SignUpScreen} />
      <Stack.Screen name={SCREENS.BottomTab} component={BottomTabNav} />
      <Stack.Screen
        name={SCREENS.ProductListScreen}
        component={ProductListScreen}
      />
      <Stack.Screen
        name={SCREENS.ProductDetailScreen}
        component={ProductDetailScreen}
      />
      <Stack.Screen name={SCREENS.CashOutScreen} component={CashOutScreen} />
      <Stack.Screen name={SCREENS.AddFundScreen} component={AddFundScreen} />
      <Stack.Screen name={SCREENS.BrowseScreen} component={BrowseScreen} />
      <Stack.Screen name={SCREENS.MyOrderScreen} component={MyOrderScreen} />
      <Stack.Screen name={SCREENS.ProfileScreen} component={ProfileScreen} />
      <Stack.Screen name={SCREENS.HelpSupportScreen} component={HelpSupportScreen} />
      <Stack.Screen name={SCREENS.PrivacyPolicyScreen} component={PrivacyPolicyScreen} />
      <Stack.Screen name={SCREENS.TermsConditionsScreen} component={TermsConditionsScreen} />
      <Stack.Screen name={SCREENS.EditProfileScreen} component={EditProfileScreen} />
      <Stack.Screen name={SCREENS.ChangePasswordScreen} component={ChangePasswordScreen} />
      <Stack.Screen name={SCREENS.ProfileLoginScreen} component={ProfileLoginScreen} />
      <Stack.Screen name={SCREENS.ProfileVerifyScreen} component={ProfileVerifyScreen} />
      <Stack.Screen name={SCREENS.AddProductScreen} component={AddProductScreen} />
      <Stack.Screen
        name={SCREENS.PreviewConfirmScreen}
        component={PreviewConfirmScreen}
      />
      <Stack.Screen
        name={SCREENS.FilterSortScreen}
        component={FilterSortScreen}
      />
      <Stack.Screen
        name={SCREENS.OrderTrackScreen}
        component={OrderTrackScreen}
      />
      <Stack.Screen
        name={SCREENS.BProductDetailScreen}
        component={BProductDetailScreen}
      />
      <Stack.Screen
        name={SCREENS.ConfirmYourOrderScreen}
        component={ConfirmYourOrderScreen}
      />

    </Stack.Navigator>
    // </View>
  );
};

export default MainNavigation;

export enum SCREENS {
  LoginScreen = 'LoginScreen',
  VerifyOTP = 'VerifyOTP',
  SignUpScreen = 'SignUpScreen',
  BottomTab = 'BottomTabNav',
  SHomeScreen = 'SHomeScreen',
  BHomeScreen = 'BHomeScreen',
  AddProductScreen = 'AddProductScreen',
  ProductListScreen = 'ProductListScreen',
  SalesScreen = 'SalesScreen',
  WalletScreen = 'WalletScreen',
  ProductDetailScreen = 'ProductDetailScreen',
  CashOutScreen = 'CashOutScreen',
  AddFundScreen = 'AddFundScreen',
  MyOrderScreen = 'MyOrderScreen',
  BrowseScreen = 'BrowseScreen',
  ProfileScreen = 'ProfileScreen',
  HelpSupportScreen = 'HelpSupportScreen',
  PrivacyPolicyScreen = 'PrivacyPolicyScreen',
  TermsConditionsScreen = 'TermsConditionsScreen',
  EditProfileScreen = 'EditProfileScreen',
  ChangePasswordScreen = 'ChangePasswordScreen',
  ProfileLoginScreen = 'ProfileLoginScreen',
  ProfileVerifyScreen = 'ProfileVerifyScreen',
  PreviewConfirmScreen = 'PreviewConfirmScreen',
  FilterSortScreen = 'FilterSortScreen',
  OrderTrackScreen = 'OrderTrackScreen',
  BProductDetailScreen = 'BProductDetailScreen',
  ConfirmYourOrderScreen = 'ConfirmYourOrderScreen'
}

export type RootStackParamList = {
  [SCREENS.LoginScreen]: undefined;
  [SCREENS.VerifyOTP]: { otp: string, email?: string | null | undefined ,type?: string | null | undefined};
  [SCREENS.SignUpScreen]: undefined;
  [SCREENS.BottomTab]: undefined;
  [SCREENS.SHomeScreen]: undefined;
  [SCREENS.BHomeScreen]: undefined;
  [SCREENS.AddProductScreen]: undefined;
  [SCREENS.ProductListScreen]: undefined;
  [SCREENS.SalesScreen]: undefined;
  [SCREENS.WalletScreen]: undefined;
  [SCREENS.ProductDetailScreen]: {
    productId: number | string | undefined | null;
  };
  [SCREENS.CashOutScreen]: undefined;
  [SCREENS.AddFundScreen]: undefined;
  [SCREENS.BrowseScreen]: undefined;
  [SCREENS.MyOrderScreen]: undefined;
  [SCREENS.ProfileScreen]: undefined;
  [SCREENS.HelpSupportScreen]: undefined;
  [SCREENS.PrivacyPolicyScreen]: undefined;
  [SCREENS.TermsConditionsScreen]: { type?: string | null | undefined};
  [SCREENS.EditProfileScreen]: undefined;
  [SCREENS.ChangePasswordScreen]: undefined;
  [SCREENS.ProfileLoginScreen]: undefined;
  [SCREENS.ProfileVerifyScreen]:{ otp: string, email?: string | null | undefined ,type?: string | null | undefined};
  [SCREENS.PreviewConfirmScreen]: {
    productData?: ProductDetail;
  };
  [SCREENS.FilterSortScreen]: {
    onApplyFilters: (
      selectedCategories: ProductCategory[],
      selectedSort: { id: string; name: string } | null, 
      selectedPriceRange: { min: number; max: number } | null
    ) => void;
    initialFilters: ProductCategory[];
    initialSort: { id: string; name: string } | null;
    initialPriceRange: { min: number; max: number } | null;
  };
  [SCREENS.OrderTrackScreen]: {
    productId:  string | number | null | undefined
  };
  [SCREENS.BProductDetailScreen]: {
    productId:  string | number | null | undefined
  };
  [SCREENS.ConfirmYourOrderScreen]:{
    productId:  string | number | null | undefined
  };
};
