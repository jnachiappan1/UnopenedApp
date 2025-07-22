/* eslint-disable @typescript-eslint/no-shadow */
// In App.js in a new project
import React, {useEffect} from 'react';
import {Alert, Linking, View} from 'react-native';
// import BottomTabNav from './bottomTabNav';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useContainer} from '../components/hooks/useContainer';
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
import PreviewConfirmScreen from '../screens/sellerPortal/previewConfirmScreen';
import { OrderData, Product, ProductData, ProductDetail } from '../utils/types';
import FilterSortScreen from '../screens/buyerPortal/filterSortScreen';
import OrderTrackScreen from '../screens/buyerPortal/orderTrackScreen';
import BProductDetailScreen from '../screens/buyerPortal/bProductDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigation: React.FC = () => {
  const container = useContainer();
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
    <View style={container}>
      <Stack.Navigator
        // initialRouteName={firstName}
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
        
      </Stack.Navigator>
    </View>
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
  PreviewConfirmScreen = 'PreviewConfirmScreen',
  FilterSortScreen ='FilterSortScreen',
  OrderTrackScreen = 'OrderTrackScreen',
  BProductDetailScreen = 'BProductDetailScreen'
}

export type RootStackParamList = {
  [SCREENS.LoginScreen]: undefined;
  [SCREENS.VerifyOTP]: undefined;
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
  [SCREENS.PreviewConfirmScreen]: {
    productData?: ProductDetail;
  };
  [SCREENS.FilterSortScreen]: {
    onApplyFilters: (filters: any) => void;
    initialFilters: string[]; 
  };
  [SCREENS.OrderTrackScreen]: {
    productId: OrderData;
  };
  [SCREENS.BProductDetailScreen]: {
    item:Product[]
  };
  
  
};
