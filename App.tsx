// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeTabs from './src/navigation/HomeStackNavigator';
import IntroSlider from './src/screens/IntroSlider';
import { ActivityIndicator, View } from 'react-native';
import * as Notifications from 'expo-notifications';

// ✅ GLOBAL: Set up how notifications behave when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // ✅ required in newer versions
    shouldShowList: true
  }),
});

type RootStackParamList = {
  Intro: undefined;
  HomeTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [initialRoute, setInitialRoute] = useState<'Intro' | 'HomeTabs' | null>(null);

  useEffect(() => {
    const checkStorage = async () => {
      const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro');
      setInitialRoute(hasSeenIntro === 'true' ? 'HomeTabs' : 'Intro');
    };

    checkStorage();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff6b81" />
      </View>
    );
  }

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
