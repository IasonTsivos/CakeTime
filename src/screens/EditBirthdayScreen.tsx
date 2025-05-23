import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Image as RNImage,
  Image,
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
import * as Notifications from 'expo-notifications';
import birthdaystyles from '../styles/birthdayStyles';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditBirthday'>;
type EditBirthdayRouteProp = RouteProp<RootStackParamList, 'EditBirthday'>;

export default function EditBirthdayScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { birthday } = useRoute<EditBirthdayRouteProp>().params;
  const { theme } = useTheme();

  const [name, setName] = useState(birthday.name);
  const [date, setDate] = useState(parseISO(birthday.date));
  const [avatar, setAvatar] = useState(birthday.avatar);
  const [wish, setWish] = useState(birthday.wish || '');
  const [giftIdeas, setGiftIdeas] = useState<string[]>(
    birthday.giftIdeas ? birthday.giftIdeas.split('|') : []
  );
  const [newGiftIdea, setNewGiftIdea] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
          <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme.primary]);

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
      giftIdeas: giftIdeas.join('|'),
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
            if (birthday.notificationIds) {
              if (birthday.notificationIds.birthday) {
                await Notifications.cancelScheduledNotificationAsync(birthday.notificationIds.birthday);
              }
              if (birthday.notificationIds.headsUp) {
                await Notifications.cancelScheduledNotificationAsync(birthday.notificationIds.headsUp);
              }
            }

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
    <View style={birthdaystyles.container}>
      <AnimatedLottieView
        source={theme.animation}
        autoPlay
        loop
        style={birthdaystyles.backgroundAnimation}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={birthdaystyles.scrollContainer} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={birthdaystyles.avatarCircle}
            onPress={() => setShowAvatarPicker(true)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: avatar }} style={birthdaystyles.avatarImage} resizeMode="contain" />
            <View style={[birthdaystyles.editAvatarBadge, { backgroundColor: theme.primary }]}>
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

          <View style={birthdaystyles.formContainer}>
            <Text style={birthdaystyles.label}>Name</Text>
            <TextInput
              style={birthdaystyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              autoCapitalize="words"
              placeholderTextColor="#999"
            />

            <Text style={birthdaystyles.label1}>Birthday</Text>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <View style={birthdaystyles.input}>
                <Text style={birthdaystyles.inputText}>{format(date, 'MMMM do, yyyy')}</Text>
                <MaterialIcons name="calendar-today" size={20} color={theme.primary} />
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

            <Text style={birthdaystyles.label1}>Wish</Text>
            <TextInput
              style={[birthdaystyles.input, { height: 100, textAlignVertical: 'top' }]}
              value={wish}
              onChangeText={setWish}
              multiline
              placeholder="Write a wish..."
              placeholderTextColor="#999"
            />

            <Text style={birthdaystyles.label1}>Gift Ideas</Text>

            <View style={birthdaystyles.giftIdeaInputRow}>
              <TextInput
                style={birthdaystyles.giftIdeaInput}
                placeholder="Add a gift idea"
                value={newGiftIdea}
                onChangeText={setNewGiftIdea}
                onSubmitEditing={() => {
                  if (newGiftIdea.trim()) {
                    setGiftIdeas([...giftIdeas, newGiftIdea.trim()]);
                    setNewGiftIdea('');
                  }
                }}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={[birthdaystyles.addGiftButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  if (newGiftIdea.trim()) {
                    setGiftIdeas([...giftIdeas, newGiftIdea.trim()]);
                    setNewGiftIdea('');
                  }
                }}
              >
                <MaterialIcons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={birthdaystyles.giftIdeaBubblesContainer}>
              {giftIdeas.map((idea, index) => (
                <View key={index} style={[birthdaystyles.giftIdeaBubble, { backgroundColor: theme.shadow }]}>
                  <Text style={birthdaystyles.giftIdeaText}>{idea}</Text>
                  <TouchableOpacity
                    style={birthdaystyles.giftIdeaRemoveButton}
                    onPress={() => {
                      setGiftIdeas(giftIdeas.filter((_, i) => i !== index));
                    }}
                  >
                    <MaterialIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={birthdaystyles.button} onPress={handleSave}>
              <LinearGradient
                colors={[theme.primary, theme.shadow]}
                style={birthdaystyles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={birthdaystyles.buttonText}>Save Changes</Text>
                <MaterialIcons name="save" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[birthdaystyles.button, { marginTop: 15 }]} onPress={handleDelete}>
              <LinearGradient
                colors={['#e74c3c' ,'#c0392b' ]}
                style={birthdaystyles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={birthdaystyles.buttonText}>Delete</Text>
                <MaterialIcons name="delete" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
