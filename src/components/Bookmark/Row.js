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
import { dimensions } from '../Shared/Dimensions';
import Text from '../Shared/UniText';

class Row extends Component {
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
      image = { uri: this.props.dataSource.profile_picture_small ?
        this.props.dataSource.profile_picture_small : this.props.dataSource.profile_picture };
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
    } else {
      return null;
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: dimensions.heightWeight * 75,
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderColor: '#f0f0f2',
  },
  name: {
    fontSize: dimensions.fontWeight * 14,
    fontWeight: 'bold',
    color: '#2e3031',
    marginBottom: dimensions.heightWeight * 5,
  },
  currentStatus: {
    fontSize: dimensions.fontWeight * 12,
    color: '#a6aeae',
  },
});

module.exports = Row;
