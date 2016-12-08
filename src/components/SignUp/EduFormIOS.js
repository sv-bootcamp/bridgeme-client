import React, { Component } from 'react';
import {
  Image,
  Modal,
  Picker,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './Styles';

const Item = Picker.Item;

class EduFormIOS extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      modalVisible: false,
      name: this.props.name,
      startYear: this.props.startYear,
      endYear: this.props.endYear,
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
    let onChangeName = (text) => this.onChangeName(text);
    let onChangeSubject = (text) => this.onChangeSubject(text);
    let onChangeStartYear = (year) => this.onChangeStartYear(year);
    let onChangeEndYear = (year) => this.onChangeEndYear(year);
    let toggleEdit = () => this.toggleEdit();

    let setModalVisible = () => {
      this.setModalVisible(!this.state.modalVisible);
    };

    return (
      <View style={styles.formEditView}>
        <View style={styles.formEditBottomLine}>
          <TextInput style={[styles.formName, styles.formEditName]}
            defaultValue={this.state.name}
            placeholder="Name"
            placeholderTextColor="#a6aeae"
            onChangeText={onChangeName} />
        </View>
        <View style={styles.formEditBottomLine}>
          <TextInput style={[styles.formName, styles.formEditName]}
            defaultValue={this.state.subject}
            placeholder="Subject"
            placeholderTextColor="#a6aeae"
            onChangeText={onChangeSubject} />
        </View>
        <View style={styles.flexR}>
          <TouchableOpacity onPress={setModalVisible}>
            <Text style={styles.formDate}>{this.state.startYear}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.formDate}>{' - '}</Text>
          </View>
          <TouchableOpacity onPress={setModalVisible}>
            <Text style={styles.formDate}>{this.state.endYear}</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={toggleEdit}>
            <View style={{ flex: 1 }}></View>
          </TouchableWithoutFeedback>
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert('Modal has been closed.');}}
          >
            <View style={{ flex: 1, }}></View>
            <View style={styles.doneWrapper}>
              <TouchableOpacity onPress={setModalVisible}>
                <Text style={{ fontSize: 16, color: '#44acff' }}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContainer}>
              <Picker
                style={styles.formEditYear}
                selectedValue={this.state.startYear}
                onValueChange={onChangeStartYear}>
                {PickerItems}
              </Picker>
              <View style={{ marginRight: 10 }}><Text>{'-'}</Text></View>
              <Picker
                style={styles.formEditYear}
                selectedValue={this.state.endYear}
                onValueChange={onChangeEndYear}>
                {PickerItems}
              </Picker>
            </View>
          </Modal>
        </View>
      </View>
    );
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  // Get picker items(year for education)
  getPickerItems() {
    let yearList = [];
    let now = new Date();
    for (let i = 1980; i <= now.getFullYear(); i++) {
      yearList.push(i + '');
    }

    yearList.reverse();
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

  onChangeStartYear(year) {
    this.props.onChangeText('startYear', 'name', this.props.id, year);
    this.setState({ startYear: year });
  }

  onChangeEndYear(year) {
    this.props.onChangeText('endYear', 'name', this.props.id, year);
    this.setState({ endYear: year });
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
              <TouchableOpacity onPress={() => this.toggleEdit()}>
                <Image style={styles.editBtn}
                       source={require('../../resources/icon-detail-edit.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formNameContainer}>
            <Text style={styles.formName}>{this.state.subject}</Text>
          </View>
          <View style={styles.flexR}>
            <Text style={styles.formDate}>{this.state.startYear}</Text>
            <View>
              <Text style={styles.formDate}>{' - '}</Text>
            </View>
            <Text style={styles.formDate}>{this.state.endYear}</Text>
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
    this.setState(
      {
        editMode: !this.state.editMode,
      }
    );
  }

}

module.exports = EduFormIOS;
