import {
  ImageBackground,
  StatusBar,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { useContainer } from '../hooks/useContainer';
import IMAGE from '../../assets/images';
import IconsSvg from '../../assets/svg/iconsSvg';
type ImageBackgroundHeader = {
  children?: React.ReactNode | undefined;
  title?: string;
  containerStyle: StyleProp<ViewStyle> | undefined;
  hideBack?: boolean;
  onBackPress?: () => void;
};

const ImageBackgroundHeader: React.FC<ImageBackgroundHeader> = props => {
  const {children, containerStyle, hideBack = false, onBackPress} = props;
  const container = useContainer();
  return (
    <ImageBackground
      source={IMAGE.imageBackground}
      resizeMode="contain"
      style={[container, containerStyle]}>
        <TouchableOpacity
        onPress={onBackPress}
        style={styles.backBtn}
        disabled={hideBack}>
        {!hideBack && <IconsSvg name="leftArrow" style={styles.backIcon} />}
      </TouchableOpacity>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={'dark-content'}
      />
      {children}
    </ImageBackground>
  );
};

export default ImageBackgroundHeader;

const styles = StyleSheet.create({
  rightIconView: {},
  backIcon: {width: 24, height: 24, right:20},
  backBtn: {
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
