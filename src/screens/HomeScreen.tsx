import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  ImageBackground,
} from 'react-native';
import { getBirthdays } from '../utils/storage';
import { Birthday } from '../types/Birthday';
import { parseISO, format, isBefore, addYears, differenceInDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorValue } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import homescreenstyles from '../utils/homeScreenStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width,height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

type RootStackParamList = {
  Home: undefined;
  BirthdayDetails: { birthday: Birthday };
  AddBirthday: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  useFocusEffect(
    React.useCallback(() => {
      const loadBirthdays = async () => {
        try {
          const saved = await getBirthdays();
          const today = new Date();
          const sorted = saved.sort((a, b) => {
            const aDate = parseISO(a.date);
            const bDate = parseISO(b.date);
            const aNext = new Date(aDate.setFullYear(today.getFullYear()));
            const bNext = new Date(bDate.setFullYear(today.getFullYear()));
            if (isBefore(aNext, today)) aNext.setFullYear(today.getFullYear() + 1);
            if (isBefore(bNext, today)) bNext.setFullYear(today.getFullYear() + 1);
            return aNext.getTime() - bNext.getTime();
          });
          setBirthdays(sorted);
        } catch (error) {
          console.error('Error loading birthdays:', error);
        } finally {
          setLoading(false);
        }
      };

      loadBirthdays();
    }, [])
  );

  const getDaysUntilBirthday = (dateString: string) => {
    const today = new Date();
    const birthDate = parseISO(dateString);
    let nextBirthday = new Date(birthDate.setFullYear(today.getFullYear()));
    if (isBefore(nextBirthday, today)) nextBirthday = addYears(nextBirthday, 1);
    const days = differenceInDays(nextBirthday, today);
    return days === 0 ? "Today!" : days === 1 ? "Tomorrow!" : `${days} days`;
  };

  const getBackgroundColor = (daysText: string): [ColorValue, ColorValue] => {
    if (daysText === "Today!") return ['#FF9A9E', '#FAD0C4'];
    if (daysText === "Tomorrow!") return ['#A1C4FD', '#C2E9FB'];
    return ['#D4FC79', '#96E6A1'];
  };

  const renderItem = ({ item, index }: { item: Birthday; index: number }) => {
    const daysText = getDaysUntilBirthday(item.date);
    const colors = getBackgroundColor(daysText);
    const isToday = daysText === "Today!";

    const scale = scrollY.interpolate({
      inputRange: [-1, 0, index * (CARD_WIDTH * 0.6), (index + 2) * (CARD_WIDTH * 0.6)],
      outputRange: [1, 1, 1, 0.9],
    });

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.birthdayCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('BirthdayDetails', { birthday: item })}
        >
          <LinearGradient
            colors={colors}
            style={StyleSheet.flatten([
              styles.gradientBackground,
              !isToday && { paddingVertical: 12, paddingHorizontal: 16 },
            ])}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={StyleSheet.flatten([styles.avatarContainer, !isToday && { width: 50, height: 50, borderRadius: 25 }])}>
                <Text style={[styles.avatar, !isToday && { fontSize: 24 }]}>{item.avatar}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.date}>{format(parseISO(item.date), 'MMMM do')}</Text>
              </View>
              <View style={styles.daysContainer}>
                <Text style={styles.daysText}>{daysText}</Text>
                {isToday && (
                  <LottieView
                    source={require('../assets/animations/confetti.json')}
                    autoPlay
                    loop
                    style={[styles.confetti, { width: 250, height: 250, top: -50, left: -50 }]}
                  />
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/bg-animation.json')}
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={styles.heading}>Birthday Reminders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBirthday')}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {birthdays.length === 0 ? (
        <View style={styles.emptyState}>
          <LottieView autoPlay loop style={styles.emptyAnimation} />
          <Text style={styles.emptyText}>No birthdays yet!</Text>
          <Text style={styles.emptySubtext}>Tap the + button to add one</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={birthdays}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = {
    ...homescreenstyles,
  
  };
  
export default HomeScreen;
