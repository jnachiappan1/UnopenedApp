/* eslint-disable no-var */
import {getApp} from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'App needs notification permission to receive notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }
  // For iOS
  if (Platform.OS === 'ios') {
    try {
      // const app = getApp();
      const messagingInstance = getMessaging();

      const authStatus = await requestPermission(messagingInstance);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('iOS Authorization status:', authStatus);
        return true;
      }
    } catch (e) {
      console.log('Error requesting iOS permission:', e);
    }
    return false;
  }
};

export const getFCMToken = async () => {
  try {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      return null;
    }

    const app = getApp();
    const messagingInstance = getMessaging(app);
    const token = await getToken(messagingInstance);

    console.log('token==>', token);
    return token;
  } catch (e) {
    console.log('Error getting FCM token:', e);
    return null;
  }
};

export const showMessages = (
  notification: any,
  playSound: boolean,
  vibrate: boolean,
) => {
  const isFromSystem = Platform.OS === 'ios' && notification?.notification;

  if (isFromSystem) {
    // Don't show local notification; system already displayed it
    return;
  }

  // Otherwise, manually show
  PushNotification.createChannel(
    {
      channelId: 'ReqLight',
      channelName: 'ReqLight',
      channelDescription: 'ReqLight',
      playSound,
      soundName: 'default',
      importance: Importance.HIGH,
      vibrate,
    },
    () => {
      displayNotification(notification, playSound, vibrate);
    },
  );
};
// export const showMessages = (
//   notification: any,
//   playSound: boolean,
//   vibrate: boolean,
// ) => {
//   if (Platform.OS === 'ios') {
//     displayNotification(notification, playSound, vibrate);
//   } else {
//     PushNotification.createChannel(
//       {
//         channelId: 'ReqLight',
//         channelName: 'ReqLight',
//         channelDescription: 'ReqLight',
//         playSound: playSound,
//         soundName: 'default',
//         importance: Importance.HIGH,
//         vibrate: vibrate,
//       },
//       (created: any) => {
//         displayNotification(notification, playSound, vibrate);
//       },
//     );
//   }
// };

const displayNotification = async (
  notification: any,
  playSound: boolean,
  vibrate: boolean,
) => {
  console.log(notification,"notification-----");
  
  var title = notification?.notification?.title;
  var message = notification?.notification?.body;
  PushNotification.localNotification({
    channelId: 'ReqLight',
    importance: 'high',
    title: title,
    message: message,
    playSound,
    soundName: 'default',
    userInfo: notification,
    vibrate,
    // largeIcon:
  });
};
