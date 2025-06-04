// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { addYears, addDays, subDays, setHours, setMinutes, isBefore } from 'date-fns';


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
  let birthdayThisYear = setHours(setMinutes(new Date(date), 0), 9);
  birthdayThisYear.setFullYear(now.getFullYear());

  const nextBirthday = isBefore(birthdayThisYear, now)
    ? addYears(birthdayThisYear, 1)
    : birthdayThisYear;

  const headsUpTime = setHours(setMinutes(subDays(nextBirthday, 1), 24), 15); // 6 PM

  const birthdayId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎂 ${name}'s Birthday`,
      body: `Today is ${name}'s birthday! 🎉`,
      sound: 'default',
    },
    trigger: nextBirthday,
  });

  const headsUpId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎉 ${name}'s Birthday is Tomorrow`,
      body: `Get ready! ${name}'s birthday is tomorrow. 🎁`,
      sound: 'default',
    },
    trigger: headsUpTime,
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
