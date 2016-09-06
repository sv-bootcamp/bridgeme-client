import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
} from 'react-native';

import ExperienceRow from './ExperienceRow';

class ExperienceList extends Component {
  componentDidMount() {
    this._refreshData();
  }

  _renderRow(rowData) {
    return <ExperienceRow />;
  }

  // Refresh listview.
  _refreshData() {

    // TODO: Get experience list via fetch API
    // fetch(ENDPOINT)
    //   .then((response) => response.json())
    //   .then((rjson) => {
    //     this.setState({
    //       dataSource:
    // this.state.dataSource.cloneWithRows(rjson.results),
    //     });
    //   });
  }

  render() {
    return (
      <ListView
        dataSource={this.props.dataSource}
        renderRow={this._renderRow}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  tab: {
    flex: 1,
  },
});

module.exports = ExperienceList;
