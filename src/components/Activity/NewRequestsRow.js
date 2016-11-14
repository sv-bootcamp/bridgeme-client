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

class NewRequestsRow extends Component {
  constructor(props) {
    super(props);

    // TODO: The message part is mock data that will be changed
    this.state = {
      goToUserProfile: () => Actions.userProfile({ _id: this.props.dataSource._id }),
      expanded: false,
      message: `I really appriciate that if you give some advices of career change…
      I really appriciate that if you give some advices of career change
I really appriciate that if you give some advices of career change
I really appriciate that if you give some advices of career change
I really appriciate that if you give some advices of career change
I really appriciate that if you give some advices of career change
I really appriciate that if you give some advices of career This is the end`,
      height: 70,
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
          <View style={[styles.borderContainer]}>
            <View>
              <Text style={[styles.message]}
                    ellipsizeMode={'tail'}
                    numberOfLines={this.state.expanded ? 0 : 2}>
                {this.state.message}
              </Text>
            </View>
            <View>
              <Text style={{ color: '#a6aeae', fontSize: 10,}}
                onPress={()=> {
                  this.setState({                     expanded: !this.state.expanded, });
                }}>
                {this.state.expanded ? 'Read less' : 'Read more'}
              </Text>
            </View>
          </View>
        </View>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  row: {
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
    flexDirection: 'column',
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

module.exports = NewRequestsRow;
