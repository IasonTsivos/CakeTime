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
  Image,
} from 'react-native';
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
import homescreenstyles from '../styles/homeScreenStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestNotificationPermission } from '../utils/requestNotification';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width - 40;

type RootStackParamList = {
  Home: undefined;
  AddBirthday: undefined;
  EditBirthday: { birthday: Birthday };
  Settings: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

type ListItem = { type: 'header'; title: string } | { type: 'item'; birthday: Birthday };

const getNextAge = (dateString: string) => {
  const birthDate = parseISO(dateString);
  const today = new Date();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() < birthDay)
  ) {
    age--;
  }
  return age ;
};

const getCardColors = (
  daysText: string,
  isUpcoming: boolean
): [ColorValue, ColorValue] => {
  if (isUpcoming) return ['#ff3399', '#ffff00'];
  return getBackgroundColor(daysText);
};

const getBackgroundColor = (daysText: string): [ColorValue, ColorValue] => {
  if (daysText === 'Today!') return ['#FF9A9E', '#FAD0C4'];
  if (daysText === 'Tomorrow!') return ['#A1C4FD', '#C2E9FB'];
  return ['#FFFDD0', '#FEDEB8'];
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [upcomingBirthdayIds, setUpcomingBirthdayIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      requestNotificationPermission();
      const loadBirthdays = async () => {
        try {
          const saved: Birthday[] = await getBirthdays();
          const today = startOfDay(new Date());
          const sorted = saved.sort((a, b) => {
            const aDate = startOfDay(parseISO(a.date));
            const bDate = startOfDay(parseISO(b.date));
            let aNext = new Date(aDate.setFullYear(today.getFullYear()));
            let bNext = new Date(bDate.setFullYear(today.getFullYear()));
            if (isBefore(aNext, today)) aNext = addYears(aNext, 1);
            if (isBefore(bNext, today)) bNext = addYears(bNext, 1);
            return aNext.getTime() - bNext.getTime();
          });

          const { upcoming, thisWeek, thisMonth, next6Months, rest } = groupBirthdays(sorted);
          setUpcomingBirthdayIds(new Set(upcoming.map((b) => b.id)));
          setBirthdays([...upcoming, ...thisWeek, ...thisMonth, ...next6Months, ...rest]);
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

    const allWithNextDates = birthdays.map((birthday) => {
      const bDate = parseISO(birthday.date);
      let nextBday = new Date(bDate.setFullYear(today.getFullYear()));
      nextBday = startOfDay(nextBday);
      if (isBefore(nextBday, today)) nextBday = addYears(nextBday, 1);
      return { birthday, nextBday };
    });

    allWithNextDates.sort((a, b) => a.nextBday.getTime() - b.nextBday.getTime());

    const upcoming: Birthday[] = [];
    const thisWeek: Birthday[] = [];
    const thisMonth: Birthday[] = [];
    const next6Months: Birthday[] = [];
    const rest: Birthday[] = [];

    let upcomingDate: Date | null = null;

    allWithNextDates.forEach(({ birthday, nextBday }) => {
      if (!upcomingDate) {
        upcomingDate = nextBday;
      }

      if (nextBday.getTime() === upcomingDate.getTime()) {
        upcoming.push(birthday);
      } else if (isThisWeek(nextBday, { weekStartsOn: 1 })) {
        thisWeek.push(birthday);
      } else if (isThisMonth(nextBday)) {
        thisMonth.push(birthday);
      } else if (differenceInDays(nextBday, today) <= 180) {
        next6Months.push(birthday);
      } else {
        rest.push(birthday);
      }
    });

    return { upcoming, thisWeek, thisMonth, next6Months, rest };
  };

  const buildFlatListData = (): ListItem[] => {
    const { upcoming, thisWeek, thisMonth, next6Months, rest } = groupBirthdays(birthdays);

    const sections: [string, Birthday[]][] = [
      ['Coming soon...', upcoming],
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

  const flatListData = buildFlatListData();

  const renderBirthdayCard = (birthday: Birthday, isUpcoming: boolean) => {
    const daysText = getDaysUntilBirthday(birthday.date);
    const colors = getCardColors(daysText, isUpcoming);

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
            <Image
              source={{ uri: birthday.avatar }}
              style={styles.avatarImage}
              resizeMode="contain"
            />
            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={1}>
                {birthday.name}
              </Text>
              <Text style={styles.date}>{format(parseISO(birthday.date), 'MMMM do')}</Text>
            </View>
            <View style={styles.ageContainer}>
              <Text style={styles.ageText}>{getNextAge(birthday.date)}</Text>
              <Text style={styles.daysSubtext}>{daysText.replace('!', '')}</Text>
            </View>
          </View>

          {isUpcoming && (
            <LottieView
              source={require('../assets/animations/confettinew.json')}
              autoPlay
              loop
              style={styles.confettiAnimation}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top - 30 }]}>
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
          data={flatListData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${item.title}` : item.birthday.id
          }
          renderItem={({ item }) =>
            item.type === 'header' ? (
              <Text style={styles.sectionTitle}>{item.title}</Text>
            ) : (
              renderBirthdayCard(item.birthday, upcomingBirthdayIds.has(item.birthday.id))
            )
          }
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <MaterialIcons name="settings" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ...homescreenstyles,
});

export default HomeScreen;
