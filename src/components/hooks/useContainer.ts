import {Platform, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../../utils/colors';

export function useContainer() {
  const insets = useSafeAreaInsets();
  // const bottom = insets.bottom;
  const top = Platform.OS === 'ios' ? insets.top : insets.top + 10;
  return {
    flex: 1,
    backgroundColor: colors.background,
    // paddingBottom: bottom,
    paddingTop: top,
  };
}
export function useNormalContainer() {
  const insets = useSafeAreaInsets();
  return {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: insets.top,
  };
}