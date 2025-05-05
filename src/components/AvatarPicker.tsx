import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const avatarSize = width / 5 - 30;  // Adjusted avatar size for smaller screens

const avatars = [
  '🐶', '🐱', '🦊', '🐵',
  '🐸', '🦄', '🐯', '🐼',
  '🐷', '🐻', '🐰', '🐨',
  '🦁', '🐮', '🐹', '🐲',
  '🦉', '🐧', '🐺', '🦋',
];

interface AvatarPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
}

export default function AvatarPicker({
  visible,
  onClose,
  onSelect,
}: AvatarPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlayContainer}>
        {Platform.OS === 'ios' ? (
          <BlurView style={StyleSheet.absoluteFill} blurType="light" blurAmount={10} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
        )}

        <Animated.View
          style={styles.modalContainer}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Choose an Emoji Avatar</Text>

            <FlatList
              data={avatars}
              numColumns={4}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.avatarItem}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.avatar}>{item}</Text>
                </TouchableOpacity>
              )}
              initialNumToRender={8}
              windowSize={4}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  modalContainer: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',  // Set modal width to 90% of screen width for better responsiveness
    maxWidth: 350, // Max width to avoid modal becoming too large
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    maxHeight: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 15,
  },
  avatarItem: {
    width: avatarSize,
    height: avatarSize,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: avatarSize / 2,
  },
  avatar: {
    fontSize: avatarSize * 0.6,
  },
  closeButton: {
    backgroundColor: '#ff6b81',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
