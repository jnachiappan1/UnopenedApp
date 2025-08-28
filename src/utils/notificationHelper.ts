/* eslint-disable no-var */
import {Alert, Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {OS} from './utils';
import notifee from '@notifee/react-native';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    Alert.alert(
      'Notification permission denied',
      'Enable notifications from settings to receive updates.',
    );
  }
  if (OS === 'ios') {
    await notifee.requestPermission();
  }
};
export const getFCMToken = async () => {
  try {
    await requestUserPermission();
    const token = await messaging().getToken();
    return token;
    //dispatch(saveFcmToken(token));
  } catch (e) {
    console.error('Error getting FCM token:', e);
  }
};

export const showMessages = (notification: any) => {
  if (Platform.OS === 'ios') {
    displayNotification(notification);
  } else {
    PushNotification.createChannel(
      {
        channelId: 'unopened-channel-id',
        channelName: 'unopened',
        channelDescription: 'unopened',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created: any) => {
        displayNotification(notification);
      },
    );
  }
};

const displayNotification = async (notification: any) => {
  var title = notification?.notification?.title;
  var message = notification?.notification?.body;
  PushNotification.localNotification({
    channelId: 'unopened-channel-id',
    importance: 'high',
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    userInfo: notification,
    vibrate: true,
  });
};
