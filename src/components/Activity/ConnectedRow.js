import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ChatPage from '../Chat/ChatPage';

class ConnectedRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileImage: '',
      name: '',
      position: '',
      company: '',
      currentStatus: '',
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      profileImage: this.getProfileImage(),
      name: this.getName(),
      currentStatus: this.getCurrentStatus(),
      loaded: true,
    });
  }

  getProfileImage() {
    let image;
    if (this.props.dataSource.profile_picture) {
      image = { uri: this.props.dataSource.profile_picture };
      return image;
    } else {
      image = require('../../resources/pattern.png');
      return image;
    }
  }

  getName() {
    if (this.props.dataSource.name) {
      return this.props.dataSource.name;
    } else {
      return this.state.name;
    }
  }

  getCurrentStatus() {
    let position = this.state.position;
    let company = this.state.company;

    if (this.props.dataSource.work.length > 0) {
      company = this.props.dataSource.work[0].employer.name;
      if (this.props.dataSource.work[0].position) {
        position = this.props.dataSource.work[0].position.name;
      }

      return position + ' at ' + company;
    }
  }

  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size='small'
      />
    );
  }

  onChatButtonPress() {
    Actions.chatPage({
      title: this.props.dataSource.name,
      me: { userId: this.props.me._id },
      opponent: { userId: this.props.dataSource._id },
    });
  }

  renderRow() {
    let profileId = { _id: this.props.dataSource._id };
    const goToUserProfile = () => Actions.userProfile(profileId);

    return (
      <TouchableWithoutFeedback onPress={goToUserProfile}>
        <View style={styles.row}>
          <Image style={styles.photo}
            source={this.state.profileImage}/>
          <View style={styles.userInformation}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.currentStatus}>{this.state.currentStatus}</Text>
          </View>
          <TouchableHighlight
            style={styles.chatButtonBackground}
            onPress={this.onChatButtonPress.bind(this)}
            >
            <Image source={require('../../resources/chatButton.png')}/>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderRow();
  }
}

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  photo: {
    height: 40,
    width: 40,
    margin: 20,
    borderRadius: 20,
  },
  userInformation: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  name: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 14,
    marginBottom: 2,
    color: '#2e3031',
  },
  currentStatus: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 12,
    color: '#a6aeae',
  },
  chatButtonBackground: {
    position: 'absolute',
    alignSelf: 'center',
    padding: 5,
    paddingRight: 9,
    paddingLeft: 9,
    marginTop: 25,
    borderRadius: 2,
    right: WIDTH / 20,
    backgroundColor: '#557bfc',
  },
  seperator: {
    alignItems: 'stretch',
    borderWidth: 10,
    height: 2,
    borderColor: '#efeff2',
  },
});

module.exports = ConnectedRow;
