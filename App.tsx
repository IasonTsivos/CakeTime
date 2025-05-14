// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeTabs from './src/navigation/HomeStackNavigator';
import IntroSlider from './src/screens/IntroSlider';

type RootStackParamList = {
  Intro: undefined;
  HomeTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [initialRoute, setInitialRoute] = useState<'Intro' | 'HomeTabs'>('Intro');

  useEffect(() => {
    const checkStorage = async () => {
      const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro');
      const userName = await AsyncStorage.getItem('userName');

      if (!hasSeenIntro) {
        setInitialRoute('Intro');
      } else {
        setInitialRoute('HomeTabs');
      }
    };

    checkStorage();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Intro" component={IntroSlider} options={{ headerShown: false }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
