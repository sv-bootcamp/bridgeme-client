import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import OverviewRow from './OverviewRow';
import UserUtil from '../../utils/UserUtil';

class UserOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      about: 'No data',
      experts: [],
      personality: [],
      score: [],
      loaded: false,
    };
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(JSON.stringify(error));
    } else if (result) {
      let sectionIDs = ['About', 'I am expertised in', 'Personality'];

      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }),
        dataBlob: {},
      });

      // TODO: change with real data
      this.state.dataBlob[sectionIDs[0]] = '1';
      this.state.dataBlob[sectionIDs[1]] = '2';
      this.state.dataBlob[sectionIDs[2]] = '3';

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

  // Receive props befofe completely changed
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

  renderAbout() {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>About</Text>
        <Text>{this.state.about}</Text>
      </View>
    );
  }

  renderMyExpertise() {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>My expertise</Text>
      </View>
    );
  }

  renderPersonality() {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>Personality</Text>
        <Text>{this.state.personality}</Text>
      </View>
    );
  }

  // Render User profile
  renderOverview() {
    return (
      <View>
        {this.renderAbout()}
        {this.renderMyExpertise()}
        {this.renderPersonality()}
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderOverview();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: 20,
    marginLeft: 30,
  },
  sectionName: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 12,
    color: '#a6aeae',
  },
});

module.exports = UserOverview;
