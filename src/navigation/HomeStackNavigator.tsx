import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EditBirthdayScreen from '../screens/EditBirthdayScreen';
import AddBirthdayScreen from '../screens/AddBirthdayScreen';
import CustomHeader from '../components/CustomHeader';

export type HomeStackParamList = {
  Home: undefined;
  EditBirthday: { birthday: any };
  AddBirthday: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
<Stack.Navigator
  screenOptions={{
    header: () => <CustomHeader title="🎉 Birthdays" showBackButton={false} />,
  }}
>
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{ header: () => <CustomHeader title=" " showBackButton={false} /> }}
  />
  <Stack.Screen
    name="EditBirthday"
    component={EditBirthdayScreen}
    options={{ header: () => <CustomHeader title="🎂 Edit Birthday" /> }}
  />
  <Stack.Screen
    name="AddBirthday"
    component={AddBirthdayScreen}
    options={{ header: () => <CustomHeader title="🎂 Add Birthday" /> }}
  />
</Stack.Navigator>
  );
};

export default HomeStackNavigator;
