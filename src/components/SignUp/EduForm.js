import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Text,
  Image,
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
      name: this.props.name,
      year: this.props.year + '',
      subject: this.props.subject,
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
    let PickerItems = this.getPickerItems();
    let _onChangeName = (text) => this.onChangeName(text);
    let _onChangeSubject = (text) => this.onChangeSubject(text);
    let _onValueChange = (year) => this.onChangeYear(year);

    return (
      <View style={[styles.formEditView, { borderBottomColor: '#a6aeae' }]}>
        <View>
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.name}
                     underlineColorAndroid="#a6aeae"
                     onEndEditing={() => this.toggleEdit()}
                     onChangeText={_onChangeName} />
        </View>
        <View>
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.subject}
                     underlineColorAndroid="#a6aeae"
                     onEndEditing={() => this.toggleEdit()}
                     onChangeText={_onChangeSubject} />
        </View>
        <View>
          <Picker
            style={styles.formEditYear}
            selectedValue={this.state.year}
            onValueChange={_onValueChange}>
            {PickerItems}
          </Picker>
        </View>
      </View>
    );
  }

  getPickerItems() {
    let yearList = [];
    for (let i = 2000; i < 2017; i++) {
      yearList.push(i + '');
    }

    return yearList.map(
      (year, idx) => <Item key={idx} label={year} value={year} style={styles.formDate} />
    );
  }

  onChangeName(text) {
    this.state.name = text;
    this.props.onChangeText('school', 'name', this.props.id, text);
  }

  onChangeSubject(text) {
    this.state.subject = text;
    this.props.onChangeText('concentration', 'name', this.props.id, text);
  }

  onChangeYear(_year) {
    this.props.onChangeText('year', 'name', this.props.id, _year);
    this.setState({
      year: _year,
      editMode: !this.state.editMode,
    });
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
              <Text style={styles.formName}>{this.state.name}</Text>
            </View>
            <View style={styles.editR}>
              <TouchableWithoutFeedback onPress={() => this.toggleEdit()}>
                <Image style={styles.editBtn}
                       source={require('../../resources/icon-detail-edit.png')} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.formNameContainer}>
            <Text style={styles.formName}>{this.state.subject}</Text>
          </View>
          <View><Text style={styles.formDate}>{this.state.year}</Text></View>
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

module.exports = EduForm;
