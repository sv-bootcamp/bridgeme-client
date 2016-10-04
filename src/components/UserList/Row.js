import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Row extends Component {

  constructor(props) {
    super(props);

    this.state = {
      profileImage: '',
      name: '',
      job: '',
      education: '',
    };
  }

  componentWillMount() {
    this.setState({
      profileImage: this.getProfileImage(),
      name: this.getName(),
      job: this.getJob(),
      education: this.getEducation(),
    });
  }

  getProfileImage() {
    if (this.props.dataSource.profile_picture) {
      return this.props.dataSource.profile_picture;
    } else {
      return '../../resources/btn_connect_2x.png';
    }
  }

  getName() {
    if (this.props.dataSource.name) {
      return this.props.dataSource.name;
    } else {
      return this.state.name;
    }
  }

  getJob() {
    if (this.props.dataSource.work.length > 0) {
      return this.props.dataSource.work[0].employer.name;
    } else {
      return this.state.job;
    }
  }

  getEducation() {
    if (this.props.dataSource.education.length > 0) {
      let lastIndex = this.props.dataSource.education.length - 1;
      return this.props.dataSource.education[lastIndex].school.name;
    } else {
      return this.state.education;
    }
  }

  render() {
    let profileId = { _id: this.props.dataSource._id };
    const goToUserProfile = () => Actions.userProfile(profileId);

    return (
      <TouchableWithoutFeedback onPress={goToUserProfile}>
        <View style={styles.row}>
            <Image style={styles.photo}
                   source={{ uri: this.state.profileImage }}/>
            <View style={styles.imageSeperator}></View>
            <View style={styles.userInformation}>
              <Text style={styles.name}>{this.state.name}</Text>
              <Text style={styles.job}>{this.state.job}</Text>
              <Text style={styles.education}>{this.state.education}</Text>
            </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

const styles = StyleSheet.create({
  row: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#f7f7f9',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
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
    flex: 7,
    marginLeft: 28,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  name: {
    fontFamily: 'open_sans',
    fontSize: 17,
    fontWeight: 'bold',
  },
  job: {
    fontFamily: 'open_sans',
    fontSize: 13,
    marginTop: 5,
  },
  education: {
    fontFamily: 'open_sans',
    fontSize: 13,
    marginTop: 5,
  },
});

module.exports = Row;
