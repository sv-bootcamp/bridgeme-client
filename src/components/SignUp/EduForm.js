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
    let yearList = [];
    for (let i = 2000; i < 2017; i++) {
      yearList.push(i + '');
    }

    let PickerItems = yearList.map(
      (year, idx) => <Item key={idx} label={year} value={year} style={styles.formDate} />
    );

    let _onChangeNameText = (text) => { this.state.name = text; };
    let _onChangeSubjectText = (text) => { this.state.subject = text; };
    let _onValueChange = (_year) => {
      this.setState({
        year: _year,
        editMode: !this.state.editMode,
      });
    };

    return (
      <View style={[styles.formEditView, { borderBottomColor: '#a6aeae' }]}>
        <View>
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.name}
                     underlineColorAndroid="#efeff2"
                     onEndEditing={() => this.toggleEdit()}
                     onChangeText={_onChangeNameText} />
        </View>
        <View>
          <TextInput style={[styles.formName, styles.formEditName]}
                     defaultValue={this.state.subject}
                     underlineColorAndroid="#efeff2"
                     onEndEditing={() => this.toggleEdit()}
                     onChangeText={_onChangeSubjectText} />
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
          <View><Text style={styles.formName}>{this.state.subject}</Text></View>
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
