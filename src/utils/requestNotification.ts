// src/utils/notificationPermissions.ts
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications to receive birthday alerts.',
      );
      return false;
    }
    return true;
  }
  return false;
};
