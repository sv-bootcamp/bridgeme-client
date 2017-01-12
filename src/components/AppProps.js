import {
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  ActionConst,
  Actions,
} from 'react-native-router-flux';
import { dimensions } from './Shared/Dimensions';
import Activity from './Activity/Activity';
import Bookmark from './Bookmark/Bookmark';
import CareerInfo from './SignUp/CareerInfo';
import ChannelList from './Chat/ChannelList';
import ChatPage from './Chat/ChatPage';
import Completed from './SignUp/Completed';
import EditProfile from './EditProfile';
import ExpertInfo from './SignUp/ExpertInfo';
import Filter from './Filter/Filter';
import OnBoarding from './OnBoarding/OnBoardingPage';
import InputEmailAddr from './Login/InputEmailAddr';
import InputSecretCode from './Login/InputSecretCode';
import ResetPassword from './Login/ResetPassword';
import GeneralInfo from './SignUp/GeneralInfo';
import Login from './Login/Login';
import Main from './Main';
import MyPage from './MyPage';
import Personality from './SignUp/Personality';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';
import RequestPage from './userProfile/RequestPage';
import RequestSent from './userProfile/RequestSent';
import SignUp from './Login/SignUp';

const styles = StyleSheet.create({
  bar: {
    ...Platform.select({
      ios: {
        height: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        height: dimensions.heightWeight * 54,
      },
    }),
    padding: 0,
    backgroundColor: '#fbfbfb',
    borderBottomColor: '#d6dada',
  },
  titleWrapperStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: 0,
    ...Platform.select({
      ios: {
        top: 20,
        height: dimensions.heightWeight * 44,
      },
      android: {
        height: dimensions.heightWeight * 54,
        top: 0,
      },
    }),
    left: 0,
    right: 0,
  },
  rightButtonStyle: {
    ...Platform.select({
      ios: {
        top: 20,
        height: dimensions.heightWeight * 44,
      },
      android: {
        height: dimensions.heightWeight * 54,
        top: 0,
      },
    }),
    backgroundColor: 'transparent',
    padding: 0,
    marginTop: 0,
    justifyContent: 'center',
  },
  leftButtonStyle: {
    ...Platform.select({
      ios: {
        top: 20,
        height: dimensions.heightWeight * 44,
      },
      android: {
        height: dimensions.heightWeight * 54,
        top: 0,
      },
    }),
    backgroundColor: 'transparent',
    position: 'absolute',
    marginLeft: dimensions.widthWeight * 10,
    alignItems: 'center',
    padding: 0,
  },
  mainTitle: {
    backgroundColor: 'transparent',
    fontFamily: 'ProductSans-Bold',
    fontSize: dimensions.fontWeight * 17,
    color: '#2e3031',
  },
  title: {
    backgroundColor: 'transparent',
    fontFamily: 'SFUIText-Regular',
    fontSize: dimensions.fontWeight * 17,
    color: '#2e3031',
  },
  rightTxt: {
    backgroundColor: 'transparent',
    width: dimensions.widthWeight * 0,
    height: dimensions.heightWeight * 0,
    fontSize: dimensions.fontWeight * 17,
    color: '#557bfc',
  },
  rightBtn: {
    backgroundColor: 'transparent',
    marginRight: dimensions.widthWeight * 16,
    width: dimensions.widthWeight * 20,
    height: dimensions.heightWeight * 18,
    resizeMode: 'contain',
  },
  rightBtnBookmark: {
    backgroundColor: 'transparent',
    marginRight: dimensions.widthWeight * 25,
    width: dimensions.widthWeight * 23,
    height: dimensions.heightWeight * 21,
    resizeMode: 'contain',
  },
  leftBtn: {
    backgroundColor: 'transparent',
    width: dimensions.widthWeight * 25,
    height: dimensions.heightWeight * 20,
    resizeMode: 'contain',
  },
  leftBtnCancel: {
    backgroundColor: 'transparent',
    width: dimensions.widthWeight * 13,
    height: dimensions.heightWeight * 13,
  },
});

const leftButtonGrey = require('../resources/icon-arrow-left-grey.png');
const leftButtonWhite = require('../resources/icon-arrow-left-white.png');
const backButton = require('../resources/icon-arrow-left-white.png');
const cancelButton = require('../resources/icon-cancel.png');
const filterButton = require('../resources/filter.png');

