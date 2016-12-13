import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../Shared/UniText';
import { Actions } from 'react-native-router-flux';

class RequestSent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      loaded: true,
    });

    // This is temporary function.
    setTimeout(() => {
      Actions.main({ me: this.props.me });
    }, 2000);
  }

  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size='large'
      />
    );
  }

  renderRequestSent() {
    return (
      <View style={styles.content}>
        <Image source={require('../../resources/img-sent.png')}
          style={styles.image} />
        <Text style={styles.successMsg}>Your request sent successfully</Text>
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderRequestSent();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  image: {
    marginTop: HEIGHT / 5,
  },
  successMsg: {
    fontSize: 18,
    marginTop: 39,
    color: '#2e3031',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

module.exports = RequestSent;
