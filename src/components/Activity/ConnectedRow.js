import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Text from '../Shared/UniText';

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

    const experience = this.props.dataSource.experience;
    if (experience && experience.length > 0) {
      company = experience[0].employer.name;
      if (experience[0].position) {
        position = experience[0].position.name;
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
            <Text ellipsizeMode={'tail'}
                  numberOfLines = {1}
                  style={styles.currentStatus}>
              {this.state.currentStatus}
              </Text>
          </View>
          <View style={styles.chatButtonArea}>
            <TouchableHighlight
              style={styles.chatButtonBackground}
              onPress={this.onChatButtonPress.bind(this)}
            >
              <Image source={require('../../resources/chatButton.png')}/>
            </TouchableHighlight>
          </View>
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
    height: 75,
  },
  photo: {
    height: 40,
    width: 40,
    margin: 15,
    marginTop: 20,
    borderRadius: 20,
  },
  userInformation: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderColor: '#f0f0f2',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e3031',
    marginBottom: 5,
  },
  currentStatus: {
    fontSize: 12,
    color: '#a6aeae',
  },
  chatButtonArea: {
    width: 85,
    borderBottomWidth: 1,
    borderColor: '#f0f0f2',
  },
  chatButtonBackground: {
    position: 'absolute',
    alignSelf: 'center',
    padding: 7,
    paddingTop: 8,
    paddingLeft: 8,
    marginTop: 22,
    borderRadius: 2,
    right: WIDTH / 20,
    backgroundColor: '#44acff',
  },
});

module.exports = ConnectedRow;
