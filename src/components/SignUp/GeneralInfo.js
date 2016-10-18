import React, { Component } from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import ErrorMeta from '../../utils/ErrorMeta';
import ServerUtil from '../../utils/ServerUtil';
import styles from './Styles';
import EduForm from './EduForm';

class GeneralInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mypic: '',
      name: '',
      birth: '',
      gender: '',
      email: '',
      language: '',
      about: '',
      education: [],
      experience: [],
    };
  }

  render() {
    let MyPic = this.getMyPic();
    let Forms = this.getForms();

    return (
      <ScrollView style={styles.container}>
        {MyPic}
        {Forms}
        <View style={styles.nextView}>
          <Image style={styles.nextImage}
                 source={require('../../resources/GeneralInfo_Next_btn.png')} />
        </View>
      </ScrollView>
    );
  }

  getMyPic() {
    return (
      <View style={styles.profileImageView}>
        <Image style={styles.profileImage}
               source={
                 this.state.mypic === '' ?
                 require('../../resources/default_profile.png') :
                 { uri: this.state.mypic }
               } />
      </View>
    );
  }

  getForms() {
    let titles = [
      { name: 'Name', multiline: false, isArray: false, },
      { name: 'Birth', multiline: false, isArray: false, },
      { name: 'Gender', multiline: false, isArray: false, },
      { name: 'Email', multiline: false, isArray: false, },
      { name: 'Language', multiline: false, isArray: false, },
      { name: 'Location', multiline: false, isArray: false, },
      { name: 'About', multiline: true, isArray: false, },
      { name: 'Education', multiline: true, isArray: true, },
      { name: 'Experience', multiline: true, isArray: true, },
    ];

    let forms = titles.map(
      (title, idx) => {
        let Title = <Text style={styles.title}>{title.name}</Text>;
        let Input = null;
        if (title.isArray) {
          let list = this.state[title.name.toLowerCase()];
          if (title.name == 'Education') {
            Input =  this.getDefaultEdu(list);
          } else if (title.name == 'Experience') {
            Input =  this.getDefaultWork(list);
          }
        } else {
          let _defaultValue = this.state[title.name.toLowerCase()];
          Input = this.getTextInput(_defaultValue, title.multiline);
        }

        return (
          <View style={styles.firstMargin} key={idx}>
            {Title}
            {Input}
          </View>
        );
      }
    );

    return forms;
  }

  getDefaultEdu(eduList) {
    let length = eduList.length;
    for (let i = 0; i < length / 2; i++) {
      let temp = eduList[i];
      eduList[i] = eduList[length - 1 - i];
      eduList[length - 1 - i] = temp;
    }

    return eduList.map(
      (edu, idx) => {
        let eduName = edu.school.name;
        let eduYear = edu.year.name;
        let eduSubject = edu.concentration.length === 0 ?
                         '' : edu.concentration[0].name;
        return <EduForm
                key={idx}
                name={eduName}
                year={eduYear}
                subject={eduSubject} />;
      }
    );
  }

  getDefaultWork(workList) {
    return workList.map(
      (work, idx) => {
        let workName = work.employer.name + ' | ' + work.position.name;
        let start = work.start_date;
        let end = work.end_date == '0000-00' ? 'present' : work.end_date;
        let workDate = start + ' - ' + end;
        return (
          <TouchableWithoutFeedback key={idx} onPress={() => alert(idx)}>
            <View style={styles.workView} onPress={() => alert(idx)}>
              <View><Text style={styles.workName}>{workName}</Text></View>
              <View><Text style={styles.workDate}>{workDate}</Text></View>
            </View>
          </TouchableWithoutFeedback>
        );
      }
    );
  }

  getTextInput(_defaultValue, _multiline) {
    return (
      <TextInput
        style={styles.input}
        defaultValue={_defaultValue}
        underlineColorAndroid="#efeff2"
        multiline={_multiline} />
    );
  }

  componentDidMount() {
    let _onSuccess = (result) => this.onSuccess(result);
    let _onError = (error) => this.onError(error);
    ServerUtil.initCallback(_onSuccess, _onError);
    ServerUtil.getMyProfile();
  }

  onSuccess(result) {
    this.setState({
      mypic: result.profile_picture,
      name: result.name,
      gender: result.gender,
      email: result.email,
      experience: result.work,
      education: result.education,
    });
  }

  onError(error) {
    if (error.code != ErrorMeta.ERR_NONE) {
      Alert.alert(error.msg);
    }
  }

}

module.exports = GeneralInfo;
