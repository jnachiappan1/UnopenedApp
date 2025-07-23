import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts/fonts';
import IconsSvg from '../../assets/svg/iconsSvg';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../utils/common-styles';
import colors from '../../utils/colors';
import { fontSizes, OS, width } from '../../utils/utils';
import { useNormalContainer } from '../hooks/useContainer';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconBackHeaderContainerProps = {
  children?: React.ReactNode;
  title?: string;
  isBack?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  headerRowContainerStyle?: StyleProp<ViewStyle>;
};

const IconBackHeaderContainer: React.FC<IconBackHeaderContainerProps> = ({
  children,
  title = 'Unopened',
  isBack = false,
  containerStyle,
  headerRowContainerStyle,
}) => {
  const navigation = useNavigation();
  const container = useNormalContainer();

  const onBackPress = () => {
    navigation.goBack();
  };

  const HEADER_MIN_HEIGHT = 30;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={[styles.headerRowContainer, headerRowContainerStyle]}>
        {isBack && (
          <TouchableOpacity
            style={styles.back}
            onPress={onBackPress}>
            <IconsSvg name="backArrow" />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <IconsSvg name="packageIcon" />
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <View style={[styles.childrenView, containerStyle]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={HEADER_MIN_HEIGHT}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default IconBackHeaderContainer;

const styles = StyleSheet.create({
  headerRowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
  },
  childrenView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  back: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginRight: 50,
  },
  title: {
    fontSize: fontSizes.large,
    fontFamily: fonts.bold,
    color: colors.white,
    paddingStart: 10,
  },
});
