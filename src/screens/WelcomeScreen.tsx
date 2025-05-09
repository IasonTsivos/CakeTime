// src/screens/WelcomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const handleNameSubmit = () => {
    if (name.trim()) {
      // Navigate to HomeTabs, which contains the HomeStackNavigator
      navigation.replace('HomeTabs'); // This should work because HomeTabs is in the stack navigator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Lets Start! Please enter your name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Submit" onPress={handleNameSubmit} disabled={!name.trim()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default WelcomeScreen;
