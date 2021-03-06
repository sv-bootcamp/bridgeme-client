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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-menu';
import { dimensions } from '../Shared/Dimensions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import MatchUtil from '../../utils/MatchUtil';
import Text from '../Shared/UniText';

class RequestPage extends Component {
  constructor(props) {
    super(props);

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
        size="small"
      />
    );
  }

  sendMessage() {
    MatchUtil.sendMentoringRequest(this.onRequestCallback.bind(this),
      this.props.id, this.state.selection, this.state.message);
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      Actions.requestSent({ me: this.props.me });
    }
  }

  renderRequestPage() {
    const send = () => this.sendMessage();

    return (
      <MenuContext lazyRender={200} ref="MenuContext">
        <KeyboardAwareScrollView
          extraHeight={HEIGHT / 2.5}
          contentContainerStyle={styles.content}>
          <Text style={styles.title}>What would you like to ask first?</Text>
          <Text style={styles.subTitle}>Subject</Text>
          <View style={styles.dropdownContent}>
            <Menu onSelect={(value) => this.setState({ selection: value })}>
              <MenuTrigger style={styles.dropdown}>
                <Text style={styles.dropdownText}>{this.state.selection}</Text>
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.dropdownOptions}
                renderOptionsContainer={(options) =>
                  <ScrollView>{options}</ScrollView>}>
                <MenuOption value="Study abroad">
                  <Text>Study abroad</Text>
                </MenuOption>
                <MenuOption value="Career advice">
                  <Text>Career advice</Text>
                </MenuOption>
                <MenuOption value="Portfolio & resume">
                  <Text>Portfolio & resume</Text>
                </MenuOption>
                <MenuOption value="Start up">
                  <Text>Start up</Text>
                </MenuOption>
                <MenuOption value="Career change">
                  <Text>Career change</Text>
                </MenuOption>
                <MenuOption value="Networking">
                  <Text>Networking</Text>
                </MenuOption>
                <MenuOption value="Soft skills">
                  <Text>Soft skills</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.subTitle}>Message</Text>
            <Text style={styles.messageLength}>{this.state.messageLength} / 140 </Text>
          </View>
          <TextInput
            multiline={true}
            style={styles.multiline}
            placeholder="Enter message"
            maxLength={140}
            underlineColorAndroid="transparent"
            textAlignVertical="top"
            onChangeText={this.onChangeMessage.bind(this)}/>
          <TouchableOpacity onPress={send}>
            <LinearGradient
              style={styles.sendButton}
              start={{ x: 0.9, y: 0.5 }}
              end={{ x: 0.0, y: 0.5 }}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>SEND</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <StatusBar
            backgroundColor = "transparent"
            barStyle = "default"
            networkActivityIndicatorVisible={false}
          />
        </KeyboardAwareScrollView>
      </MenuContext>
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
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.heightWeight * 20,
    paddingHorizontal: dimensions.widthWeight * 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: dimensions.fontWeight * 18,
    color: '#2e3031',
    marginTop: HEIGHT / 15,
    marginBottom: dimensions.heightWeight * 50,
  },
  subTitle: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    marginLeft: dimensions.widthWeight * 36,
    marginBottom: dimensions.heightWeight * 10,
    color: '#a6aeae',
    backgroundColor: 'transparent',
  },
  messageContainer: {
    flexDirection: 'row',
    zIndex: 100,
  },
  messageLength: {
    fontSize: dimensions.fontWeight * 10,
    marginLeft: WIDTH * 0.58,
    color: '#a6aeae',
    backgroundColor: 'transparent',
  },
  multiline: {
    alignSelf: 'center',
    width: WIDTH - (WIDTH / 6),
    height: HEIGHT / 5,
    borderColor: '#efeff2',
    borderRadius: 2,
    borderWidth: 1,
    paddingVertical: dimensions.heightWeight * 15,
    paddingHorizontal: dimensions.widthWeight * 15,
    marginBottom: dimensions.heightWeight * 30,
  },
  sendButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: WIDTH * 0.613,
    height: HEIGHT * 0.067,
    borderRadius: WIDTH * 0.267,
    marginTop: HEIGHT / 8,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: dimensions.fontWeight * 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  dropdownContent: {
    zIndex: 101,
    backgroundColor: 'transparent',
    marginBottom: dimensions.heightWeight * 30,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#efeff2',
  },
  dropdown: {
    backgroundColor: 'transparent',
    width: WIDTH - (WIDTH / 6),
    height: dimensions.heightWeight * 40,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#efeff2',
    borderRadius: 2,
    borderWidth: 1,
  },
  dropdownOptions: {
    borderColor: '#efeff2',
    borderWidth: 2,
    width: WIDTH - (WIDTH / 6),
    left: dimensions.widthWeight * 30,
    height: dimensions.heightWeight * 200,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dropdownText: {
    marginLeft: WIDTH * 0.053,
  },
});

module.exports = RequestPage;
