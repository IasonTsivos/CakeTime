
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EditBirthdayScreen from '../screens/EditBirthdayScreen';

export type HomeStackParamList = {
  Home: undefined;
  EditBirthday: { birthday: any }; // replace `any` with your Birthday type
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{ headerTitle: 'Home' }}
  />
  <Stack.Screen
    name="EditBirthday"
    component={EditBirthdayScreen}
    options={{ headerTitle: 'Edit' }} // 👈 Hides the header here
  />
</Stack.Navigator>

  );
};

export default HomeStackNavigator;
