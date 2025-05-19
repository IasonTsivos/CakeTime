import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Image as RNImage,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { Birthday } from '../types/Birthday';
import { saveBirthday } from '../utils/storage';
import AvatarPicker from '../components/AvatarPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import AnimatedLottieView from 'lottie-react-native';
import birthdaystyles from '../styles/birthdayStyles';
import { scheduleBirthdayNotifications } from '../utils/notifications';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

export default function AddBirthdayScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [avatar, setAvatar] = useState<string>(
    RNImage.resolveAssetSource(require('../assets/boyhat.png')).uri
  );
  const [wish, setWish] = useState('');
  const [giftIdeaInput, setGiftIdeaInput] = useState('');
  const [giftIdeaList, setGiftIdeaList] = useState<string[]>([]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleAddBirthday = async () => {
    if (!name) {
      Alert.alert('Oops!', 'Please enter a name for this birthday.');
      return;
    }

    try {
      const notificationIds = await scheduleBirthdayNotifications(name, birthday);

      if (!notificationIds.birthday || !notificationIds.headsUp) {
        Alert.alert('Error', 'Failed to schedule notifications properly.');
        return;
      }

      const newBirthday: Birthday = {
        id: uuid.v4().toString(),
        name,
        date: birthday.toISOString(),
        avatar,
        wish,
        giftIdeas: giftIdeaList.join('|'),
        notificationIds,
      };

      await saveBirthday(newBirthday);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'There was a problem saving the birthday.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setDatePickerVisible(false);
      return;
    }
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedLottieView
        source={theme.animation}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => setShowAvatarPicker(true)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: avatar }} style={styles.avatarImage} resizeMode="contain" />
            <View style={[styles.editAvatarBadge, { backgroundColor: theme.primary }]}>
              <MaterialIcons name="edit" size={16} color="white" />
            </View>
          </TouchableOpacity>

          <AvatarPicker
            visible={showAvatarPicker}
            onClose={() => setShowAvatarPicker(false)}
            onSelect={(selectedAvatar: any) => {
              const uri = RNImage.resolveAssetSource(selectedAvatar).uri;
              setAvatar(uri);
            }}
          />

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Who's birthday is it?"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birthday</Text>
              <TouchableOpacity
                onPress={() => {
                  setTempDate(birthday);
                  setDatePickerVisible(true);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.input}>
                  <Text style={styles.inputText}>{format(birthday, 'MMMM do, yyyy')}</Text>
                  <MaterialIcons name="calendar-today" size={20} color={theme.primary} />
                </View>
              </TouchableOpacity>
            </View>

            {isDatePickerVisible && (
              <>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setBirthday(tempDate);
                      setDatePickerVisible(false);
                    }}
                    style={{ padding: 10, backgroundColor: theme.primary, borderRadius: 8 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setDatePickerVisible(false)}
                    style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8 }}
                  >
                    <Text style={{ color: 'black' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birthday Wish (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Write a pre-made birthday message..."
                placeholderTextColor="#999"
                value={wish}
                onChangeText={setWish}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gift Ideas (Optional)</Text>
              <View style={styles.giftIdeaInputRow}>
                <TextInput
                  style={styles.giftIdeaInput}
                  placeholder="Add a gift idea"
                  placeholderTextColor="#999"
                  value={giftIdeaInput}
                  onChangeText={setGiftIdeaInput}
                  onSubmitEditing={() => {
                    if (giftIdeaInput.trim()) {
                      setGiftIdeaList([...giftIdeaList, giftIdeaInput.trim()]);
                      setGiftIdeaInput('');
                    }
                  }}
                  returnKeyType="done"
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={[styles.addGiftButton, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    if (giftIdeaInput.trim()) {
                      setGiftIdeaList([...giftIdeaList, giftIdeaInput.trim()]);
                      setGiftIdeaInput('');
                    }
                  }}
                >
                  <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.giftIdeaBubblesContainer}>
                {giftIdeaList.map((idea, index) => (
                  <View key={index} style={[styles.giftIdeaBubble, { backgroundColor: theme.shadow }]}>
                    <Text style={styles.giftIdeaText}>{idea}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setGiftIdeaList(giftIdeaList.filter((_, i) => i !== index));
                      }}
                      style={styles.giftIdeaRemoveButton}
                    >
                      <MaterialIcons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddBirthday} activeOpacity={0.8}>
              <LinearGradient
                colors={[theme.shadow, theme.primary]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Save Birthday</Text>
                <MaterialIcons name="celebration" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  ...birthdaystyles,
});
