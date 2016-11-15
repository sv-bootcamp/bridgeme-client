import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import MatchUtil from '../../utils/MatchUtil';
import Swipeout from './Swipeout';
import moment from 'moment';

class NewRequestsRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goToUserProfile: () => Actions.userProfile({ _id: this.props.dataSource._id }),
      expanded: false,
    };
  }

  onGetActivityCallback(result, error) {
    if (error) {
      alert(JSON.stringify(error));
    } else if (result) {
      this.props.onSelect(result);
    }
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(JSON.stringify(error));
    } else if (result) {
      MatchUtil.getActivityList(this.onGetActivityCallback.bind(this));
    }
  }

  acceptRequest() {
    MatchUtil.acceptRequest(this.onRequestCallback.bind(this), this.props.dataSource.id);
    Actions.evalPageMain({ select: 'mentor' });
  }

  rejectRequest() {
    MatchUtil.rejectRequest(this.onRequestCallback.bind(this), this.props.dataSource.id);
  }

  render() {
    const SwipeoutButtons = [
      {
        text: 'Delete',
        backgroundColor: '#fd5b52',
        onPress: this.rejectRequest.bind(this),
      },
    ];

    let message = null;
    let expand = null;

    if (this.props.dataSource.contents) {
      message = (
            <View>
              <Text style={[styles.message]}
                    ellipsizeMode={'tail'}
                    numberOfLines={this.state.expanded ? 0 : 2}>
                {this.props.dataSource.contents}
              </Text>
            </View>);

      if (this.props.dataSource.contents.length > 80) {
        expand = (
          <View>
            <Text style={styles.expandText}
                  onPress={()=> {
                    this.setState({ expanded: !this.state.expanded });
                  }}>

              {this.state.expanded ? 'Read less' : 'Read more'}
            </Text>
          </View>
        );
      }
    }

    return (
      <View>
        <Swipeout right={SwipeoutButtons} onPress={this.state.goToUserProfile}>
          <View style={styles.row}>
            <View style={styles.userInformation}>
              <Image style={styles.photo}
                     source={{ uri: this.props.dataSource.profile_picture }}/>
              <View style={styles.horizontalSpaceBetween}>
                <View style={styles.userNameWithTime}>
                  <Text style={styles.name}>{this.props.dataSource.name}</Text>
                  <Text style={styles.fromNow}>
                    {moment(this.props.dataSource.request_date).fromNow()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={this.acceptRequest.bind(this)}>
                  <Text style={styles.acceptButtonText}>ACCEPT</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={styles.borderContainer}>
                {message}
                {expand}
              </View>
            </View>

          </View>
        </Swipeout>
      </View>
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
    flexDirection: 'row',
  },
  userNameWithTime: {
    width: 200,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 20,
  },
  horizontalSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    width: 150,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e3031',
    marginRight: 80,
  },
  fromNow: {
    fontSize: 10,
    color: '#a6aeae',
    marginBottom: 17,
  },
  expandText: {
    color: '#a6aeae',
    fontSize: 10,
    marginBottom: 15,
  },
  message: {
    fontSize: 12,
    color: '#2e3031',
    marginBottom: 15,
    marginRight: 35,
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
