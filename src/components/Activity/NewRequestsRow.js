import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import MatchUtil from '../../utils/MatchUtil';
import Swipeout from './Swipeout';
import Text from '../Shared/UniText';
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
      alert(error);
    } else if (result) {
      this.props.onSelect(result);
    }
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      MatchUtil.getActivityList(this.onGetActivityCallback.bind(this));
    }
  }

  acceptRequest() {
    if (this.props.dataSource.close) {
      MatchUtil.acceptRequest(this.onRequestCallback.bind(this), this.props.dataSource._id);
    } else {

      // Call this method with no parameter will close all swipe button
      this.props.closeAllExceptCurrent();
    }
  }

  rejectRequest() {
    MatchUtil.rejectRequest(this.onRequestCallback.bind(this), this.props.dataSource._id);
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
        <Swipeout
          right={SwipeoutButtons}
          close={this.props.dataSource.close}
          scroll={event => this.props.allowScroll(event)}
          onPress={this.state.goToUserProfile}
          onOpen={() => this.props.closeAllExceptCurrent(this.props.dataSource._id)}
        >
          <View style={styles.row}>
            <View style={styles.userInformation}>
              <Image style={styles.photo}
                source={{ uri: this.props.dataSource.profile_picture_small ?
                  this.props.dataSource.profile_picture_small
                : this.props.dataSource.profile_picture, }}/>
              <View style={styles.horizontalSpaceBetween}>
                <View style={styles.userNameWithTime}>
                  <Text ellipsizeMode={'tail'} numberOfLines = {1} style={styles.name}>
                    {this.props.dataSource.name}
                  </Text>
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

const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  photo: {
    height: dimensions.fontWeight * 40,
    width: dimensions.fontWeight * 40,
    marginBottom: dimensions.heightWeight * 15,
    marginLeft: dimensions.widthWeight * 15,
    marginRight: dimensions.widthWeight * 15,
    marginTop: dimensions.heightWeight * 20,
    borderRadius: dimensions.fontWeight * 20,
  },
  userInformation: {
    flex: 1,
    flexDirection: 'row',
  },
  userNameWithTime: {
    width: WIDTH - 180,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: dimensions.heightWeight * 20,
    paddingRight: dimensions.widthWeight * 20,
  },
  horizontalSpaceBetween: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: dimensions.fontWeight * 14,
    fontWeight: 'bold',
    color: '#2e3031',
  },
  fromNow: {
    fontSize: dimensions.fontWeight * 12,
    color: '#a6aeae',
    marginTop: dimensions.heightWeight * 5,
    marginBottom: dimensions.heightWeight * 20,
  },
  expandText: {
    color: '#a6aeae',
    fontSize: dimensions.fontWeight * 10,
    marginBottom: dimensions.heightWeight * 15,
  },
  message: {
    fontSize: dimensions.fontWeight * 12,
    color: '#2e3031',
    marginBottom: dimensions.heightWeight * 15,
    marginRight: dimensions.widthWeight * 35,
  },
  borderContainer: {
    flexDirection: 'column',
    marginLeft: dimensions.widthWeight * 70,
  },
  acceptButton: {
    height: dimensions.heightWeight * 26,
    width: dimensions.widthWeight * 91,
    borderColor: '#44acff',
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: dimensions.widthWeight * 15,
  },
  acceptButtonText: {
    color: '#44acff',
    textAlign: 'center',
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
  },
});

module.exports = NewRequestsRow;
