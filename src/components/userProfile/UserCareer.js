import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CareerRow from './CareerRow';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';

class UserCareer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      loaded: false,
      dataBlob: {},
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    };

  }

  onRequestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      const sectionIDs = ['Education', 'Experience'];

      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }),
        dataBlob: {},
      });

      this.state.dataBlob[sectionIDs[0]] = result.education.slice().reverse();
      this.state.dataBlob[sectionIDs[1]] = result.experience.slice();

      this.setState({
        id: result._id,
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.state.dataBlob, sectionIDs),
        loaded: true,
      });
    }
  }

  componentDidMount() {
    UserUtil.getOthersProfile(this.onRequestCallback.bind(this), this.props.id);
  }

  // Receive props befofe completly changed
  componentWillReceiveProps(props) {
    UserUtil.getOthersProfile(this.onRequestCallback.bind(this), this.props.id);
  }

  // Render loading page while fetching user profiles
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size='small'
      />
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    if (sectionID === 'Education') {
      return (
        <View style={styles.educationSection}>
          <Text style={styles.sectionName}>{sectionID}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.experienceSection}>
          <Text style={styles.sectionName}>{sectionID}</Text>
        </View>
      );
    }
  }

  renderRow(rowData, sectionID) {
    return <CareerRow dataSource={rowData} sectionID={sectionID}/>;
  }

  // Render User profile
  renderCareer() {
    return (
      <ListView
        style={styles.lisview}
        showsVerticalScrollIndicator={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        enableEmptySections={true}
        renderSectionHeader = {this.renderSectionHeader}
        scrollEnabled={false}
        />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderCareer();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  lisview: {
    marginLeft: WIDTH / 10,
    marginTop: HEIGHT / 30,
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  educationSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 20,
  },
  experienceSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  sectionName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#a6aeae',
  },
});

module.exports = UserCareer;
