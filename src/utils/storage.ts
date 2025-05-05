// storage.ts

import { Birthday } from '../types/Birthday';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'birthdays';

export const getBirthdays = async (): Promise<Birthday[]> => {
  try {
    const birthdaysJson = await AsyncStorage.getItem(STORAGE_KEY);
    return birthdaysJson ? JSON.parse(birthdaysJson) : [];
  } catch (error) {
    console.error('Error getting birthdays:', error);
    return [];
  }
};

export const saveBirthday = async (birthday: Birthday): Promise<void> => {
  try {
    const birthdays = await getBirthdays();
    birthdays.push(birthday);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
  } catch (error) {
    console.error('Error saving birthday:', error);
  }
};

export const updateBirthday = async (updatedBirthday: Birthday): Promise<void> => {
  try {
    const birthdays = await getBirthdays();
    const index = birthdays.findIndex(b => b.id === updatedBirthday.id);
    if (index !== -1) {
      birthdays[index] = updatedBirthday;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
    }
  } catch (error) {
    console.error('Error updating birthday:', error);
  }
};

export const deleteBirthday = async (id: string): Promise<void> => {
  try {
    let birthdays = await getBirthdays();
    birthdays = birthdays.filter(b => b.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
  } catch (error) {
    console.error('Error deleting birthday:', error);
  }
};
