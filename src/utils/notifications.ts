// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { addDays, subDays, setHours, setMinutes, isBefore } from 'date-fns';

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

// Schedule both birthday and heads-up notifications
export async function scheduleBirthdayNotifications(name: string, date: Date) {
  const now = new Date();

  // Birthday Day Notification (9:00 AM)
  const birthdayTime = setHours(setMinutes(new Date(date), 0), 9);
  const nextBirthday = isBefore(birthdayTime, now)
    ? addDays(birthdayTime, 365)
    : birthdayTime;

  const birthdayId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎂 ${name}'s Birthday`,
      body: `Today is ${name}'s birthday! 🎉`,
      sound: 'default',
    },
    trigger: nextBirthday,
  });

  // Heads-up Notification (1 day before at 6 PM)
  const headsUpTime = setHours(setMinutes(subDays(date, 1), 37), 17);
  const nextHeadsUp = isBefore(headsUpTime, now)
    ? addDays(headsUpTime, 364)
    : headsUpTime;

  const headsUpId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎉 ${name}'s Birthday is Tomorrow`,
      body: `Get ready! ${name}'s birthday is tomorrow. Prepare a gift! 🎁`,
      sound: 'default',
    },
    trigger: nextHeadsUp,
  });

  return {
    birthday: birthdayId,
    headsUp: headsUpId,
  };
}

// Cancel notifications by ID
export async function cancelNotifications(notificationIds: {
  birthday?: string;
  headsUp?: string;
}) {
  if (notificationIds.birthday) {
    await Notifications.cancelScheduledNotificationAsync(notificationIds.birthday);
  }
  if (notificationIds.headsUp) {
    await Notifications.cancelScheduledNotificationAsync(notificationIds.headsUp);
  }
}
