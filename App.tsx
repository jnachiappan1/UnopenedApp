/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { NavigationContainer } from '@react-navigation/native';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Loader from './src/components/loader/loader';
import CAlert from './src/components/cAlert';
import {Provider as StoreProvider} from 'react-redux';
import { store } from './src/redux/store';
import MainNavigation from './src/navigation/mainNavigation';


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <StoreProvider store={store}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
      <Loader />
      <CAlert />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
