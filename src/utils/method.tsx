/* eslint-disable no-async-promise-executor */
import {Alert, PermissionsAndroid, Platform} from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
import ImagePicker, {
  Image as ImageType,
  Options,
} from 'react-native-image-crop-picker';
import {showAlert} from '../components/cAlert';
import colors from './colors';
import { showLoader } from '../components/loader/loader';
import { errorMsg } from './types';
const maxSize = 5 * 1024 * 1024;
export const LATITUDE_DELTA = 0.01;

export const getProfileImage = (isCamera = false, cropping = true) => {
  return new Promise<ImageType | false>(async resolve => {
    const option: Options = {
      width: 400,
      height: 400,
      cropping: cropping,
      mediaType: 'photo',
    };

    const handleImageSelection = async (imagePromise: Promise<ImageType>) => {
      try {
        const image = await imagePromise;
        if (image && image.size <= maxSize) {
          resolve(image);
        } else if (image) {
          Alert.alert('Info', 'The selected image exceeds the 5MB size limit.');
          resolve(false);
        } else {
          resolve(false);
        }
      } catch {
        resolve(false);
      }
    };

    if (isCamera) {
      const hasPermissions = await checkCameraPermissions();
      if (hasPermissions) {
        await handleImageSelection(ImagePicker.openCamera(option));
      } else {
        resolve(false);
      }
    } else {
      const hasPermissions = await requestPermissions();
      if (hasPermissions) {
        await handleImageSelection(ImagePicker.openPicker(option));
      } else {
        resolve(false);
      }
    }
  });
};
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

const checkCameraPermissions = async () => {
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

export const formatCamelCaseToTitle = (str: string): string => {
  return (
    str
      ?.replace(/([a-z])([A-Z])/g, '$1 $2')
      ?.replace(/\b\w/g, char => char.toUpperCase())
  );
};

export const capitalizeFirstLetter = (text: string) => {
  return text
    ?.split(' ')
    ?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))
    ?.join(' ');
};
export const capitalizeFirstLetterSentence = (text: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
};
export const handleError = (error: errorMsg) => {
  showLoader(false);
  showAlert({
    isVisible: true,
    type: 'error',
    title: error.status.toUpperCase(),
    description: capitalizeFirstLetterSentence(error.message),
    doneText: 'Okay',
  });
};
export const handleSettled = () => {
  showLoader(false);
};