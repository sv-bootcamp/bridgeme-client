import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  Image,
  ListView,
  ScrollView,
} from 'react-native';
import Row from './Row';
import ServerUtil from '../../utils/ServerUtil';

class Activity extends Component {
  constructor(props) {
    super(props);

    ServerUtil.initCallback(this.onRequestSuccess, this.onRequestFail);
  }

  getInitialStates() {
    return {
        dataBlob: {},
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }),
        loaded: false,
      };
  }

  onRequestSuccess(result) {
    console.log(result);
  }

  onRequestFail(error) {
    console.log(error);
  }

  componentWillMount() {
    this.setState(this.getInitialStates);
  }

  componentDidMount() {
    this.setState({

      // TODO: Replace with server data
      dataSource : this.state.dataSource.cloneWithRowsAndSections({ s1: [1,2,3,4], s2: [3,4] }, ['s1', 's2']),
      loaded: true,
    });

    ServerUtil.getActivityList();
  }

  renderRow(rowData) {
    return <Row />;
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={styles.text}>{sectionID}</Text>
      </View>
    );
  }

  render() {
    return (
      <ListView
        style = {{ marginTop: 50 }}
        dataSource = {this.state.dataSource}
        renderRow  = {this.renderRow}
        renderSectionHeader = {this.renderSectionHeader}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  sectionHeader: {
    height: 15,
    margin: 10,
    color: '#546979',
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#2196F3',
  },
  text: {
    color: 'white',
    paddingHorizontal: 8,
    fontSize: 16,
  },
});

module.exports = Activity;
