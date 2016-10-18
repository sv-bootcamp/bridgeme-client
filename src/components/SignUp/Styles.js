import {
  StyleSheet,
  Platform,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
    paddingLeft: 40,
    paddingRight: 40,
    flex: 1,
    flexDirection: 'column',
  },

  profileImageView: {
    alignItems: 'center',
    marginTop: 40,
  },

  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 50,
  },

  title: {
    color: '#d6dada',
    fontSize: 12,
    fontWeight: 'bold',
  },

  input: {
    color: '#2e3031',
    fontSize: 16,
  },

  workView: {
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
    paddingBottom: 15,
  },

  workName: {
    color: '#2e3031',
    marginTop: 15,
    fontSize: 16,
  },

  workDate: {
    color: '#2e3031',
    marginTop: 10,
    fontSize: 12,
  },

  eduView: {
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
    paddingBottom: 15,
  },

  eduName: {
    color: '#2e3031',
    marginTop: 15,
    fontSize: 16,
  },

  eduSubject: {

  },

  eduDate: {
    color: '#2e3031',
    marginTop: 10,
    fontSize: 12,
  },

  firstMargin: {
    marginTop: 20,
  },

  sectionMargin: {
    marginTop: 10.5,
  },

  nextView: {
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 30,
  },

  nextImage: {
    width: 230,
    height: 45,
  },
});

module.exports = styles;
