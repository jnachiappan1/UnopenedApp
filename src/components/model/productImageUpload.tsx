import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Modal from 'react-native-modal';
import fonts from '../../assets/fonts/fonts';
import { fontSizes } from '../../utils/utils';
import colors from '../../utils/colors';
import ImagePicker, {
  Image as ImageType,
  Options,
} from 'react-native-image-crop-picker';
import { Platform, PermissionsAndroid } from 'react-native';

type MediaObject = {
  uri: string;
  name: string;
  type: string;
};

type IInputProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  onImageSelected: (images: MediaObject[]) => void;
  selectedImages?: MediaObject[];
};

const maxImageSize = 5 * 1024 * 1024; // 5MB for images
const maxVideoSize = 50 * 1024 * 1024; // 50MB for videos
const minImages = 2;

const ProductImageUpload = ({
  isVisible,
  setIsVisible,
  onImageSelected,
  selectedImages = []
}: IInputProps) => {

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const granted = await PermissionsAndroid.requestMultiple([
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.READ_EXTERNAL_STORAGE',
      ]);
      return (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' ||
        granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
      );
    }
    return true;
  };

  const checkCameraPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      return true;
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        'android.permission.CAMERA',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ]);
      return (
        (granted['android.permission.CAMERA'] === 'granted' &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') ||
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again'
      );
    }
    return false;
  };

  // Helper function to generate file name based on media type
  const generateFileName = (mediaItem: ImageType, index: number): string => {
    const isVideo = mediaItem.mime && mediaItem.mime.includes('video');
    const extension = mediaItem.path.substr(mediaItem.path.lastIndexOf('.') + 1);
    const prefix = isVideo ? 'product_video' : 'product_image';
    const timestamp = Date.now();
    return `${prefix}_${timestamp}_${index}.${extension}`;
  };

  // Convert ImagePicker result to our MediaObject format
  const convertToMediaObject = (mediaItem: ImageType, index: number): MediaObject => {
    return {
      uri: mediaItem.path,
      name: generateFileName(mediaItem, index),
      type: mediaItem.mime,
    };
  };

  const handleImageSelection = async (media: ImageType[]) => {
    try {
      // Filter media that are within size limit
      const validMedia = media.filter(item => {
        const isVideo = item.mime && item.mime.includes('video');
        const maxSize = isVideo ? maxVideoSize : maxImageSize;
        const mediaType = isVideo ? 'video' : 'image';

        if (item.size && item.size > maxSize) {
          Alert.alert('Warning', `${mediaType} exceeds ${isVideo ? '50MB' : '5MB'} size limit and will be skipped.`);
          return false;
        }
        return true;
      });

      if (validMedia.length === 0) {
        Alert.alert('Error', 'No valid media selected. Please ensure images are under 5MB and videos are under 50MB.');
        return;
      }

      // Convert to MediaObject format
      const newMediaObjects = validMedia.map((item, index) => convertToMediaObject(item, index));

      // Combine with existing media
      const allMedia = [...selectedImages, ...newMediaObjects];

      // Remove duplicates based on URI
      const uniqueMedia = allMedia.filter((item, index, self) =>
        index === self.findIndex(t => t.uri === item.uri)
      );

      onImageSelected(uniqueMedia);
      setIsVisible(false);
    } catch (error) {
      console.error('Error handling media selection:', error);
      Alert.alert('Error', 'Failed to process selected media.');
    }
  };

  const openGallery = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        Alert.alert('Permission Required', 'Please grant gallery permissions to select media.');
        return;
      }

      const option: Options = {
        width: 400,
        height: 400,
        cropping: false, // Allow multiple selection without cropping
        mediaType: 'any', // Allow both photos and videos
        multiple: true, // Enable multiple selection
        maxFiles: 10, // Maximum files that can be selected
      };

      const media = await ImagePicker.openPicker(option);

      // Handle both single media and multiple media
      const mediaArray = Array.isArray(media) ? media : [media];
      await handleImageSelection(mediaArray);

    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Gallery error:', error);
        Alert.alert('Error', 'Failed to open gallery. Please try again.');
      }
    }
  };

  const openCamera = async () => {
    try {
      const hasPermissions = await checkCameraPermissions();
      if (!hasPermissions) {
        Alert.alert('Permission Required', 'Please grant camera permissions to take photos/videos.');
        return;
      }

      // Show options for photo or video
      Alert.alert(
        'Select Media Type',
        'Choose what you want to capture:',
        [
          {
            text: '📸 Photo',
            onPress: () => openCameraForPhoto()
          },
          {
            text: '🎥 Video',
            onPress: () => openCameraForVideo()
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );

    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to open camera. Please try again.');
      }
    }
  };

  const openCameraForPhoto = async () => {
    try {
      const option: Options = {
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      };

      const media = await ImagePicker.openCamera(option);
      await handleImageSelection([media]);

    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Photo camera error:', error);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    }
  };

  const openCameraForVideo = async () => {
    try {
      const option: Options = {
        mediaType: 'video',
      };

      const media = await ImagePicker.openCamera(option);
      await handleImageSelection([media]);

    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Video camera error:', error);
        Alert.alert('Error', 'Failed to record video. Please try again.');
      }
    }
  };

  const clearAllMedia = () => {
    Alert.alert(
      'Clear Media',
      'Are you sure you want to clear all selected images/videos?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            onImageSelected([]);
            setIsVisible(false);
          }
        }
      ]
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      onBackButtonPress={() => setIsVisible(false)}
      backdropOpacity={0.5}
      onSwipeComplete={() => setIsVisible(false)}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      style={styles.modalStyle}>

      <View style={styles.btnContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Media</Text>
          <Text style={styles.headerSubtitle}>
            1 video + at least 1 image required ({selectedImages.length} selected)
          </Text>
        </View>

        {/* Gallery Option */}
        {/* <TouchableOpacity style={styles.btn} onPress={openGallery}>
          <Text style={styles.title}>📷 Gallery (Multiple Selection)</Text>
        </TouchableOpacity> */}

        {/* Camera Option */}
        <TouchableOpacity style={styles.btn} onPress={openCamera}>
          <Text style={styles.title}>📸 Camera (Photo/Video)</Text>
        </TouchableOpacity>

        {/* Clear Media Option - Only show if media is selected */}
        {selectedImages.length > 0 && (
          <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={clearAllMedia}>
            <Text style={[styles.title, styles.clearText]}>🗑️ Clear All Media</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.btnClose}
        onPress={() => setIsVisible(false)}>
        <Text style={styles.close}>Cancel</Text>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProductImageUpload;

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: fontSizes.large || 18,
    fontFamily: fonts.bold,
    color: colors.primaryBlack,
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: fontSizes.small || 12,
    fontFamily: fonts.regular,
    color: colors.gray,
    textAlign: 'center',
  },
  title: {
    fontSize: fontSizes.regular,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
  btn: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderBottomColor: colors.border,
    justifyContent: 'center',
  },
  clearBtn: {
    borderBottomWidth: 0,
  },
  clearText: {
    color: '#FF3B30',
  },
  btnClose: {
    backgroundColor: colors.white,
    marginBottom: 26,
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  close: {
    color: colors.primary,
    fontSize: fontSizes.regular,
    fontFamily: fonts.medium,
  },
  btnContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 8,
  },
});