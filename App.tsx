import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Loader from './src/components/loader/loader';
import CAlert from './src/components/cAlert';
import { Provider as StoreProvider, useSelector } from 'react-redux';
import { IRootState, store } from './src/redux/store';
import MainNavigation from './src/navigation/mainNavigation';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { LogBox } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { getPublishKeyAction } from './src/utils/apiAction';

const queryClient = new QueryClient();

// Inner app where Redux is already available
function AppContent() {
  const [publishKey, setPublishKey] = React.useState('');
  const token = useSelector((state: IRootState) => state.user.token);
  const isDarkMode = useColorScheme() === 'dark';

  const { data, error }: any = useQuery({
    queryKey: ['getPublishKeyAction'],
    queryFn: getPublishKeyAction,
    enabled: !!token,
  });
console.log(data,"data-----");

  React.useEffect(() => {
    if (token) {
      setPublishKey(data?.data?.publishKey || '');
    }
  }, [data, error, token]);

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
