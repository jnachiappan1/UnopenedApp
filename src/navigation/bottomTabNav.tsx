/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import colors, { IColors, getColors } from '../utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { IRootState } from '../redux/store';
import sHomeScreen from '../screens/sellerPortal/sHomeScreen';
import bHomeScreen from '../screens/buyerPortal/bHomeScreen';
import ProductListScreen from '../screens/sellerPortal/productListScreen';
import IconsSvg, { IconName } from '../assets/svg/iconsSvg';
import IMAGE from '../assets/images';
import { RootStackParamList, SCREENS } from './mainNavigation';
import { fontSizes, OS } from '../utils/utils';
import fonts from '../assets/fonts/fonts';
import SalesScreen from '../screens/sellerPortal/salesScreen';
import WalletScreen from '../screens/sellerPortal/walletScreen';
import BrowseScreen from '../screens/buyerPortal/browseScreen';
import MyOrderScreen from '../screens/buyerPortal/myOrderScreen';
import AddProductScreen from '../screens/sellerPortal/addProductScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();
type BottomTabNavProps = NativeStackScreenProps<
  RootStackParamList,
  SCREENS.BottomTab
>;

const BottomTabNav: React.FC<BottomTabNavProps> = () => {
  const userType = useSelector((state: IRootState) => state.user.userType);
console.log(userType,"userType-----");

  const sellerPortalTab = (
    <>
      <Tab.Screen name={SCREENS.SHomeScreen} component={sHomeScreen} />
      <Tab.Screen name={SCREENS.ProductListScreen} component={ProductListScreen} />
      {/* <Tab.Screen name={SCREENS.AddProductScreen} component={AddProductScreen} /> */}
      <Tab.Screen name={SCREENS.SalesScreen} component={SalesScreen} />
      <Tab.Screen name={SCREENS.WalletScreen} component={WalletScreen} />
    </>
  );

  const buyerPortalTab = (
    <>
      <Tab.Screen name={SCREENS.BHomeScreen} component={bHomeScreen} />
      <Tab.Screen name={SCREENS.BrowseScreen} component={BrowseScreen} />
      <Tab.Screen name={SCREENS.MyOrderScreen} component={MyOrderScreen} />
      <Tab.Screen name={SCREENS.WalletScreen} component={WalletScreen} />
    </>
  );

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) =>
        userType === 'seller' ? <SellerTabBar {...props} /> : <BuyerTabBar {...props} />
      }
    >
      {userType === 'seller' ? sellerPortalTab : buyerPortalTab}
    </Tab.Navigator>
  );
};

export default BottomTabNav;

const SellerTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const c = getColors();
  const styles = getCurvedStyles(c);
  const userData = useSelector((state: IRootState) => state.user.userData);

  const iconMap: Record<string, { icon: string; label: string }> = {
    [SCREENS.SHomeScreen]: { icon: 'homeIcon', label: 'Home' },
    [SCREENS.ProductListScreen]: { icon: 'productListIcon', label: 'Product List' },
    [SCREENS.SalesScreen]: { icon: 'salesIcon', label: 'Sales' },
    [SCREENS.WalletScreen]: { icon: 'walletIcon', label: 'Wallet' },
    

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={IMAGE.bottomTabImage}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />
      <View style={styles.fabContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (userData) {
              navigation.navigate(SCREENS.AddProductScreen);
            } else {
              navigation.navigate(SCREENS.LoginScreen); 
            }
          }}
          style={styles.fab}
        >
          <View style={styles.fabInner}>
            <IconsSvg name="addProductIcon" color={c.white} />
          </View>
        </TouchableOpacity>
        <Text style={styles.fabLabel}>Add Product</Text>
      </View>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { icon, label } = iconMap[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Add center space after ProductListScreen (index 1)
          if (index === 1) {
            return (
              <React.Fragment key={route.key}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  onPress={onPress}
                  style={styles.tab}
                >
                  <View style={styles.tabContent}>
                    <IconsSvg
                      name={icon as IconName}
                      color={isFocused ? c.primary : c.gray}
                    />
                    <Text style={isFocused ? styles.activeLabel : styles.label}>
                      {label}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.centerSpace} />
              </React.Fragment>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tab}
            >
              <View style={styles.tabContent}>
                <IconsSvg
                  name={icon as IconName}
                  color={isFocused ? c.primary : c.gray}
                />
                <Text style={isFocused ? styles.activeLabel : styles.label}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_HEIGHT = 80;
const NOTCH_RADIUS = 0;
const CENTER_BTN = 60;
const BuyerTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const c = getColors();
  const styles = getFlatStyles(getColors());
  const iconMap: Record<string, { icon: string; label: string }> = {
    [SCREENS.BHomeScreen]: { icon: 'homeIcon', label: 'Home' },
    [SCREENS.BrowseScreen]: { icon: 'searchIcon', label: 'Browse' },
    [SCREENS.MyOrderScreen]: { icon: 'myOrderIcon', label: 'My Order' },
    [SCREENS.WalletScreen]: { icon: 'walletIcon', label: 'Wallet' },
  };
  return (
    // <View style={styles.container}>
    //   {state.routes.map((route, index) => {
    //     const { options } = descriptors[route.key];
    //     const isFocused = state.index === index;
    //     const { icon, label } = iconMap[route.name];

    //     const onPress = () => {
    //       const event = navigation.emit({
    //         type: 'tabPress',
    //         target: route.key,
    //         canPreventDefault: true,
    //       });
    //       if (!isFocused && !event.defaultPrevented) {
    //         navigation.navigate(route.name);
    //       }
    //     };

    //     return (
    //       <TouchableOpacity
    //         key={route.key}
    //         accessibilityRole="button"
    //         accessibilityState={isFocused ? { selected: true } : {}}
    //         onPress={onPress}
    //         style={styles.tab}
    //       >
    //         <View style={styles.tabContent}>
    //           <IconsSvg
    //             name={icon as IconName}
    //             color={isFocused ? c.primary : c.gray}
    //           />
    //           <Text style={isFocused ? styles.activeLabel : styles.label}>
    //             {label}
    //           </Text>
    //         </View>
    //       </TouchableOpacity>
    //     );
    //   })}
    // </View>
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={IMAGE.buyerBottomImage}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          if (route.name === SCREENS.AddProductScreen) {
            return <View key={route.key} style={styles.centerSpace} />;
          }
          const isFocused = state.index === index;
          const { icon, label } = iconMap[route.name];
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tab}
            >
              <View style={styles.tabContent}>
                <IconsSvg
                  name={icon as IconName}
                  color={isFocused ? c.primary : c.gray}
                />
                <Text style={isFocused ? styles.activeLabel : styles.label}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const getFlatStyles = (colors: IColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.white,
      alignItems: 'center',
      paddingVertical: 10,
    },
    icon: {
      alignItems: 'center',
      height: 46,
      width: 46,
      justifyContent: 'center',
      borderRadius: 23,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: OS === "android" ? 10 : -10,
    },

    tabContent: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'column',
      marginBottom: 6,
    },

    centerSpace: {
      flex: 1,
      alignItems: 'center',
    },
    label: {
      fontSize: fontSizes.small,
      fontFamily: fonts.medium,
      marginTop: 4,
      textAlign: 'center',
      color: colors.text
    },
    activeLabel: {
      fontSize: fontSizes.small,
      fontFamily: fonts.bold,
      marginTop: 4,
      textAlign: 'center',
      color: colors.primary
    },
    safeArea: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: BAR_HEIGHT + 35,
      alignItems: 'center',
    },
    backgroundImage: {
      position: 'absolute',
      bottom: 0,
      width: SCREEN_WIDTH,
      height: BAR_HEIGHT + 20,
      zIndex: 0,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      width: '100%',
      height: '100%',
      zIndex: 1,
// backgroundColor:'red',
      paddingBottom: OS === 'android' ? 0 : 20,
    },
  });

const getCurvedStyles = (c: IColors) =>
  StyleSheet.create({
    safeArea: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: BAR_HEIGHT + 35,
      alignItems: 'center',
    },
    backgroundImage: {
      position: 'absolute',
      bottom: 0,
      width: SCREEN_WIDTH,
      height: BAR_HEIGHT + 35,
      zIndex: 0,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      width: '100%',
      height: '100%',
      zIndex: 1,
      paddingBottom: OS === 'android' ? 0 : 20,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: OS === "android" ? 10 : -10,
    },
    tabContent: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'column',
      marginBottom: 6,
    },
    centerSpace: {
      flex: 1,
      alignItems: 'center',
      minWidth: 30,
    },
    label: {
      fontSize: fontSizes.small,
      fontFamily: fonts.medium,
      marginTop: 4,
      textAlign: 'center',
      color: c.text
    },
    activeLabel: {
      fontSize: fontSizes.small,
      fontFamily: fonts.bold,
      marginTop: 4,
      textAlign: 'center',
      color: c.primary
    },
    fabContainer: {
      position: 'absolute',
      top: -NOTCH_RADIUS,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
    },
    fab: {
      borderRadius: (CENTER_BTN + 12) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 10,
    },
    fabInner: {
      width: CENTER_BTN,
      height: CENTER_BTN,
      borderRadius: CENTER_BTN / 2,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fabLabel: {
      fontSize: fontSizes.small,
      color: c.label,
      textAlign: 'center',
      lineHeight: 14,
      marginTop: OS === "android" ? 25 : 15,
      fontFamily: fonts.medium,
    },
  });