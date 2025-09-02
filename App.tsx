import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Loader from './src/components/loader/loader';
import CAlert from './src/components/cAlert';
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';
import { IRootState, store } from './src/redux/store';
import MainNavigation from './src/navigation/mainNavigation';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { LogBox } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { getPublishKeyAction } from './src/utils/apiAction';
import messaging from '@react-native-firebase/messaging';
import { showMessages } from './src/utils/notificationHelper';
import { OS } from './src/utils/utils';
import { saveFcmToken } from './src/redux/reducers/user/UserReducer';

const queryClient = new QueryClient();

// Inner app where Redux is already available
function AppContent() {
  const [publishKey, setPublishKey] = React.useState('');
  const token = useSelector((state: IRootState) => state.user.token);
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch();

  const { data, error }: any = useQuery({
    queryKey: ['getPublishKeyAction'],
    queryFn: getPublishKeyAction,
    enabled: !!token,
  });
// const checkToken = async () => {
//   const fcmToken = await messaging().getToken();
//   if (fcmToken) {
//     dispatch(saveFcmToken(fcmToken));
//   }
//   if (OS === "ios") {
//     messaging().onTokenRefresh((fcmToken) => {});

//   }
// };
const checkToken = async () => {
  const fcmToken = await messaging().getToken();

  if (fcmToken) {
  }
  if (OS === 'ios') {
    messaging().onTokenRefresh(() => {});
  }
};
React.useEffect(() => {
  checkToken();
}, []);

  React.useEffect(() => {
    if (token) {
      setPublishKey(data?.data?.publishKey || '');
    }
  }, [data, error, token]);
  // React.useEffect(() => {
  //   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     showMessages(remoteMessage,true,true);
  //   });
  //   const unsubscribeOnMessage = messaging().onMessage(
  //     async (remoteMessage) => {
  //       showMessages(remoteMessage,true,true);
  //     }
  //   );
  //   return () => unsubscribeOnMessage();
  // }, []);
  React.useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      showMessages(remoteMessage);
    });
    return () => unsubscribeOnMessage();
  }, []);
  const NavigationContent = (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );

  return publishKey ? (
    <StripeProvider publishableKey={publishKey}>
      {NavigationContent}
    </StripeProvider>
  ) : (
    NavigationContent
  );
}

// Outer app for providers that don't need Redux access
export default function App() {
  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  LogBox.ignoreLogs([
    'Support for defaultProps will be removed from function components',
  ]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.commonFlex} edges={['bottom']}>
        <StoreProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <AppContent />
            <Loader />
            <CAlert />
          </QueryClientProvider>
        </StoreProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  commonFlex: {
    flex: 1,
  },
});
