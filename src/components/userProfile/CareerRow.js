import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import Text from '../Shared/UniText';

class CareerRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schoolName: undefined,
      major: undefined,
      schoolPeriod: undefined,
      companyName: undefined,
      position: undefined,
      companyPeriod: undefined,
      loaded: false,
    };
  }

  componentDidMount() {
    if (this.props.sectionID === 'Experience') {
      this.setState({
        companyName: this.getCompanyName(),
        position: this.getPosition(),
        companyPeriod: this.getPeriod(),
        loaded: true,
      });
    } else if (this.props.sectionID === 'Education') {
      this.setState({
        schoolName: this.getSchoolName(),
        major: this.getMajor(),
        schoolPeriod: this.getPeriod(),
        loaded: true,
      });
    }
  }

  getCompanyName() {
    if (this.props.dataSource.employer) {
      return this.props.dataSource.employer.name;
    }

    return this.state.companyName;
  }

  getPosition() {
    if (this.props.dataSource.position) {
      return this.props.dataSource.position.name;
    }

    return this.state.position;
  }

  getPeriod() {
    let period = '';
    if (this.props.dataSource.start_date) {
      period = this.props.dataSource.start_date;
    }

    if (this.props.dataSource.end_date) {
      period += ' - ' + this.props.dataSource.end_date;
    } else {
      period += ' - present';
    }

    return period;
  }

  getSchoolName() {
    if (this.props.dataSource.school) {
      return this.props.dataSource.school.name;
    }

    return this.state.schoolName;;
  }

  getMajor() {
    if (this.props.dataSource.concentration.length > 0) {
      return this.props.dataSource.concentration[0].name;
    }

    return this.state.major;
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
        {this.state.companyPeriod !== undefined &&
          <Text style ={styles.period}>{this.state.companyPeriod}</Text>
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
        {this.state.schoolPeriod !== undefined &&
          <Text style ={styles.period}>{this.state.schoolPeriod}</Text>
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
    marginTop: dimensions.heightWeight * 10,
    marginBottom: dimensions.heightWeight * 10,
  },
  name: {
    fontSize: dimensions.fontWeight * 14,
    marginBottom: dimensions.heightWeight * 5,
    color: '#2e3031',
  },
  position: {
    fontSize: dimensions.fontWeight * 14,
    color: '#2e3031',
  },
  period: {
    fontSize: dimensions.fontWeight * 12,
    marginTop: dimensions.heightWeight * 5,
    marginBottom: dimensions.heightWeight * 15,
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
    paddingVertical: dimensions.heightWeight * 20,
    paddingHorizontal: dimensions.widthWeight * 20,
  },
});

module.exports = CareerRow;
