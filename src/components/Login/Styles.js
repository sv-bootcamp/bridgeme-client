import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  mainLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookLoginContainer: {
    flexDirection: 'row',
    marginTop: 87,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookLoginButton: {
    width: 15,
    height: 15,
  },
  facebookLoginText: {
    marginLeft: 20,
    fontSize: 15,
    color: '#4460a0',
  },
  hrContainer: {
    flexDirection: 'row',
    width: 175,
    marginTop: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hr: {
    flex: 1,
    width: 106,
    height: 1,
    backgroundColor: '#efeff2',
  },
  hrText: {
    marginLeft: 14,
    marginRight: 14,
    color: '#d8d8d8',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },
  input: {
    width: 251,
    height: 45,
    paddingLeft: 14,
    paddingRight: 14,
    fontSize: 14,
  },
  loginBtn: {
    width: 240,
    height: 45,
    borderRadius: 100,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTextContainer: {
    marginTop: 5,
  },
  subText: {
    fontSize: 12,
    color: '#44acff',
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTextLeft: {
    fontSize: 12,
    color: '#a6aeae',
  },
  bottomTextRight: {
    fontSize: 12,
    color: '#44acff',
  },
});

module.exports = styles;
