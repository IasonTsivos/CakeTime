import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { getBirthdays } from '../utils/storage';
import { Birthday } from '../types/Birthday';
import { parseISO, format, isBefore } from 'date-fns';

const HomeScreen = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    const loadBirthdays = async () => {
      const saved = await getBirthdays();

      const sorted = saved.sort((a, b) => {
        const today = new Date();
        const aDate = parseISO(a.date);
        const bDate = parseISO(b.date);

        const aNext = new Date(aDate.setFullYear(today.getFullYear()));
        const bNext = new Date(bDate.setFullYear(today.getFullYear()));

        if (isBefore(aNext, today)) aNext.setFullYear(today.getFullYear() + 1);
        if (isBefore(bNext, today)) bNext.setFullYear(today.getFullYear() + 1);

        return aNext.getTime() - bNext.getTime();
      });

      setBirthdays(sorted);
    };

    loadBirthdays();
  }, []);

  const renderItem = ({ item }: { item: Birthday }) => (
    <TouchableOpacity style={styles.birthdayCard} activeOpacity={0.8}>
      <Text style={styles.avatar}>{item.avatar}</Text>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>{format(parseISO(item.date), 'MMMM do')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upcoming Birthdays 🎉</Text>
      <FlatList
        data={birthdays}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 40,
  },
  birthdayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    fontSize: 36,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#777',
  },
});
