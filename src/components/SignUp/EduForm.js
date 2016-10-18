import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  Picker,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import styles from './Styles';

const Item = Picker.Item;

class EduForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      year: this.props.year + '',
    };
  }

  render() {
    if (this.state.editMode) {
      return this.renderEdit();
    } else {
      return this.renderView();
    }
  }

  renderEdit() {
    let yearList = [];
    for (let i = 2000; i < 2017; i++) {
      yearList.push(i + '');
    }

    let PickerItems = yearList.map(
      (year, idx) => <Item key={idx} label={year} value={year} style={styles.eduDate} />
    );

    return (
      <View style={styles.eduView}>
        <View><TextInput style={styles.eduName} defaultValue={this.props.name} /></View>
        <View>
          <Picker
            selectedValue={this.state.year}
            onValueChange={(_year) => this.setState({ year: _year })}>
            {PickerItems}
          </Picker>
        </View>
      </View>
    );
  }

  renderView() {
    return (
      <TouchableWithoutFeedback onPress={() => this.toggleEdit()}>
        <View style={styles.eduView}>
          <View><Text style={styles.eduName}>{this.props.name}</Text></View>
          <View><Text style={styles.eduSubject}>{this.props.subject}</Text></View>
          <View><Text style={styles.eduDate}>{this.props.year}</Text></View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  toggleEdit() {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

}

module.exports = EduForm;
