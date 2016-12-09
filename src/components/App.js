import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import ErrorUtils from 'ErrorUtils';
import {
  Actions,
  Router,
  Reducer,
  Scene,
} from 'react-native-router-flux';
import AppProps from './AppProps';
import FCM from 'react-native-fcm';

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

export const animationStyle = (props) => {
  const { layout, position, scene } = props;
  const direction = (scene.navigationState && scene.navigationState.direction) ?
        scene.navigationState.direction : 'horizontal';
  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];
  const width = layout.initWidth;
  const height = layout.initHeight;

  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 0.5],
  });

  const scale = position.interpolate({
    inputRange,
    outputRange: [1, 1, 0.95],
  });

  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case 'fade':
      translateX = 0;
      translateY = 0;
      break;
  }

  return {
        opacity,
        transform: [
            { scale },
            { translateX },
            { translateY },
        ],
      };
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let routerProp = {
      createReducer: reducerCreate,
      backAndroidHandler: () => this.backAndroidHandler(),
    };

    let Scenes = AppProps.sceneProps.map((props, key) => <Scene {...props} />);

    return (
      <Router {...routerProp} animationStyle={animationStyle}>
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
