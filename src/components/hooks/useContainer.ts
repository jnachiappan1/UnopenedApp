import {Platform, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useContainer() {
  const insets = useSafeAreaInsets();
  // const bottom = insets.bottom;
  const top = Platform.OS === 'ios' ? insets.top : insets.top + 10;
  return {
    flex: 1,
    backgroundColor: "white",
    // paddingBottom: bottom,
    paddingTop: top,
  };
}
