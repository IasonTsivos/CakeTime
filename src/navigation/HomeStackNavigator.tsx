
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EditBirthdayScreen from '../screens/EditBirthdayScreen';
import AddBirthdayScreen from '../screens/AddBirthdayScreen';

export type HomeStackParamList = {
  Home: undefined;
  EditBirthday: { birthday: any }; 
  AddBirthday: undefined; 
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
  <Stack.Screen
    name="AddBirthday"
    component={AddBirthdayScreen}
    options={{ headerTitle: 'Add Birthday' }} // 👈 Hides the header here
  />
</Stack.Navigator>

  );
};

export default HomeStackNavigator;
