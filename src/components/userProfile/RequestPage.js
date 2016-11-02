import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

class RequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      text: '',
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      loaded: true,
    });
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

  renderRequestPage() {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What would you like to ask first?</Text>
        <Text style={styles.subTitle}>Subjects</Text>
        <Text>Get a new Job</Text>
        <Text style={styles.subTitle}>Message</Text>
        <TextInput
          multiline={true}
          style={styles.multiline}
          placeholder='Enter message'
          onChangeText={(text) => this.setState({ text })}/>

          <LinearGradient style={styles.sendButton} start={[0.9, 0.5]} end={[0.0, 0.5]}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
          <TouchableWithoutFeedback>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>SEND</Text>
            </View>
          </TouchableWithoutFeedback>
          </LinearGradient>
      </ScrollView>
    );
  }

  render() {
    // if (!this.state.loaded) {
    //   return this.renderLoadingView();
    // }

    return this.renderRequestPage();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  content: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#2e3031',
    marginTop: HEIGHT / 15,
    marginBottom: 50,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 30,
    marginBottom: 10,
    color: '#a6aeae',
  },
  multiline: {
    alignSelf: 'center',
    width: 315,
    height: 263,
    borderColor: '#efeff2',
    borderRadius: 2,
    borderWidth: 2,
    padding: 15,
    marginBottom: 30,
  },
  sendButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 230,
    height: 45,
    marginBottom: 25,
    borderRadius: 100,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'opensans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
});

module.exports = RequestPage;
