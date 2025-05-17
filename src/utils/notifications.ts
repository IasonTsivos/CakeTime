// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  }
  return true;
}

export async function showTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Test Notification',
      body: 'This is a sample birthday reminder!',
      sound: 'default',
    },
    trigger: null, // send immediately
  });
}

