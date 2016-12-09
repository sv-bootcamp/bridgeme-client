import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import {
  Actions,
  Router,
  Reducer,
  Scene,
} from 'react-native-router-flux';
import AppProps from './AppProps';
import FCM from 'react-native-fcm';
import LayoutAnimation from './Shared/LayoutAnimation';

// Define reducer to manage scenes
const reducerCreate = params=> {
  const defaultReducer = Reducer(params);
  return (state, action)=> {
    if (action.scene) {
      App.scene = action.scene;
    }

    return defaultReducer(state, action);
  };
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let routerProp = {
      createReducer: reducerCreate,
      animationStyle: LayoutAnimation.animationStyle,
      backAndroidHandler: () => this.backAndroidHandler(),
    };

    let Scenes = AppProps.sceneProps.map((props, key) => <Scene {...props} />);

    return (
      <Router {...routerProp}>
        <Scene {...AppProps.rootProp}>
          {Scenes}
        </Scene>
      </Router>
    );
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      FCM.requestPermissions();
    }
  }

  backAndroidHandler() {
    let scene = App.scene.sceneKey;
    if (scene === 'onBoarding' ||
        scene === 'evalPageMain' ||
        scene === 'main' ||
        scene === 'generalInfo' ||
        scene === 'login'
    ) {
      return true;
    }

    Actions.pop();
    return true;
  }
}

module.exports = App;
