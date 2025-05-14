import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Image as RNImage,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { Birthday } from '../types/Birthday';
import AvatarPicker from '../components/AvatarPicker';
import { deleteBirthday, updateBirthday } from '../utils/storage';
import AnimatedLottieView from 'lottie-react-native';
import { RootStackParamList } from '../types/navigation';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditBirthday'>;
type EditBirthdayRouteProp = RouteProp<RootStackParamList, 'EditBirthday'>;

export default function EditBirthdayScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { birthday } = useRoute<EditBirthdayRouteProp>().params;

  const [name, setName] = useState(birthday.name);
  const [date, setDate] = useState(parseISO(birthday.date));
  const [avatar, setAvatar] = useState(birthday.avatar);
  const [wish, setWish] = useState(birthday.wish || '');
  const [giftIdeas, setGiftIdeas] = useState(birthday.giftIdeas || '');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
          <MaterialIcons name="arrow-back" size={24} color="#ff6b81" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Please enter a name');
      return;
    }

    const updatedBirthday: Birthday = {
      ...birthday,
      name,
      avatar,
      date: date.toISOString(),
      wish,
      giftIdeas,
    };

    try {
      await updateBirthday(updatedBirthday);
      navigation.navigate('Home', { refresh: true });
    } catch (e) {
      Alert.alert('Error', 'Failed to update birthday');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Birthday', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBirthday(birthday.id);
            navigation.navigate('Home', { refresh: true });
          } catch (e) {
            Alert.alert('Error', 'Could not delete birthday');
          }
        },
      },
    ]);
  };

  return (
  <View style={styles.container}>
    <AnimatedLottieView
      source={require('../assets/animations/bg-animation.json')}
      autoPlay
      loop
      style={styles.backgroundAnimation}
    />

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // adjust if needed
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => setShowAvatarPicker(true)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: avatar }} style={styles.avatarImage} resizeMode="contain" />
          <View style={styles.editAvatarBadge}>
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
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Birthday</Text>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <View style={styles.input}>
              <Text style={styles.inputText}>{format(date, 'MMMM do, yyyy')}</Text>
              <MaterialIcons name="calendar-today" size={20} color="#ff6b81" />
            </View>
          </TouchableOpacity>
          {isDatePickerVisible && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={(_, d) => {
                setDatePickerVisible(false);
                if (d) setDate(d);
              }}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}

          <Text style={styles.label}>Wish</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={wish}
            onChangeText={setWish}
            multiline
          />

          <Text style={styles.label}>Gift Ideas</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={giftIdeas}
            onChangeText={setGiftIdeas}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <LinearGradient colors={['#ff8a9b', '#ff6b81']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Save Changes</Text>
              <MaterialIcons name="save" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { marginTop: 15 }]} onPress={handleDelete}>
            <LinearGradient colors={['#ff6b81', '#ff4e50']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Delete</Text>
              <MaterialIcons name="delete" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 40 },
  backgroundAnimation: {
    position: 'absolute',
    width,
    height: Dimensions.get('window').height,
    zIndex: -1,
    opacity: 0.4,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 40,
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
  formContainer: { paddingHorizontal: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#555' },
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
    marginBottom: 20,
  },
  inputText: { fontSize: 16, color: '#333' },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff6b81',
    shadowOffset: { width: 0, height: 4 },
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
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', marginRight: 10 },
});
