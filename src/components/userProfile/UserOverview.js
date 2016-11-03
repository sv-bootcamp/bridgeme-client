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
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';
import OverviewRow from './OverviewRow';

class UserOverview extends Component {
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

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));
  }

  onRequestSuccess(result) {
    let sectionIDs = ['About', 'I can help you with', 'Personality'];

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

  onRequestFail(error) {
    if (error.code != ErrorMeta.ERR_NONE) {
      Alert.alert(error.msg);
    }
  }

  componentDidMount() {
    ServerUtil.getOthersProfile(this.props.id);
  }

  // Receive props befofe completely changed
  componentWillReceiveProps(props) {
    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));

    ServerUtil.getOthersProfile(props.id);
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
    return <OverviewRow dataSource={rowData}/>;
  }

  // Render User profile
  renderOverview() {
    return (
      <ListView
        style={styles.lisview}
        showsVerticalScrollIndicator={false}
        dataSource={this.state.dataSource}
        scrollEnabled={false}
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

    return this.renderOverview();
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2e3031',
  },
});

module.exports = UserOverview;
