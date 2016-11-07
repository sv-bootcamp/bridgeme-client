import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-menu';
import LinearGradient from 'react-native-linear-gradient';
import ErrorMeta from '../../utils/ErrorMeta';
import ServerUtil from '../../utils/ServerUtil';

class RequestPage extends Component {
  constructor(props) {
    super(props);
    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));

    this.state = {
      message: '',
      selection: '  -- Choose --',
      messageLength: 0,
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      loaded: true,
    });
  }

  onChangeMessage(message) {
    this.setState({
      message: message,
      messageLength: message.length,
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

  sendMessage() {

    // TODO: This will be changed with request to server
    Actions.requestSent();

    // ServerUtil.sendMentoringRequest(this.props.id, 'Mentor request');
  }

  onRequestSuccess(result) {
    Actions.requestSent();
  }

  onRequestFail(error) {
    if (error.code != ErrorMeta.ERR_NONE) {
      Alert.alert(error.msg);
    }
  }

  renderRequestPage() {
    const send = () => this.sendMessage();

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What would you like to ask first?</Text>
        <Text style={styles.subTitle}>Subjects</Text>
        <MenuContext ref="MenuContext">
          <View style={styles.dropdownContent}>
            <Menu style={styles.dropdown}
              onSelect={(value) => this.setState({ selection: value })}>
              <MenuTrigger>
                <Text>{this.state.selection}</Text>
              </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.dropdownOptions}
                        renderOptionsContainer={(options) =>
                         <ScrollView>{options}</ScrollView>}>
              <MenuOption value="One">
               <Text>Get a new job</Text>
              </MenuOption>
              <MenuOption value="Two">
               <Text>Option Two</Text>
              </MenuOption>
              <MenuOption value="Three">
               <Text>Option Three</Text>
              </MenuOption>
            </MenuOptions>
            </Menu>
          </View>
        </MenuContext>
        <View style={styles.messageContainer}>
          <Text style={styles.subTitle}>Message</Text>
          <Text style={styles.messageLength}>{this.state.messageLength} / 140 </Text>
        </View>
        <TextInput
          multiline={true}
          style={styles.multiline}
          placeholder='Enter message'
          maxLength={140}
          onChangeText={this.onChangeMessage.bind(this)}/>
        <LinearGradient style={styles.sendButton} start={[0.9, 0.5]} end={[0.0, 0.5]}
          locations={[0, 0.75]}
          colors={['#07e4dd', '#44acff']}>
          <TouchableWithoutFeedback onPress={send}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>SEND</Text>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
        <StatusBar
         backgroundColor = 'transparent'
         barStyle = 'default'
         networkActivityIndicatorVisible={false}
        />
      </ScrollView>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderRequestPage();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  content: {
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
    marginLeft: 36,
    marginBottom: 10,
    color: '#a6aeae',
    backgroundColor: 'transparent',
  },
  messageContainer: {
    flexDirection: 'row',
  },
  messageLength: {
    fontSize: 10,
    left: WIDTH / 2 + 50,
    color: '#a6aeae',
    backgroundColor: 'transparent',
  },
  multiline: {
    alignSelf: 'center',
    width: WIDTH - (WIDTH / 6),
    height: HEIGHT / 2.5,
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
  dropdownContent: {
    marginBottom: 30,
    alignSelf: 'center',
    borderColor: '#efeff2',
  },
  dropdown: {
    justifyContent: 'center',
    width: WIDTH - (WIDTH / 6),
    height: 40,
    borderColor: '#efeff2',
    borderRadius: 2,
    borderWidth: 1,
    padding: 5,
  },
  dropdownOptions: {
    borderColor: '#efeff2',
    borderWidth: 2,
    width: WIDTH - (WIDTH / 6),
    height: 100,
  },
});

module.exports = RequestPage;
