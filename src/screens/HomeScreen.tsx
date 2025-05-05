import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  ColorValue,
} from 'react-native';
import { ScrollView } from 'react-native';
import { getBirthdays } from '../utils/storage';
import { Birthday } from '../types/Birthday';
import {
  parseISO,
  format,
  isBefore,
  addYears,
  differenceInDays,
  startOfDay,
  isThisWeek,
  isThisMonth,
} from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import homescreenstyles from '../utils/homeScreenStyles';
import AddBirthday from '../screens/AddBirthdayScreen';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  AddBirthday: undefined;
  EditBirthday: { birthday: Birthday };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

type ListItem = { type: 'header'; title: string } | { type: 'item'; birthday: Birthday };

const CARD_WIDTH = width - 40;

const getNextAge = (dateString: string) => {
    const birthDate = parseISO(dateString);
    const today = new Date();
  
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();
  
    let age = today.getFullYear() - birthDate.getFullYear();
  
    // If birthday hasn't occurred yet this year, subtract 1
    if (
      today.getMonth() < birthMonth ||
      (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
      age--;
    }
  
    return age + 1; // because we want the upcoming age
  };
  
  
const getBackgroundColor = (daysText: string): [ColorValue, ColorValue] => {
  if (daysText === 'Today!') return ['#FF9A9E', '#FAD0C4'];
  if (daysText === 'Tomorrow!') return ['#A1C4FD', '#C2E9FB'];
  return ['#D4FC79', '#96E6A1'];
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  useFocusEffect(
    React.useCallback(() => {
      const loadBirthdays = async () => {
        try {
          const saved: Birthday[] = await getBirthdays();
          const today = startOfDay(new Date());
          const sorted = saved.sort((a, b) => {
            const aDate = startOfDay(parseISO(a.date));
            const bDate = startOfDay(parseISO(b.date));
            let aNext = startOfDay(new Date(aDate.setFullYear(today.getFullYear())));
            let bNext = startOfDay(new Date(bDate.setFullYear(today.getFullYear())));

            if (isBefore(aNext, today)) aNext = addYears(aNext, 1);
            if (isBefore(bNext, today)) bNext = addYears(bNext, 1);

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
    const today = startOfDay(new Date());
    const birthDate = parseISO(dateString);
    let nextBirthday = new Date(birthDate.setFullYear(today.getFullYear()));
    nextBirthday = startOfDay(nextBirthday);
    if (isBefore(nextBirthday, today)) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    const days = differenceInDays(nextBirthday, today);
    return days === 0 ? 'Today!' : days === 1 ? 'Tomorrow!' : `${days} days`;
  };

  const groupBirthdays = (birthdays: Birthday[]) => {
    const today = startOfDay(new Date());
    const upcoming: Birthday[] = [];
    const thisWeek: Birthday[] = [];
    const thisMonth: Birthday[] = [];
    const next6Months: Birthday[] = [];
    const rest: Birthday[] = [];

    birthdays.forEach((birthday) => {
      const bDate = parseISO(birthday.date);
      let nextBday = new Date(bDate.setFullYear(today.getFullYear()));
      nextBday = startOfDay(nextBday);
      if (isBefore(nextBday, today)) nextBday = addYears(nextBday, 1);

      const daysUntil = differenceInDays(nextBday, today);
      if (daysUntil < 0) return;

      if (daysUntil === 0) upcoming.push(birthday);
      else if (isThisWeek(nextBday)) thisWeek.push(birthday);
      else if (isThisMonth(nextBday)) thisMonth.push(birthday);
      else if (daysUntil <= 180) next6Months.push(birthday);
      else rest.push(birthday);
    });

    return { upcoming, thisWeek, thisMonth, next6Months, rest };
  };

  const { upcoming, thisWeek, thisMonth, next6Months, rest } = groupBirthdays(birthdays);

  const buildFlatListData = (): ListItem[] => {
    const sections: [string, Birthday[]][] = [
      ['Upcoming', upcoming],
      ['This Week', thisWeek],
      ['This Month', thisMonth],
      ['Next 6 Months', next6Months],
      ['Rest', rest],
    ];

    const flatListData: ListItem[] = [];

    sections.forEach(([title, items]) => {
      if (items.length > 0) {
        flatListData.push({ type: 'header', title });
        items.forEach((birthday) => flatListData.push({ type: 'item', birthday }));
      }
    });

    return flatListData;
  };

  const renderBirthdayCard = (birthday: Birthday) => {
    const daysText = getDaysUntilBirthday(birthday.date);
    const colors = getBackgroundColor(daysText);

    return (
      <TouchableOpacity
        style={styles.birthdayCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EditBirthday', { birthday })}
      >
        <LinearGradient
          colors={colors}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <Text style={styles.avatar}>{birthday.avatar}</Text>
            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={1}>
                {birthday.name}
              </Text>
              <Text style={styles.date}>{format(parseISO(birthday.date), 'MMMM do')}</Text>
            </View>
            <View style={styles.ageContainer}>
                <Text style={styles.ageText}>{getNextAge(birthday.date)}</Text>
                <Text style={styles.daysSubtext}>
                    {getDaysUntilBirthday(birthday.date).replace('!', '')}
                </Text>
                </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
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
          <Text style={styles.emptyText}>No birthdays yet!</Text>
        </View>
      ) : (
        <FlatList
          data={buildFlatListData()}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${item.title}` : item.birthday.id
          }
          renderItem={({ item }) =>
            item.type === 'header' ? (
              <Text style={styles.sectionTitle}>{item.title}</Text>
            ) : (
              renderBirthdayCard(item.birthday)
            )
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ...homescreenstyles,
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;
