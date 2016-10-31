import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class ExperienceRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schoolName: '',
      major: '',
      companyName: '',
      position: '',
      period: '',
      identifier: 0,
      loaded: false,
    };
  }

  componentWillMount() {
    let schoolName = this.state.schoolName;
    let major = this.state.major;
    let companyName = this.state.companyName;
    let position = this.state.period;
    let identifier = this.state.identifier;

    if (this.props.dataSource.employer) {
      companyName = this.props.dataSource.employer.name;
      identifier = 1;
      if (this.props.dataSource.position)
        position = '| ' + this.props.dataSource.position.name;
    } else if (this.props.dataSource.school) {
      schoolName = this.props.dataSource.school.name;
      identifier = 2;
      if (this.props.dataSource.concentration.length > 0) {
        major = this.props.dataSource.concentration[0].name;
      }
    }

    this.setState({
      schoolName: schoolName,
      major: major,
      companyName: companyName,
      position: position,
      period: '2016.01 - present',
      identifier: identifier,
      loaded: true,
    });
  }

  renderEducation() {
    return (
      <View style={styles.container}>
        <Text style ={styles.name}>{this.state.schoolName}</Text>
        <Text style ={styles.name}>{this.state.major}</Text>
        <Text style ={styles.period}>{this.state.period}</Text>
        <View style={styles.seperator}></View>
      </View>
    );
  }

  renderExperience() {
    return (
      <View style={styles.container}>
        <Text style ={styles.name}>{this.state.companyName} {this.state.position}</Text>
        <Text style ={styles.period}>{this.state.period}</Text>
        <View style={styles.seperator}></View>
      </View>
    );
  }

  // Render loading page
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size="large"
        />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else {
      if (this.state.identifier === 1) {
        return this.renderExperience();
      } else if (this.state.identifier === 2) {
        return this.renderEducation();
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2e3031',
  },
  position: {
    fontSize: 14,
    color: '#2e3031',
  },
  period: {
    fontSize: 12,
    marginBottom: 5,
    color: '#a6aeae',
  },
  seperator: {
    alignItems: 'stretch',
    borderWidth: 1,
    height: 2,
    borderColor: '#efeff2',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

module.exports = ExperienceRow;
