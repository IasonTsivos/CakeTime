// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermission, showTestNotification } from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';

type HomeStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Settings'>;

type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;
};

const THEME_KEYS = ['pink', 'green'] as const;
type ThemeKey = typeof THEME_KEYS[number];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, setThemeByKey } = useTheme();

  const [selectedKey, setSelectedKey] = useState<ThemeKey>('pink');

  // Notification toggles
  const [notifyOneDayBefore, setNotifyOneDayBefore] = useState(false);
  const [notifyOneWeekBefore, setNotifyOneWeekBefore] = useState(false);
  const [notifyOnBirthday, setNotifyOnBirthday] = useState(false);

  useEffect(() => {
    (async () => {
      const oneDay = (await AsyncStorage.getItem('notifyOneDayBefore')) === 'true';
      const oneWeek = (await AsyncStorage.getItem('notifyOneWeekBefore')) === 'true';
      const onBirthday = (await AsyncStorage.getItem('notifyOnBirthday')) === 'true';
      const storedThemeKey = (await AsyncStorage.getItem('themeKey')) as ThemeKey;

      setNotifyOneDayBefore(oneDay);
      setNotifyOneWeekBefore(oneWeek);
      setNotifyOnBirthday(onBirthday);
      if (storedThemeKey && THEME_KEYS.includes(storedThemeKey)) {
        setSelectedKey(storedThemeKey);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('notifyOneDayBefore', notifyOneDayBefore.toString());
  }, [notifyOneDayBefore]);

  useEffect(() => {
    AsyncStorage.setItem('notifyOneWeekBefore', notifyOneWeekBefore.toString());
  }, [notifyOneWeekBefore]);

  useEffect(() => {
    AsyncStorage.setItem('notifyOnBirthday', notifyOnBirthday.toString());
  }, [notifyOnBirthday]);

  const handleThemeChange = (key: ThemeKey) => {
    setSelectedKey(key);
    setThemeByKey(key);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customization</Text>
        <Text style={styles.subTitle}>Select Theme Color</Text>

        <View style={styles.colorOptions}>
          {THEME_KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.colorCircle,
                {
                  backgroundColor: key === 'pink' ? '#ff8eec' : '#51ff63',
                },
                selectedKey === key && styles.selectedColorCircle,
              ]}
              onPress={() => handleThemeChange(key)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={showTestNotification}
      >
        <Text style={styles.buttonText}>Send Test Notification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  colorOptions: {
    flexDirection: 'row',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorCircle: {
    borderColor: '#000',
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SettingsScreen;
