import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileImage: '../../resources/btn_connect_2x.png',
      name: '',
      job: '',
      education: '',
    };
  }

  componentWillMount() {
    let name = this.state.name;
    let job = this.state.job;
    let education = this.state.education;

    if (this.props.dataSource.profile_picture) {
      profileImage = this.props.dataSource.profile_picture;
    }

    if (this.props.dataSource.name) {
      name = this.props.dataSource.name;
    }

    if (this.props.dataSource.work.length > 0) {
      console.log(this.props.dataSource.work[0].employer.name);
      job = this.props.dataSource.work[0].employer.name;
      console.log(this.props.dataSource.work[0].employer.name);
    }

    if (this.props.dataSource.education.length > 0) {
      let lastIndex = this.props.dataSource.education.length - 1;
      education = this.props.dataSource.education[lastIndex].school.name;
      console.log(this.props.dataSource.education[lastIndex].school.name);
    }

    this.setState({
      profileImage: profileImage,
      name: name,
      job: job,
      education: education,
    });
  }

  render() {
    const goToUserProfile = () => Actions.userProfile({ _id: this.props.dataSource._id });

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
    fontFamily: 'OpenSans',
    fontSize: 17,
    fontWeight: 'bold',
  },
  job: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    marginTop: 5,
  },
  education: {
    fontFamily: 'OpenSans',
    fontSize: 13,
    marginTop: 5,
  },
});

module.exports = Row;