const AppProps = {
  rootProp: {
    key: 'root',
    titleStyle: styles.title,
    titleWrapperStyle: styles.titleWrapperStyle,
    rightButtonStyle: styles.rightButtonStyle,
    leftButtonStyle: styles.leftButtonStyle,
    rightButtonTextStyle: styles.rightTxt,
    rigntButtonIconStyle: styles.rightBtn,
    navigationBarStyle: styles.bar,
    leftButtonIconStyle: styles.leftBtn,
  },
  sceneProps: [
    {
      key: 'onBoarding',
      component: OnBoarding,
      hideNavBar: true,
      type: ActionConst.RESET,
    },
    {
      initial: true,
      key: 'login',
      component: Login,
      hideNavBar: true,
      type: ActionConst.RESET,
    },
    {
      key: 'signUp',
      component: SignUp,
      hideNavBar: true,
    },
    {
      key: 'inputEmailAddr',
      component: InputEmailAddr,
      hideNavBar: false,
      title: 'Forgot Password',
      hideBackImage: false,
      backButtonImage: leftButtonGrey,
    },
    {
      key: 'inputSecretCode',
      component: InputSecretCode,
      hideNavBar: false,
      title: 'Forgot Password',
      hideBackImage: false,
      backButtonImage: leftButtonGrey,
    },
    {
      key: 'resetPassword',
      component: ResetPassword,
      hideNavBar: false,
      title: 'Forgot Password',
      hideBackImage: false,
      backButtonImage: leftButtonGrey,
    },
    {
      key: 'generalInfo',
      component: GeneralInfo,
      hideNavBar: false,
      title: 'General Info',
      type: ActionConst.RESET,
    },
    {
      key: 'careerInfo',
      component: CareerInfo,
      hideNavBar: false,
      title: 'Career Info',
      type: ActionConst.RESET,
    },
    {
      key: 'expertInfo',
      component: ExpertInfo,
      hideNavBar: false,
      title: 'My expertise',
      hideBackImage: false,
      backButtonImage: leftButtonGrey,
    },
    {
      key: 'personality',
      component: Personality,
      hideNavBar: false,
      title: 'Personality',
      hideBackImage: false,
      backButtonImage: leftButtonGrey,
    },
    {
      key: 'completed',
      component: Completed,
      hideNavBar: false,
      title: 'Congrats!',
      type: ActionConst.RESET,
      backButtonImage: leftButtonGrey,
    },
    {
      key: 'main',
      component: Main,
      hideNavBar: false,
      title: 'Bridge Me',
      titleStyle: styles.mainTitle,
      type: ActionConst.RESET,
      rightTitle: 'right',
      rightButtonIconStyle: styles.rightBtn,
      rightButtonImage: filterButton,
      onRight: () => Actions.filter(),
    },
    {
      key: 'userList',
      component: UserList,
    },
    {
      key: 'myPage',
      component: MyPage,
    },
    {
      key: 'bookmark',
      component: Bookmark,
      title: 'Bookmark',
      hideBackImage: false,
      backButtonImage: leftButtonGrey,
    },
    {
      key: 'userProfile',
      component: UserProfile,
      direction: 'fade',
      duration: 500,
      hideNavBar: true,
    },
    {
      key: 'filter',
      component: Filter,
      title: 'Filter',
      backButtonImage: cancelButton,
      leftButtonIconStyle: styles.leftBtnCancel,
      direction: 'diagonal',
      hideNavBar: false,
    },
    {
      key: 'requestPage',
      component: RequestPage,
      title: 'Request Connection',
      backButtonImage: cancelButton,
      leftButtonIconStyle: styles.leftBtnCancel,
    },
    {
      key: 'requestSent',
      component: RequestSent,
      title: 'Request Sent',
      hideBackImage: true,
      backButtonImage: backButton,
    },
    {
      key: 'activity',
      component: Activity,
    },
    {
      key: 'chatPage',
      component: ChatPage,
      hideBackImage: false,
      backButtonImage: leftButtonGrey,
      onBack: () => {
        Actions.pop();

        // Delay 20ms to refresh previous scene when current scene is completely popped.
        setTimeout(() => Actions.refresh(), 20);
      },
    },
    {
      key: 'channelList',
      component: ChannelList,
    },
    {
      key: 'editProfile',
      component: EditProfile,
      title: 'Edit profile',
      backButtonImage: leftButtonGrey,
      type: ActionConst.PUSH,
      onBack: () => {
        Actions.pop();

        // Delay 20ms to refresh previous scene when current scene is completely popped.
        setTimeout(() => Actions.refresh(), 20);
      },
    },
  ],
};

export default AppProps;
