import AsyncStorage from '@react-native-async-storage/async-storage';
import { Birthday } from '../types/Birthday';

const STORAGE_KEY = 'BIRTHDAYS';

export const saveBirthday = async (birthday: Birthday) => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const list: Birthday[] = json ? JSON.parse(json) : [];
    list.push(birthday);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving birthday', err);
  }
};

export const getBirthdays = async (): Promise<Birthday[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error('Error loading birthdays', err);
    return [];
  }
};
