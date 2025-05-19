import { StyleSheet, Platform } from 'react-native';
import { Dimensions } from 'react-native';

const { width,height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  avatarCircle: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 3,
    borderColor: '#ff6b81',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff6b81',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 16,
    color: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  backgroundAnimation: {
    position: 'absolute',
    width,
    height: Dimensions.get('window').height,
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.4,
  },
  button: {
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff6b81',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 40,
  },
  giftIdeaInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  giftIdeaInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  addGiftButton: {
    marginLeft: 10,
    backgroundColor: '#ffe6eb',
    borderRadius: 12,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b81',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  giftIdeaBubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  giftIdeaBubble: {
    flexDirection: 'row',
    backgroundColor: '#ff6b81',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  giftIdeaText: {
    color: 'white',
    fontSize: 14,
  },
  giftIdeaRemoveButton: {
    marginLeft: 6,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    padding: 2,
  },

});

export default styles;