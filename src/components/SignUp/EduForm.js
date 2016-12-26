import React, { Component } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import ModalPicker from 'react-native-modal-picker';
import styles from './Styles';
import Text from '../Shared/UniText';

class EduForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      name: this.props.name,
      subject: this.props.subject,
      startDate: this.getYearMonth(this.props.start),
      endDate: this.getYearMonth(this.props.end),
    };
  }

  getYearMonth(data) {
    if (!data) {
      return { year: '0000', month: '00' };
    }

    let result = {
      year: '',
      month: '',
    };

    if (!data) {
      return result;
    }

    const dateInfo = data.split('-');
    result.year = dateInfo[0] || '0000';
    result.month = dateInfo[1] || '00';
    return result;
  }

  onChangeName(text) {
    this.state.name = text;
    this.props.onChangeText('school', 'name', this.props.id, text);
  }

  onChangeSubject(text) {
    this.state.subject = text;
    this.props.onChangeText('concentration', 'name', this.props.id, text);
  }

  // TODO: This function is necessary for editing degree later.
  onChangeDegree() {

  }

  onChangeStartYear(data) {
    const year = data.label;
    const date = year + '-' + this.state.startDate.month;
    this.props.onChangeText('start_date', '', this.props.id, year);
    this.setState({
      startDate: {
        year,
        month: this.state.startDate.month,
      },
    });
  }

  onChangeStartMonth(data) {
    const month = data.label;
    const monthStr = month.length === 1 ? '0' + month : month;
    const date = this.state.startDate.year + '-' + monthStr;
    this.props.onChangeText('start_date', '', this.props.id, date);
    this.state.startDate.month = monthStr;
    this.setState({
      startDate: {
        year: this.state.startDate.year,
        month,
      },
    });
  }

  onChangeEndYear(data) {
    const year = data.label;
    const date = year + '-' + this.state.endDate.month;
    this.props.onChangeText('end_date', '', this.props.id, year);
    this.setState({
      endDate: {
        year,
        month: this.state.endDate.month,
      },
    });
  }

  onChangeEndMonth(data) {
    const month = data.label;
    const monthStr = month.length === 1 ? '0' + month : month;
    const date = this.state.endDate.year + '-' + monthStr;
    this.props.onChangeText('end_date', '', this.props.id, date);
    this.state.endDate.month = monthStr;
    this.setState({
      endDate: {
        year: this.state.endDate.year,
        month,
      },
    });
  }

  // Get picker items(year for education)
  getPickerYearItems() {
    const yearItemList = [];
    const now = new Date();
    for (let i = 1950; i <= now.getFullYear(); i += 1) {
      yearItemList.push({ key: i, label: i + '' });
    }

    return yearItemList.reverse();
  }

  getPickerMonthItems() {
    const monthItemList = [];
    for (let i = 1; i <= 12; i += 1) {
      monthItemList.push({ key: i, label: i + '' });
    }

    return monthItemList;
  }

  toggleEdit() {
    this.setState({ editMode: !this.state.editMode });
  }

  renderEdit() {
    const pickerYearItems = this.getPickerYearItems();
    const pickerMonthItems = this.getPickerMonthItems();
    const onChangeName = data => this.onChangeName(data);
    const onChangeSubject = data => this.onChangeSubject(data);
    const onChangeDegree = data => this.onChangeDegree(data);
    const onChangeStartYear = data => this.onChangeStartYear(data);
    const onChangeStartMonth = data => this.onChangeStartMonth(data);
    const onChangeEndYear = data => this.onChangeEndYear(data);
    const onChangeEndMonth = data => this.onChangeEndMonth(data);
    const toggleEdit = () => this.toggleEdit();

    return (
      <Modal
        animationType={'fade'}
        transparent
        visible
        onRequestClose={toggleEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.formEditView}>
            <View style={styles.formEditBottomLine}>
              <TextInput
                style={[styles.formName, styles.formEditName]}
                defaultValue={this.state.name}
                underlineColorAndroid="transparent"
                placeholder="School"
                placeholderTextColor="#ddd"
                onChangeText={onChangeName}
              />
            </View>
            <View style={styles.formEditBottomLine}>
              <TextInput
                style={[styles.formName, styles.formEditName]}
                defaultValue={this.state.subject}
                underlineColorAndroid="transparent"
                placeholder="Subject"
                placeholderTextColor="#ddd"
                onChangeText={onChangeSubject}
              />
            </View>
            <View style={{
              marginTop: dimensions.heightWeight * 10,
              marginBottom: dimensions.heightWeight * 10,
            }}>
              <Text style={{ fontSize: dimensions.fontWeight * 16 }}>From</Text>
            </View>
            <View style={styles.flexR}>
              <ModalPicker
                data={pickerYearItems}
                style={styles.formEditYear}
                onChange={onChangeStartYear}
              >
                <TextInput
                  style={styles.formEditPlaceholder}
                  editable={false}
                  placeholder="Year"
                  value={this.state.startDate.year} />
              </ModalPicker>
              <View style={styles.formEditMid}>
                <Text>/</Text>
              </View>
              <ModalPicker
                data={pickerMonthItems}
                style={styles.formEditYear}
                onChange={onChangeStartMonth}
              >
                <TextInput
                  style={styles.formEditPlaceholder}
                  editable={false}
                  placeholder="Month"
                  value={this.state.startDate.month.replace('0', '')} />
              </ModalPicker>
            </View>
            <View style={{
              marginTop: dimensions.heightWeight * 10,
              marginBottom: dimensions.heightWeight * 10,
            }}>
              <Text style={{ fontSize: dimensions.fontWeight * 16 }}>To</Text>
            </View>
            <View style={styles.flexR}>
              <ModalPicker
                data={pickerYearItems}
                style={styles.formEditYear}
                onChange={onChangeEndYear}
              >
                <TextInput
                  style={styles.formEditPlaceholder}
                  editable={false}
                  placeholder="Year"
                  value={this.state.endDate.year} />
              </ModalPicker>
              <View style={styles.formEditMid}>
                <Text>/</Text>
              </View>
              <ModalPicker
                data={pickerMonthItems}
                style={styles.formEditYear}
                initValue={this.state.endDate.month.replace('0', '')}
                onChange={onChangeEndMonth}
              >
                <TextInput
                  style={styles.formEditPlaceholder}
                  editable={false}
                  placeholder="Month"
                  value={this.state.endDate.month.replace('0', '')} />
              </ModalPicker>
            </View>
            <View style={[styles.flexR, {
              marginTop: dimensions.heightWeight * 30,
              justifyContent: 'flex-end',
            },
            ]}>
              <TouchableOpacity onPress={toggleEdit}>
                <Text style={[styles.doneText, { color: '#BEBEBE' }]}>Close</Text>
              </TouchableOpacity>
              <Text>          </Text>
              <TouchableOpacity onPress={toggleEdit}>
                <Text style={styles.doneText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderView() {
    const startYear = this.state.startDate.year === '0000' ? '' : this.state.startDate.year;
    const startMonth = this.state.startDate.month === '00' ? '' : this.state.startDate.month;
    const startMid = (startYear && startMonth) ? '-' : '';
    const startDate = startYear + startMid + startMonth;

    const endYear = this.state.endDate.year === '0000' ? '' : this.state.endDate.year;
    const endMonth = this.state.endDate.month === '00' ? '' : this.state.endDate.month;
    const endMid = (endYear && endMonth) ? '-' : '';
    let endDate = endYear + endMid + endMonth;
    endDate = endDate || 'present';

    return (
      <ScrollView
        style={styles.flexR}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.formView}>
          <View style={styles.flexR}>
            <View style={styles.editL}>
              <Text style={styles.formName}>{this.state.name}</Text>
            </View>
            <View style={styles.editR}>
              <TouchableOpacity onPress={() => this.toggleEdit()}>
                <Image
                  style={styles.editBtn}
                  source={require('../../resources/icon-detail-edit.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formNameContainer}>
            <Text style={styles.formName}>{this.state.subject}</Text>
          </View>
          <View style={styles.flexR}>
            <Text style={styles.formDate}>
              {startDate}
            </Text>
            <View>
              <Text style={styles.formDate}>{' ~ '}</Text>
            </View>
            <Text style={styles.formDate}>
              {endDate}
            </Text>
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

  render() {
    if (this.state.editMode) {
      return (
        <View>
          { this.renderView() }
          { this.renderEdit() }
        </View>
      );
    }

    return this.renderView();
  }
}

module.exports = EduForm;
