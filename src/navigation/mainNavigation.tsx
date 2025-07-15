/* eslint-disable @typescript-eslint/no-shadow */
// In App.js in a new project
import React, { useEffect } from 'react';
import { Alert, Linking, View } from 'react-native';
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
        }}
      >
        <Stack.Screen name={SCREENS.LoginScreen} component={LoginScreen} />
        <Stack.Screen name={SCREENS.VerifyOTP} component={VerifyOTP} />
        <Stack.Screen name={SCREENS.SignUpScreen} component={SignUpScreen} />
        <Stack.Screen name={SCREENS.BottomTab} component={BottomTabNav} />
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
};
