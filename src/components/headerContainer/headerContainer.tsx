import {
  I18nManager,
  StatusBar,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import IconsSvg from '../../assets/svg/iconsSvg';
import {useNavigation} from '@react-navigation/native';
import { useContainer } from '../hooks/useContainer';
import colors from '../../utils/colors';

type HeaderContainerProps = {
  children?: React.ReactNode | undefined;
  title?: string;
  isBack?: boolean;
  containerStyle: StyleProp<ViewStyle> | undefined;
};

const HeaderContainer: React.FC<HeaderContainerProps> = props => {
  const {children, containerStyle, isBack} = props;
  const container = useContainer();
  const navigation = useNavigation<string | any>();

  const onBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={[container, containerStyle]}>
      {isBack && (
        <TouchableOpacity style={styles.back} onPress={onBackPress}>
          <IconsSvg
            name="leftArrow"
            style={styles.backIconStyle}
            width={40}
            height={40}
            color={colors.secondary}
          />
        </TouchableOpacity>
      )}
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={'dark-content'}
      />
      {children}
    </View>
  );
};

export default HeaderContainer;

const styles = StyleSheet.create({
  rightIconView: {},
  back: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: 40,
  },
  backIconStyle: {
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
});
