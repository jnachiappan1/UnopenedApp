/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Modal, View, StyleSheet, Platform, Linking, Text, Image } from 'react-native';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts/fonts';
import IMAGE from '../../assets/images';
import Button from '../../components/button/buttons';

interface ForceUpdateModalProps {
  visible: boolean;
}

const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({ visible }) => {
  const handleUpdate = () => {
    const storeUrl =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id848YS6ZHJH'
        : 'https://play.google.com/store/apps/details?id=com.unopened_mobile';

    Linking.openURL(storeUrl).catch(err => {
      console.error('Failed to open store:', err);
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      hardwareAccelerated
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[StyleSheet.absoluteFill, styles.androidOverlay]} />

        <View style={styles.container}>
          <View style={[styles.topBorder, { backgroundColor: colors.primary }]} />

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Image
                  source={IMAGE.boxImage}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={styles.title}>Update Required</Text>

            <Text style={styles.message}>
              A new version of the app is available. Please update to continue
              using the app.
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText} allowFontScaling={false}>
                  New Features and Improvements
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText} allowFontScaling={false}>
                  Bug Fixes and Security Updates
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText} allowFontScaling={false}>
                  Better Performance
                </Text>
              </View>
            </View>

            <Button
              title={'Update Now'}
              onPress={handleUpdate}
              style={{ width: '100%', marginTop: 10 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForceUpdateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  androidOverlay: {
    backgroundColor: colors.modalBackGround,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  topBorder: {
    height: 3,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    fontWeight: '800',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  message: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
