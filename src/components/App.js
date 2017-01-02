import React, { Component } from 'react';
import { Platform } from 'react-native';
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
const reducerCreate = (params) => {
  const defaultReducer = Reducer(params);
  return (state, action) => {
    if (action.scene) {
      App.scene = action.scene;
    }

    return defaultReducer(state, action);
  };
};

class App extends Component {
  componentDidMount() {
    FCM.requestPermissions(); // Only 'iOS' but already treated in module.
  }

  backAndroidHandler() {
    const scene = App.scene.sceneKey;

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

  render() {
    const routerProp = {
      createReducer: reducerCreate,
      animationStyle: LayoutAnimation,
      backAndroidHandler: () => this.backAndroidHandler(),
    };

    const Scenes = AppProps.sceneProps.map((props, key) => <Scene {...props} />);

    return (
      <Router {...routerProp}>
        <Scene {...AppProps.rootProp}>
          {Scenes}
        </Scene>
      </Router>
    );
  }
}

module.exports = App;
