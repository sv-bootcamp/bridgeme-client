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
      name: this.props.name,
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
    let _onChangeNameText = (text) => { this.state.name = text; };
    let startDate = this.state.start;
    let endDate = this.state.end;

    if (endDate == 'present') {
      let now = new Date();
      endDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    }

    return (
      <View style={[styles.formEditView, { borderBottomColor: '#a6aeae' }]}>
        <View>
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.name}
                     underlineColorAndroid="#efeff2"
                     onEndEditing={() => this.toggleEdit()}
                     onChangeText={_onChangeNameText} />
        </View>
        <View style={styles.flexR}>
          <DatePicker
            date={startDate}
            showIcon={false}
            customStyles={{
              dateInput: styles.formEditDate,
            }} />
          <DatePicker
            date={endDate}
            showIcon={false}
            customStyles={{
              dateInput: styles.formEditDate,
            }} />
        </View>
      </View>
    );
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
                {this.state.name}
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
