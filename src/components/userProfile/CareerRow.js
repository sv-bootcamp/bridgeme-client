import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../Shared/UniText';

class CareerRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schoolName: undefined,
      major: undefined,
      graduationYear: undefined,
      companyName: undefined,
      position: undefined,
      period: undefined,
      loaded: false,
    };
  }

  componentDidMount() {
    if (this.props.sectionID === 'Experience') {
      this.setState({
        companyName: this.getCompanyName(),
        position: this.getPosition(),
        period: this.getPeriod(),
        loaded: true,
      });
    } else if (this.props.sectionID === 'Education') {
      this.setState({
        schoolName: this.getSchoolName(),
        major: this.getMajor(),
        graduationYear: this.graduationYear(),
        loaded: true,
      });
    }
  }

  getCompanyName() {
    let companyName = this.state.companyName;

    if (this.props.dataSource.employer) {
      companyName = this.props.dataSource.employer.name;
      return companyName;
    }

    return companyName;
  }

  getPosition() {
    let position = this.state.position;

    if (this.props.dataSource.position) {
      position = this.props.dataSource.position.name;
      return position;
    }

    return position;
  }

  getPeriod() {
    let period = this.state.period;

    if (this.props.dataSource.start_date) {
      period = this.props.dataSource.start_date + ' - ' + this.props.dataSource.end_date;
      return period;
    }

    return period;
  }

  getSchoolName() {
    let schoolName = this.state.schoolName;

    if (this.props.dataSource.school) {
      schoolName = this.props.dataSource.school.name;
      return schoolName;
    }

    return schoolName;
  }

  getMajor() {
    let major = this.state.major;

    if (this.props.dataSource.concentration.length > 0) {
      major = this.props.dataSource.concentration[0].name;
      return major;
    }

    return major;
  }

  graduationYear() {
    let graduationYear = this.state.graduationYear;

    if (this.props.dataSource.year && this.props.dataSource.year.name !== '') {
      graduationYear = 'Class of ' + this.props.dataSource.year.name;
      return graduationYear;
    }

    return graduationYear;
  }

  renderExperience() {
    return (
      <View style={styles.container}>
        {this.state.position !== undefined &&
          <Text style ={styles.name}>{this.state.position}</Text>
        }
        {this.state.companyName !== undefined &&
          <Text style ={styles.name}>{this.state.companyName}</Text>
        }
        {this.state.period !== undefined &&
          <Text style ={styles.period}>{this.state.period}</Text>
        }
        <View style={styles.seperator}></View>
      </View>
    );
  }

  renderEducation() {
    return (
      <View style={styles.container}>
        {this.state.schoolName !== undefined &&
          <Text style ={styles.name}>{this.state.schoolName}</Text>
        }
        {this.state.major !== undefined &&
          <Text style ={styles.name}>{this.state.major}</Text>
        }
        {this.state.graduationYear !== undefined &&
          <Text style ={styles.period}>{this.state.graduationYear}</Text>
        }
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
        size='small'
        />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else {
      if (this.props.sectionID === 'Experience') {
        return this.renderExperience();
      } else if (this.props.sectionID === 'Education') {
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
    marginTop: 5,
    marginBottom: 15,
    color: '#a6aeae',
  },
  seperator: {
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderColor: '#efeff2',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

module.exports = CareerRow;
