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


type HomeStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const THEME_COLORS = [
  '#ff3399', // pink
  '#4a90e2', // blue
  '#50e3c2', // teal
  '#f5a623', // orange
  '#7b8d93', // gray
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Notification toggles state
  const [notifyOneDayBefore, setNotifyOneDayBefore] = useState(false);
  const [notifyOneWeekBefore, setNotifyOneWeekBefore] = useState(false);
  const [notifyOnBirthday, setNotifyOnBirthday] = useState(false);

  // Selected theme color
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0]);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const oneDay = (await AsyncStorage.getItem('notifyOneDayBefore')) === 'true';
      const oneWeek = (await AsyncStorage.getItem('notifyOneWeekBefore')) === 'true';
      const onBirthday = (await AsyncStorage.getItem('notifyOnBirthday')) === 'true';
      const theme = (await AsyncStorage.getItem('themeColor')) || THEME_COLORS[0];

      setNotifyOneDayBefore(oneDay);
      setNotifyOneWeekBefore(oneWeek);
      setNotifyOnBirthday(onBirthday);
      setSelectedColor(theme);
    })();
  }, []);

  // Save settings to AsyncStorage when toggles or theme changes
  useEffect(() => {
    AsyncStorage.setItem('notifyOneDayBefore', notifyOneDayBefore.toString());
  }, [notifyOneDayBefore]);

  useEffect(() => {
    AsyncStorage.setItem('notifyOneWeekBefore', notifyOneWeekBefore.toString());
  }, [notifyOneWeekBefore]);

  useEffect(() => {
    AsyncStorage.setItem('notifyOnBirthday', notifyOnBirthday.toString());
  }, [notifyOnBirthday]);

  useEffect(() => {
    AsyncStorage.setItem('themeColor', selectedColor);
    // Here you could also trigger a theme update event or context update
  }, [selectedColor]);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
    >

      {/* Customization Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customization</Text>
        <Text style={styles.subTitle}>Select Theme Color</Text>

        <View style={styles.colorOptions}>
          {THEME_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColorCircle,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: selectedColor }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={[styles.button, { backgroundColor: selectedColor }]}
          onPress={showTestNotification}
          activeOpacity={0.8}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleLabel: {
    fontSize: 18,
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
