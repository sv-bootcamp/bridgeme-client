import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';
import Swipeout from './Swipeout';

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

  acceptRequest() {
    ServerUtil.acceptRequest(this.props.dataSource.id);
    Actions.evalPageMain({ select: 'mentor' });
  }

  rejectRequest() {
    ServerUtil.rejectRequest(this.props.dataSource.id);
  }

  render() {
    const SwipeoutButtons = [
      {
        text: 'Delete',
        backgroundColor: '#fd5b52',
        onPress: this.rejectRequest.bind(this),
      },
    ];

    return (
      <Swipeout right={SwipeoutButtons} onPress={this.state.goToUserProfile}>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={styles.photo}
                   source={{ uri: this.props.dataSource.profile_picture }}/>
            <View style={styles.userInformation}>
              <Text style={styles.name}>{this.props.dataSource.name}</Text>
              <Text style={styles.fromNow}>1 hour ago</Text>
            </View>
            <TouchableOpacity style={styles.acceptButton} onPress={this.acceptRequest.bind(this)}>
              <Text style={styles.acceptButtonText}>ACCEPT</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.borderContainer}>
            <Text style={styles.message} ellipsizeMode='tail' numberOfLines={2}>
              I really appriciate that if you give some advices of career change…
            </Text>
          </View>
        </View>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  photo: {
    height: 40,
    width: 40,
    margin: 15,
    borderRadius: 20,
  },
  userInformation: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 20,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e3031',
  },
  fromNow: {
    fontSize: 10,
    color: '#a6aeae',
    marginBottom: 17,
  },
  message: {
    fontSize: 12,
    color: '#2e3031',
    marginBottom: 15,
  },
  borderContainer: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#efeff2',
    marginLeft: 70,
  },
  acceptButton: {
    height: 26,
    width: 91,
    borderColor: '#557bfc',
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 15,
  },
  acceptButtonText: {
    color: '#557bfc',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

module.exports = Row;
