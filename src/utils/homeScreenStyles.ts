import { StyleSheet, Platform } from 'react-native';
import { Dimensions } from 'react-native';

const { width,height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    width: 70, // Keep original size to avoid scaling the card
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0, // Remove margin, we'll add padding in 'details'
  },
  ageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  
  ageText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  
  daysSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
    marginTop: 2,
  },
  
  avatar: {
    fontSize: 45, // Increased from 46 to make it bigger
  },
  
  details: {
    flex: 1,
    paddingLeft: 15, // Adds spacing between avatar and text
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
  backgroundAnimation: {
      position: 'absolute' as 'absolute', 
      width,                              
      height,                             
      top: 0,
      left: 0,
      zIndex: -1,
      opacity: 0.4,
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

export default styles;
