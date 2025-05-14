import React, { useState } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';


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
    text: 'Let’s celebrate and remember Birthdays together.',
    image: require('../assets/int1.png'),
    colors: ['#f9980c', '#ffffff'],
  },
  {
    key: 'slide2',
    title: 'Keep track of Birthdays',
    text: 'Get reminders for all your important days.',
    image: require('../assets/int2.png'),
    colors: ['#5ACADB', '#F9F6F6'],
  },
  {
    key: 'slide3',
    title: 'Make loved ones Smile',
    text: 'Never forget to send your best wishes.',
    image: require('../assets/int3.png'),
    colors: ['#ffe4e9', '#fdfdff'],
  },
  {
    key: 'slide4',
    title: 'What’s your name?',
    text: '',
    image: null,
    inputSlide: true,
    colors: ['#ffe4e9', '#ffffff'],
  },
];


  const handleContinue = async () => {
    if (!userName.trim()) return;
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    await AsyncStorage.setItem('userName', userName.trim());
    navigation.replace('HomeTabs');
  };

const renderItem = ({ item }: any) => {
  const isLastSlide = item.inputSlide;

  return (
    <LinearGradient colors={item.colors || ['#fff', '#fff']} style={styles.slide}>
      <View style={[styles.contentWrapper, isLastSlide && styles.centeredContent]}>
        {item.image && (
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>
        )}
        <Text style={styles.title}>{item.title}</Text>
        {item.text !== '' && <Text style={styles.text}>{item.text}</Text>}

        {isLastSlide && (
          <>
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
          </>
        )}
      </View>
    </LinearGradient>
  );
};



  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      showNextButton={slideIndex < slides.length - 1}
      onSlideChange={(index) => setSlideIndex(index)}
      activeDotStyle={styles.activeDot}  // Add this to style the active dot
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1, // Takes the full screen height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  imageContainer: {
    height: '60%', 
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%', 
    height: '70%', 
  },
  contentContainer: {
    flex: 1, // Takes up the remaining 40% of the height of the screen
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b81',
    textAlign: 'center',
    fontFamily: 'Avenir Next',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#ff6b81',
    borderRadius: 10,
    padding: 12,
    width: '80%',
    fontSize: 18,
    fontFamily: 'Avenir Next',
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: '#ff6b81',
    shadowColor: '#ff6b81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Avenir Next',
  },
  activeDot: {
    backgroundColor: '#ff6b81',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  contentWrapper: {
  flex: 1,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: 60,
},

centeredContent: {
  justifyContent: 'center',
  paddingTop: 0,
},

});


export default IntroSlider;
