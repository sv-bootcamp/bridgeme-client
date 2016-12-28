import { StyleSheet } from 'react-native';
import { dimensions } from '../Shared/Dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogoText: {
    fontFamily: 'ProductSans-Bold',
    color: '#003d6e',
    fontSize: dimensions.fontWeight * 18,
    marginTop: dimensions.heightWeight * 16,
  },
  facebookLoginContainer: {
    flexDirection: 'row',
    marginTop: dimensions.heightWeight * 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookLoginButton: {
    width: dimensions.widthWeight * 15,
    height: dimensions.heightWeight * 15,
  },
  facebookLoginText: {
    marginLeft: dimensions.widthWeight * 20,
    fontSize: dimensions.fontWeight * 15,
    color: '#4460a0',
  },
  hrContainer: {
    flexDirection: 'row',
    width: dimensions.widthWeight * 175,
    marginTop: dimensions.heightWeight * 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hr: {
    flex: 1,
    width: dimensions.widthWeight * 106,
    height: 1,
    backgroundColor: '#efeff2',
  },
  hrText: {
    marginLeft: dimensions.widthWeight * 14,
    marginRight: dimensions.widthWeight * 14,
    color: '#d8d8d8',
    fontSize: dimensions.fontWeight * 15,
  },
  inputContainer: {
    flexDirection: 'column',
    marginTop: dimensions.heightWeight * 20,
  },
  input: {
    width: dimensions.widthWeight * 251,
    height: dimensions.heightWeight * 45,
    paddingLeft: dimensions.widthWeight * 14,
    paddingRight: dimensions.widthWeight * 14,
    fontSize: dimensions.fontWeight * 14,
  },
  loginBtn: {
    width: dimensions.widthWeight * 240,
    height: dimensions.heightWeight * 45,
    borderRadius: 100,
    marginTop: dimensions.heightWeight * 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: dimensions.fontWeight * 16,
    fontWeight: 'bold',
  },
  subTextContainer: {
    marginTop: dimensions.heightWeight * 5,
  },
  subText: {
    fontSize: dimensions.fontWeight * 12,
    color: '#44acff',
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: dimensions.heightWeight * 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTextLeft: {
    fontSize: dimensions.fontWeight * 12,
    color: '#a6aeae',
  },
  bottomTextRight: {
    fontSize: dimensions.fontWeight * 12,
    color: '#44acff',
  },
});

module.exports = styles;
