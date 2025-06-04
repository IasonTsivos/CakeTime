// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  TextInput,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { showTestNotification } from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';

const THEME_KEYS = ['pink', 'green', 'blue'] as const;
type ThemeKey = typeof THEME_KEYS[number];

type HomeStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Settings'>;

type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, setThemeByKey } = useTheme();

  const [selectedKey, setSelectedKey] = useState<ThemeKey>('pink');
  const [feedbackEmoji, setFeedbackEmoji] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    (async () => {
      const storedThemeKey = (await AsyncStorage.getItem('themeKey')) as ThemeKey;
      if (storedThemeKey && THEME_KEYS.includes(storedThemeKey)) {
        setSelectedKey(storedThemeKey);
      }
    })();
  }, []);

  const handleThemeChange = (key: ThemeKey) => {
    setSelectedKey(key);
    setThemeByKey(key);
  };

  const openRateApp = () => {
    Linking.openURL('market://details?id=your.app.id');
  };

  const openSupport = () => {
    Linking.openURL('https://www.buymeacoffee.com/yourusername');
  };

  const submitFeedback = () => {
    const subject = encodeURIComponent('App Feedback');
    const body = encodeURIComponent(`Satisfaction: ${feedbackEmoji || 'N/A'}\n\n${feedbackText}`);
    Linking.openURL(`mailto:ias-i@hotmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Customization Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image source={require('../assets/animations/brush.png')} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Customization</Text>
        </View>
        <Text style={styles.sectionDescription}>Thank you for personalizing your experience!</Text>
        <View style={styles.colorOptions}>
          {THEME_KEYS.map((key) => {
            const backgroundColor =
              key === 'pink' ? '#ff8eec' :
              key === 'green' ? '#51ff63' :
              '#51daff';

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.colorSquare,
                  { backgroundColor, shadowColor: backgroundColor },
                  selectedKey === key && styles.selectedColorSquare,
                ]}
                onPress={() => handleThemeChange(key)}
              >
                {selectedKey === key && (
                  <Feather name="check" size={28} color="#000" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.button, { shadowColor: theme.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { shadowColor: theme.primary }]} />

      {/* Feedback Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image source={require('../assets/animations/document-text.png')} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Feedback</Text>
        </View>
        <Text style={styles.sectionDescription}>We appreciate your thoughts on the app!</Text>
        <View style={styles.emojiRow}>
          {['😠', '😕', '😐', '😊', '😍'].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => setFeedbackEmoji(emoji)}
              style={[
                styles.emojiButton,
                feedbackEmoji === emoji && styles.emojiSelected,
              ]}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Tell us more..."
          multiline
          value={feedbackText}
          onChangeText={setFeedbackText}
        />
        <TouchableOpacity
          style={[styles.button, { shadowColor: theme.primary }]}
          onPress={submitFeedback}
        >
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { shadowColor: theme.primary }]} />

      {/* Rate the App Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image source={require('../assets/animations/star.png')} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Rate the App</Text>
        </View>
        <Text style={styles.sectionDescription}>If you enjoy the app, a rating goes a long way ❤️</Text>
        <TouchableOpacity
          style={[styles.button, { shadowColor: theme.primary }]}
          onPress={openRateApp}
        >
          <Text style={styles.buttonText}>Rate the App</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { shadowColor: theme.primary }]} />

      {/* Support Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image source={require('../assets/animations/heart.png')} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Support</Text>
        </View>
        <Text style={styles.sectionDescription}>Thanks for supporting the development 💖</Text>
        <TouchableOpacity
          style={[styles.button, { shadowColor: theme.primary }]}
          onPress={openSupport}
        >
          <Text style={styles.buttonText}>Support Me</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { shadowColor: theme.primary }]} />

      {/* Test Notification */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, { shadowColor: theme.primary }]}
          onPress={showTestNotification}
        >
          <Text style={styles.buttonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#f8f2f1',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  colorSquare: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  selectedColorSquare: {
    borderWidth: 3,
    borderColor: '#000',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  emojiButton: {
    padding: 10,
    borderRadius: 8,
  },
  emojiSelected: {
    backgroundColor: '#e0e0e0',
  },
  emojiText: {
    fontSize: 24,
  },
  feedbackInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SettingsScreen;
