import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';
import Communications from 'react-native-communications';

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goToUserProfile: () => Actions.userProfile({ _id: this.props.dataSource._id }),
    };

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));
  }

  onRequestSuccess(result) {

    // Check if request is from 'getActivityList'
    // If not, call 'getActivityList' to refresh parent's listview
    if (result.pending) {
      this.props.onSelect(result);
    } else {
      ServerUtil.getActivityList();
    }
  }

  onRequestFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }
  }

  renderConnectRow() {
    return (
      <TouchableWithoutFeedback onPress={this.state.goToUserProfile}>
        <View style={styles.row}>
          <Image style={styles.photo}
                 source={{ uri: this.props.dataSource.profile_picture }}/>
          <View style={styles.userInformation}>
            <Text style={styles.name}>{this.props.dataSource.name}</Text>
          </View>
          <TouchableHighlight style={styles.connectButton}
          onPress={() => Communications.email
            ([this.props.dataSource.email], null, null, 'To my Mentor/Mentee', 'Email from Yoda')}>
            <Text style={styles.connectButtonText}>Write an Email</Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderRequestReceivedRow() {
    const acceptRequest = () => this.acceptRequest();
    const rejectRequest = () => this.rejectRequest();

    return (
      <TouchableWithoutFeedback onPress={this.state.goToUserProfile}>
        <View style={styles.row}>
          <Image style={styles.photo}
                 source={{ uri: this.props.dataSource.profile_picture }}/>
          <View style={styles.userInformation}>
            <Text style={styles.name}>{this.props.dataSource.name}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={rejectRequest}>
              <Image style={styles.rejectButton}
                source={require('../../resources/btn_deny_1x.png')} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={acceptRequest}>
              <Image style={styles.acceptButton}
                source={require('../../resources/check_1x.png')}/>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderRequestSentRow() {
    return (
      <TouchableWithoutFeedback onPress={this.state.goToUserProfile}>
        <View style={styles.row}>
          <Image style={styles.photo}
                 source={{ uri: this.props.dataSource.profile_picture }}/>
          <View style={styles.userInformation}>
            <Text style={styles.name}>{this.props.dataSource.name}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // Accept request
  acceptRequest() {
    ServerUtil.acceptRequest(this.props.dataSource.id);
    Actions.evalPage({ select: 'mentor' });
  }

  // Reject request
  rejectRequest() {
    ServerUtil.rejectRequest(this.props.dataSource.id);
  }

  render() {

    // Distinguish section header types
    if (this.props.dataSource.type === 'accepted') {
      return this.renderConnectRow();

    } else if (this.props.dataSource.type === 'pending') {
      return this.renderRequestSentRow();

    } else if (this.props.dataSource.type === 'requested') {
      return this.renderRequestReceivedRow();
    }
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f7f7f9',
    margin: 5,
  },
  photo: {
    height: 80,
    width: 80,
    margin: 15,
    borderRadius: 40,
  },
  imageSeperator: {
    alignItems: 'center',
    marginTop: 7.5,
    marginBottom: 7.5,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  userInformation: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  name: {
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 'normal',
  },
  job: {
    fontSize: 13,
    marginTop: 5,
  },
  education: {
    fontSize: 13,
    marginTop: 5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  acceptButton: {
    height: 40,
    width: 40,
    marginRight: 25,
  },
  rejectButton: {
    height: 40,
    width: 40,
    marginRight: 10,
  },
  connectButtonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center',
    margin: 5,
  },
  connectButton: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#1ecfe2',
    borderRadius: 2,
    marginTop: 35,
    marginRight: 15,
  },
});

module.exports = Row;
