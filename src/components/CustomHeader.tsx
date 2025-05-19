import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeContext'; 

interface Props {
  title: string;
  showBackButton?: boolean;
}

const CustomHeader = ({ title, showBackButton = true }: Props) => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // 👈 get current theme
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[theme.primary, '#f8f2f1']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.inner}>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#303030" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#303030',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
