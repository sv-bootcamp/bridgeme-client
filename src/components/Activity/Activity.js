import React, { Component } from 'react';
import {
  ActivityIndicator,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Row from './Row';
import MatchUtil from '../../utils/MatchUtil';

class Activity extends Component {
  constructor(props) {
    super(props);

    this.state = {
        dataBlob: {},
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }),
        loaded: false,
        isRefreshing: false,
      };
  }

  // Refresh data
  onRefresh() {
    this.setState({ isRefreshing: true });
    MatchUtil.getActivityList(this.onRequestCallback.bind(this));
  }

  onRequestCallback(result, error) {
    if (result) {
      this.onRequestSuccess(result);
    }

    if (error) {
      alert(JSON.stringify(error));
    }
  }

  onRequestSuccess(result) {
    let sectionIDs = ['Request Sent', 'Connected', 'Request Received'];
    let sectionIndex = 0;
    const REQUESTED_PENDING = 2;
    const REQUESTED_ACCEPT = 1;

    for (let j = 0; j < sectionIDs.length; j++)
      this.state.dataBlob[sectionIDs[j]] = [];

    for (let prop in result) {

      // Skip 'rejected' case since we won't expose it to user
      if (prop === 'rejected') {
        continue;
      }

      for (let i = 0; i < result[prop].length; i++) {
        result[prop][i].detail[0].id = result[prop][i]._id;
        result[prop][i].detail[0].status = result[prop][i].status;
        result[prop][i].detail[0].type = prop;

        if (prop === 'requested') {
          if (result[prop][i].status === REQUESTED_ACCEPT) {
            result[prop][i].detail[0].type = 'accepted';
            this.state.dataBlob[sectionIDs[1]].push(result[prop][i].detail[0]);
          } else if (result[prop][i].status === REQUESTED_PENDING) {
            this.state.dataBlob[sectionIDs[sectionIndex]].push(result[prop][i].detail[0]);
          }
        } else {
          this.state.dataBlob[sectionIDs[sectionIndex]].push(result[prop][i].detail[0]);
        }
      }

      sectionIndex++;
    }

    let map = new Map();
    let connectedArray = this.state.dataBlob[sectionIDs[1]];

    for (i = 0; i < connectedArray.length; i++) {
      if (map.has(connectedArray[i]._id)) {
        connectedArray.splice(i--, 1);
      } else {
        map.set(connectedArray[i]._id, true);
      }
    }

    // Refresh dataSource
    this.setState({
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    });

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this.state.dataBlob, sectionIDs),
      loaded: true,
      isRefreshing: false,
    });
  }

  componentDidMount() {
    MatchUtil.getActivityList(this.onRequestCallback.bind(this));
  }

  renderRow(rowData) {
    return <Row dataSource={rowData} onSelect={this.onRequestSuccess.bind(this)}/>;
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={styles.text}>{sectionID}</Text>
      </View>
    );
  }

  renderLoadingView() {
    return (
        <View style={styles.header}>
            <View style={styles.container}>
                <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, { height: 80 }]}
                    size="large"
                />
            </View>
            <Text style={styles.loadingText}>Loading</Text>
        </View>
    );
  }

  renderListView() {
    return (
      <ListView
        style={styles.listView}
        dataSource = {this.state.dataSource}
        renderRow  = {this.renderRow.bind(this)}
        enableEmptySections={true}
        renderSectionHeader = {this.renderSectionHeader}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh.bind(this)}
            tintColor="#1ecfe2"
            title="Loading..."
            titleColor="#0e417a"
            style={{ backgroundColor: 'transparent' }}
          />
        }
      />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderListView();
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  listView: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 5,
  },
  text: {
    color: '#546979',
    paddingHorizontal: 8,
    fontSize: 12,
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 55,
  },
  loadingText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
});

module.exports = Activity;
