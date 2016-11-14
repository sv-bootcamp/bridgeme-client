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
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../../utils/ErrorMeta';
import ExperienceRow from './ExperienceRow';
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
    if (result) {
      let sectionIDs = ['Education', 'Experience'];

      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }),
        dataBlob: {},
      });

      this.state.dataBlob[sectionIDs[0]] = result.education.slice().reverse();
      this.state.dataBlob[sectionIDs[1]] = result.work.slice();

      this.setState({
        id: result._id,
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.state.dataBlob, sectionIDs),
        loaded: true,
      });
    }

    if (error) {
      alert(JSON.stringify(error));
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
        size="large"
      />
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionName}>{sectionID}</Text>
      </View>
    );
  }

  renderRow(rowData) {
    return <ExperienceRow dataSource={rowData}/>;
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
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionName: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e3031',
  },
});

module.exports = UserCareer;
