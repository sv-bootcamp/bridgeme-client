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
      name: 'Silicon Valley Bootcamp',
      position: 'Software Engineer',
      period: '-',
    };
  }

  componentDidMount() {
    let name = this.state.name;
    let position = this.state.position;

    if (this.props.category === 'work') {
      name = this.props.dataSource.employer.name;
      if (this.props.dataSource.position)
        position = this.props.dataSource.position.name;
    } else if (this.props.category === 'education') {
      name = this.props.dataSource.school.name;

      if (this.props.dataSource.concentration.length > 0) {
        position = this.props.dataSource.concentration[0].name;
      }
    }

    this.setState({
      name: name,
      position: position,
    });
  }

  render() {
    return (
      <View>
        <Text>{this.state.name}</Text>
        <Text>{this.state.position}</Text>
      </View>
    );
  }
}

module.exports = ExperienceRow;
