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

  // Ensure birthday is for this year or next
  const thisYearBirthday = setHours(setMinutes(new Date(date), 0), 9);
  thisYearBirthday.setFullYear(now.getFullYear());

  const nextBirthday = isBefore(thisYearBirthday, now)
    ? addYears(thisYearBirthday, 1)
    : thisYearBirthday;

  const birthdayId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎂 ${name}'s Birthday`,
      body: `Today is ${name}'s birthday! 🎉`,
      sound: 'default',
    },
    trigger: {
      type: 'date',
      date: nextBirthday,
    },
  });

  // Heads-up: 1 day before at 6 PM
  const headsUpDate = subDays(nextBirthday, 1);
  const headsUpTime = setHours(setMinutes(headsUpDate, 8), 12);

  const headsUpId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎉 ${name}'s Birthday is Tomorrow`,
      body: `Get ready! ${name}'s birthday is tomorrow. Prepare a gift! 🎁`,
      sound: 'default',
    },
    trigger: {
      type: 'date',
      date: headsUpTime,
    },
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
