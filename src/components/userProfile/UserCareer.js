import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  ListView,
  StyleSheet,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import CareerRow from './CareerRow';
import Text from '../Shared/UniText';

class UserCareer extends Component {
  constructor(props) {
    super(props);

    this.changeState();
  }

  changeState() {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    const dataBlob = {
      Education: this.props.education.slice().reverse(),
      Experience: this.props.experience.slice(),
    };

    const sectionIDs = ['Education', 'Experience'];

    this.state = {
      dataBlob,
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs),
    };
  }

  renderSectionHeader(sectionData, sectionID) {
    if (sectionID === 'Education') {
      return (
        <View style={styles.educationSection}>
          <Text style={styles.sectionName}>{sectionID}</Text>
        </View>
      );
    }

    return (
      <View style={styles.experienceSection}>
        <Text style={styles.sectionName}>{sectionID}</Text>
      </View>
    );
  }

  renderRow(rowData, sectionID) {
    return <CareerRow dataSource={rowData} sectionID={sectionID} />;
  }

  render() {
    return (
      <ListView
        style={styles.lisview}
        showsVerticalScrollIndicator={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        enableEmptySections
        renderSectionHeader={this.renderSectionHeader}
        scrollEnabled={false}
      />
    );
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
  educationSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: dimensions.heightWeight * 10,
  },
  experienceSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: dimensions.heightWeight * 20,
    marginBottom: dimensions.heightWeight * 10,
  },
  sectionName: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    marginBottom: dimensions.heightWeight * 10,
    color: '#a6aeae',
  },
});

module.exports = UserCareer;
