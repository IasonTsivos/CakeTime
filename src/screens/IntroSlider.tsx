import React, { useState } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Intro: undefined;
  Welcome: undefined;
  HomeTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const IntroSlider = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userName, setUserName] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      key: 'slide1',
      title: 'Welcome to CakeTime!',
      text: 'Never miss a birthday again.',
      image: require('../assets/intro1.png'),
    },
    {
      key: 'slide2',
      title: 'Organize birthdays easily',
      text: 'All your friends in one place.',
      image: require('../assets/intro1.png'),
    },
    {
      key: 'slide3',
      title: 'Celebrate together!',
      text: 'Send love on their special day.',
      image: require('../assets/intro1.png'),
    },
    {
      key: 'slide4',
      title: 'What’s your name?',
      text: '',
      image: null,
      inputSlide: true,
    },
  ];

  const handleContinue = async () => {
    if (!userName.trim()) return;
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    await AsyncStorage.setItem('userName', userName.trim());
    navigation.replace('HomeTabs');
  };

  const renderItem = ({ item }: any) => {
    if (item.inputSlide) {
      return (
        <View style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <TextInput
            placeholder="Enter your name"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: userName ? '#ff6b81' : '#ccc' }]}
            onPress={handleContinue}
            disabled={!userName}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={() => {}} // Not used since last slide is custom
      showSkipButton
      onSkip={async () => {
        await AsyncStorage.setItem('hasSeenIntro', 'true');
        navigation.replace('Welcome');
      }}
      showNextButton={slideIndex < slides.length - 1}
      showDoneButton={false}
      onSlideChange={(index) => setSlideIndex(index)}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  input: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default IntroSlider;
