import React, { useState } from 'react';
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
import { useLayoutEffect } from 'react';
import HomeScreen from './HomeScreen';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';


const { width } = Dimensions.get('window');

export default function AddBirthdayScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [avatar, setAvatar] = useState('🎂');
  const [wish, setWish] = useState('');
  const [giftIdeas, setGiftIdeas] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
          <MaterialIcons name="arrow-back" size={24} color="#ff6b81" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, HomeScreen]);

  const handleAddBirthday = async () => {
    if (!name) {
      Alert.alert('Oops!', 'Please enter a name for this birthday.');
      return;
    }

    const newBirthday: Birthday = {
      id: uuid.v4().toString(),
      name,
      date: birthday.toISOString(),
      avatar,
      wish,
      giftIdeas,
    };

    try {
      await saveBirthday(newBirthday);
      Alert.alert(
        'Success!',
        `${name}'s birthday was saved successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'There was a problem saving the birthday.');
    }
  };

  const handleConfirmDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || birthday;
    setBirthday(currentDate);
    setDatePickerVisible(false);
  };

  return (
    
    <View style={styles.container}>
    {/* 🔵 Lottie Background Animation */}
    <AnimatedLottieView
      source={require('../assets/animations/bg-animation.json')} // Adjust path if needed
      autoPlay
      loop
      style={styles.backgroundAnimation}
    />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Picker */}
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => setShowAvatarPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarTextBig}>{avatar}</Text>
          <View style={styles.editAvatarBadge}>
            <MaterialIcons name="edit" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <AvatarPicker
          visible={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
          onSelect={setAvatar}
        />

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name Field */}
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

          {/* Birthday Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birthday</Text>
            <TouchableOpacity 
              onPress={() => setDatePickerVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.input}>
                <Text style={styles.inputText}>
                  {format(birthday, 'MMMM do, yyyy')}
                </Text>
                <MaterialIcons name="calendar-today" size={20} color="#ff6b81" />
              </View>
            </TouchableOpacity>
          </View>

          {isDatePickerVisible && (
            <DateTimePicker
              value={birthday}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleConfirmDate}
              textColor="#ff6b81"
              accentColor="#ff6b81"
            />
          )}

          {/* Wish Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birthday Wish (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Write a pre-made birthday message..."
              placeholderTextColor="#999"
              value={wish}
              onChangeText={setWish}
              multiline
            />
          </View>

          {/* Gift Ideas Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gift Ideas (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Book, Perfume, Concert tickets..."
              placeholderTextColor="#999"
              value={giftIdeas}
              onChangeText={setGiftIdeas}
              multiline
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleAddBirthday}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ff8a9b', '#ff6b81']}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  avatarCircle: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 3,
    borderColor: '#ff6b81',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarTextBig: {
    fontSize: 60,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff6b81',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
    color: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  backgroundAnimation: {
    position: 'absolute',
    width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.4,
  },
  button: {
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff6b81',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  
});
