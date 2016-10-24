import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  ListView,
  View,
  Image,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import ErrorMeta from '../../utils/ErrorMeta';
import ServerUtil from '../../utils/ServerUtil';
import MyPic from './MyPic';
import EduForm from './EduForm';
import WorkForm from './WorkForm';
import EditForm from './EditForm';

class GeneralInfo extends Component {

  titles = [
    { name: 'Name', isArray: false, },
    { name: 'Email', isArray: false, },
    { name: 'Language', isArray: false, },
    { name: 'Location', isArray: false, },
    { name: 'About', isArray: false, },
    { name: 'Education', isArray: true, },
    { name: 'Experience', isArray: true, },
  ];

  constructor(props) {
    super(props);
    let eduDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let workDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      mypic: '',
      name: '',
      email: '',
      language: '',
      location: '',
      about: '',
      education: [],
      experience: [],
      eduDataSource: eduDS.cloneWithRows([]),
      workDataSource: workDS.cloneWithRows([]),
    };
  }

  render() {
    let Forms = this.getForms();
    let _source = require('../../resources/GeneralInfo_Next_btn.png');

    return (
      <ScrollView style={styles.container}>
        <MyPic uri={this.state.mypic} />
        {Forms}
        <View style={styles.nextView}>
          <Image style={styles.nextImage} source={_source} />
        </View>
      </ScrollView>
    );
  }

  getForms() {
    let forms = this.titles.map(
      (title, idx) => {
        let Title = this.getTitle(title);
        let Input = this.getInput(title);
        return (
          <View style={styles.form} key={idx}>
            {Title}
            {Input}
          </View>
        );
      }
    );

    return forms;
  }

  getTitle(title) {
    if (title.isArray == false) {
      return <Text style={styles.title}>{title.name}</Text>;
    }

    return (
      <View style={styles.flexR}>
        <View style={styles.horiL}>
          <Text style={styles.title}>{title.name}</Text>
        </View>
        <TouchableWithoutFeedback onPress={() => this.addNewItem(title.name)}>
          <View style={styles.horiR}>
            <Text style={styles.add}>{'+ Add item'}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  addNewItem(listName) {
    if (listName == 'Education') {
      this.state.education.unshift({
        school: { name: '' },
        type: '',
        year: { name: '' },
        concentration: [ { name: '' } ],
      });

      this.setState({
        eduDataSource: this.state.eduDataSource.cloneWithRows(this.state.education),
      });
    } else if (listName == 'Experience') {
      this.state.experience.unshift({
        start_date: '',
        end_date: '',
        employer: { name: '' },
        location: { name: '' },
        position: [ { name: '' } ],
      });

      this.setState({
        workDataSource: this.state.workDataSource.cloneWithRows(this.state.experience),
      });
    }
  }

  getInput(title) {
    let Input = null;
    let propName = title.name.toLowerCase();
    if (title.isArray) {
      let list = this.state[propName];
      if (title.name == 'Education') {
        let _renderRow = (edu, sectionID, rowID) =>
                          this.getDefaultEdu(edu, sectionID, rowID);
        Input = (
          <ListView
            key={this.state.education}
            enableEmptySections={true}
            dataSource={this.state.eduDataSource}
            renderRow={_renderRow}/>
        );
      } else if (title.name == 'Experience') {
        let _renderRow = (edu, sectionID, rowID) =>
                          this.getDefaultWork(edu, sectionID, rowID);
        Input = (
          <ListView
            key={this.state.experience}
            enableEmptySections={true}
            dataSource={this.state.workDataSource}
            renderRow={_renderRow}/>
        );
      }
    } else {
      let defaultValue = this.state[propName];
      Input = this.getTextInput(propName, defaultValue);
    }

    return Input;
  }

  getDefaultEdu(edu, sectionID, rowID) {
    let eduName = edu.school.name;
    let eduYear = edu.year.name;
    let eduSubject = edu.concentration.length === 0 ?
                     '' : edu.concentration[0].name;
    let _onDelete = (rowID) => this.onDeleteEdu(rowID);
    let _onChangeText = (propName1, propName2, idx, text) => this.onChangeEduInfo(propName1, propName2, idx, text);

    return (
      <EduForm
        name={eduName}
        year={eduYear}
        subject={eduSubject}
        id={rowID}
        onDelete={_onDelete}
        onChangeText={_onChangeText} />
    );
  }

  onChangeEduInfo(propName1, propName2, idx, text) {
    if (propName1 == 'concentration') {
      this.state.education[idx][propName1] = [];
      this.state.education[idx][propName1][0] = {};
      this.state.education[idx][propName1][0][propName2] = text;
      return;
    }

    this.state.education[idx][propName1][propName2] = text;
  }

  onDeleteEdu(rowID) {
    this.state.education.splice(rowID, 1);
    this.setState({
      eduDataSource: this.state.eduDataSource.cloneWithRows(this.state.education),
    });
  }

  getDefaultWork(work, sectionID, rowID) {
    let _employer = work.employer.name;
    let _position = work.position.name;
    let _start = work.start_date;
    let _end = work.end_date == '0000-00' ? 'present' : work.end_date;
    let _onDelete = (rowID) => this.onDeleteWork(rowID);
    let _onChangeText = (propName1, propName2, idx, text) => this.onChangeExpInfo(propName1, propName2, idx, text);

    return (
      <WorkForm
        employer={_employer}
        position={_position}
        start={_start}
        end={_end}
        id={rowID}
        onDelete={_onDelete}
        onChangeText={_onChangeText} />
    );
  }

  onChangeExpInfo(propName1, propName2, idx, text) {
    if (propName2 == null) {
      this.state.experience[idx][propName1] = text;
    } else {
      this.state.experience[idx][propName1][propName2] = text;
    }
  }

  onDeleteWork(rowID) {
    this.state.experience.splice(rowID, 1);
    this.setState({
      workDataSource: this.state.workDataSource.cloneWithRows(this.state.experience),
    });
  }

  getTextInput(_propName, _defaultValue) {
    let _onChangeText = (propName, text) => this.onChangeText(propName, text);
    return <EditForm
            propName={_propName}
            defaultValue={_defaultValue}
            onChangeText={_onChangeText} />;
  }

  onChangeText(propName, text) {
    this.state[propName] = text;
  }

  componentDidMount() {
    let _onSuccess = (result) => this.onSuccess(result);
    let _onError = (error) => this.onError(error);
    ServerUtil.initCallback(_onSuccess, _onError);
    ServerUtil.getMyProfile();
  }

  onSuccess(result) {
    result.education.reverse();
    this.setState({
      mypic: result.profile_picture,
      name: result.name,
      gender: result.gender,
      email: result.email,
      education: result.education,
      experience: result.work,
      eduDataSource: this.state.eduDataSource.cloneWithRows(result.education),
      workDataSource: this.state.workDataSource.cloneWithRows(result.work),
    });
  }

  onError(error) {
    if (error.code != ErrorMeta.ERR_NONE) {
      Alert.alert(error.msg);
    }
  }

}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
    paddingLeft: 40,
    //paddingRight: 40,
    flex: 1,
    flexDirection: 'column',
  },

  form: {
    marginTop: 20,
  },

  title: {
    color: '#a6aeae',
    fontSize: 12,
    fontWeight: 'bold',
  },

  add: {
    color: '#2e3031',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },

  nextView: {
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 30,
  },

  nextImage: {
    width: 230,
    height: 45,
  },

  flexR: {
    flexDirection: 'row',
  },

  horiL: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  horiR: {
    justifyContent: 'flex-end',
  },
});

module.exports = GeneralInfo;
