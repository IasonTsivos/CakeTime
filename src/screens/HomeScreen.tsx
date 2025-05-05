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

const { width } = Dimensions.get('window');
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
              !isToday && { paddingVertical: 12, paddingHorizontal: 16 }
            ])}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={StyleSheet.flatten([
                styles.avatarContainer,
                !isToday && { width: 50, height: 50, borderRadius: 25 }
              ])}>
                <Text style={[styles.avatar, !isToday && { fontSize: 24 }]}>{item.avatar}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.date}>
                  {format(parseISO(item.date), 'MMMM do')}
                </Text>
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
    <ImageBackground
      source={require('../assets/animations/confetti.json')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 12,
  },
  backgroundImage: {
    opacity: 0.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif-condensed',
  },
  addButton: {
    backgroundColor: '#ff6b81',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  list: {
    paddingBottom: 30,
  },
  birthdayCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  gradientBackground: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    fontSize: 36,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  daysContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  daysText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
  },
  confetti: {
    position: 'absolute',
    top: -30,
    left: -30,
    zIndex: -1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
  },
  emptyAnimation: {
    width: 250,
    height: 250,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },
});

export default HomeScreen;
