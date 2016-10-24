import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import styles from './Styles';

class WorkForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      employer: this.props.employer,
      position: this.props.position,
      start: this.props.start,
      end: this.props.end,
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
    let _onChangeName = (text) => this.onChangeName(text);
    let _onChangePosition = (text) => this.onChangePosition(text);
    let _onStartDateChange = (date) => this.onStartDateChange(date);
    let _onEndDateChange = (date) => this.onEndDateChange(date);

    let startDate = this.state.start;
    let endDate = this.getEndDate(this.state.end);

    return (
      <View style={[styles.formEditView, { borderBottomColor: '#a6aeae' }]}>
        <View>
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.position}
                     underlineColorAndroid="#efeff2"
                     onEndEditing={() => this.toggleEdit()}
                     onChangeText={_onChangePosition} />
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.employer}
                     underlineColorAndroid="#efeff2"
                     onEndEditing={() => this.toggleEdit()}
                     onChangeText={_onChangeName} />
        </View>
        <View style={styles.flexR}>
          <DatePicker
            date={startDate}
            showIcon={false}
            customStyles={{ dateInput: styles.formEditDate, }}
            onDateChange={_onStartDateChange} />
          <DatePicker
            date={endDate}
            showIcon={false}
            customStyles={{ dateInput: styles.formEditDate, }}
            onDateChange={_onEndDateChange} />
        </View>
      </View>
    );
  }

  getEndDate(endDate) {
    if (endDate == 'present') {
      let now = new Date();
      return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    } else {
      return endDate;
    }
  }

  onChangeName(text) {
    this.state.employer = text;
    this.props.onChangeText('employer', 'name', this.props.id, text);
  }

  onChangePosition(text) {
    this.state.position = text;
    this.props.onChangeText('position', 'name', this.props.id, text);
  }

  onStartDateChange(date) {
    this.state.start = date;
    this.props.onChangeText('start_date', null, this.props.id, date);
    this.setState({ start: date });
  }

  onEndDateChange(date) {
    this.state.end = date;
    this.props.onChangeText('end_date', null, this.props.id, date);
    this.setState({ end: date });
  }

  renderView() {
    return (
      <ScrollView
        style={styles.flexR}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.formView}>
          <View style={styles.flexR}>
            <View style={styles.editL}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.formName}>
                {this.state.position}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.formName}>
                {this.state.employer}
              </Text>
            </View>
            <View style={styles.editR}>
              <TouchableWithoutFeedback onPress={() => this.toggleEdit()}>
                <Image style={styles.editBtn}
                       source={require('../../resources/icon-detail-edit.png')} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View>
            <Text style={styles.formDate}>{this.state.start + ' - ' + this.state.end}</Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={() => this.props.onDelete(this.props.id)}>
          <View style={styles.deleteView}>
            <Text style={styles.deleteText}>Delete</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }

  toggleEdit() {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

}

module.exports = WorkForm;
