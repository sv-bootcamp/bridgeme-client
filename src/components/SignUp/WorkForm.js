import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import styles from './Styles';
import Text from '../Shared/UniText';

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
    let onChangePosition = (text) => this.onChangePosition(text);
    let onChangeName = (text) => this.onChangeName(text);
    let onStartDateChange = (date) => this.onStartDateChange(date);
    let onEndDateChange = (date) => this.onEndDateChange(date);

    let startDate = this.state.start;
    let endDate = this.getEndDate(this.state.end);

    return (
      <View style={styles.formEditView}>
        <View>
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.position}
                     underlineColorAndroid="#a6aeae"
                     placeholder="Position" placeholderTextColor="#a6aeae"
                     onChangeText={onChangePosition} />
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.employer}
                     underlineColorAndroid="#a6aeae"
                     placeholder="Name" placeholderTextColor="#a6aeae"
                     onChangeText={onChangeName} />
        </View>
        <View style={styles.flexR}>
          <DatePicker
            style={{ width: 100 }}
            date={startDate}
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{ dateInput: styles.formEditDate, }}
            onDateChange={onStartDateChange} />
          <View style={{ marginTop: 10, marginRight: 25 }}><Text>{' - '}</Text></View>
          <DatePicker
            style={{ width: 100 }}
            date={endDate}
            showIcon={false}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{ dateInput: styles.formEditDate, }}
            onDateChange={onEndDateChange} />
          <TouchableWithoutFeedback onPress={() => this.toggleEdit()}>
            <View style={{ flex: 1 }}>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  getEndDate(endDate) {
    if (endDate == 'present' || endDate === '') {
      let now = new Date();
      return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    } else {
      return endDate;
    }
  }

  onChangePosition(text) {
    this.state.position = text;
    this.props.onChangeText('position', 'name', this.props.id, text);
  }

  onChangeName(text) {
    this.state.employer = text;
    this.props.onChangeText('employer', 'name', this.props.id, text);
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
