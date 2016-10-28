import React, { Component } from 'react';
import {
  Alert,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import EditForm from './EditForm';
import EduForm from './EduForm';
import ErrorMeta from '../../utils/ErrorMeta';
import LinearGradient from 'react-native-linear-gradient';
import MyPic from './MyPic';
import FileUploader from './FileUploader';
import Progress from './Progress';
import ServerUtil from '../../utils/ServerUtil';
import WorkForm from './WorkForm';

class GeneralInfo extends Component {

  // List data for rendering each section.
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

    let onSuccess = (result) => this.onSuccess(result);
    let onError = (error) => this.onError(error);
    ServerUtil.initCallback(onSuccess, onError);

    let eduDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let workDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      resetFlag: false,
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
      imageResource: null,
    };
  }

  // After rendering, request user profile to server
  componentDidMount() {
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

  // Render progress bar, profile image and form.
  render() {
    let resetForm = () => {
      if (this.state.resetFlag) {
        this.setState({ resetFlag: false });
      }
    };
    let readyUploadImage = (imageResource) => {
      this.state.imageResource = imageResource;
    };

    let Forms = this.getForms();

    return (
      <View style={styles.container}>
        <Progress level={5} step={1} />
        <ScrollView style={styles.scrollView}>
          <MyPic uri={this.state.mypic} readyUploadImage={readyUploadImage} />
          {Forms}
          <View style={styles.nextView}>
            <TouchableWithoutFeedback onPress={() => this.regist()}>
              <LinearGradient
                colors={['#44acff', '#07e4dd']}
                start={[0.0, 0.0]} end={[1.0, 1.0]}
                style={styles.nextImage}>
                <Text style={styles.nextTxt}>NEXT</Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Regist general user info.
  regist() {
    let files = [ ];

    if (this.state.imageResource != null) {
      let file = {
        filename: this.state.imageResource.fileName, // require, file name
        filepath: this.state.imageResource.path, // require, file absoluete path
        filetype: this.state.imageResource.type,
      };
      files.push(file);
    }

    if (this.state.name === '') {
      Alert.alert(
        'Sign In',
        'Please input your name.',
      );
      return;
    }

    if (this.state.email === '') {
      Alert.alert(
        'Sign In',
        'Please input your email.',
      );
      return;
    }

    let fields = {
      name: this.state.name,
      email: this.state.email,
      languages: this.state.language,
      location: this.state.location,
      about: this.state.about,
      education: this.state.education,
      work: this.state.experience,
    };

    let fileUploader = new FileUploader();
    fileUploader.upload(files, fields);
  }

  // Get Forms(name, email, language, location, about, education, experience)
  // Each form includes title and input
  getForms() {
    let Forms = this.titles.map(
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

    return Forms;
  }

  // If a form has several inputs, the title should be able to add new input set
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

  // Add new empty input set.
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
        let renderRow = (edu, sectionID, rowID) =>
                          this.getDefaultEdu(edu, sectionID, rowID);
        Input = (
          <ListView
            key={this.state.education}
            enableEmptySections={true}
            dataSource={this.state.eduDataSource}
            renderRow={renderRow}/>
        );
      } else if (title.name == 'Experience') {
        let renderRow = (edu, sectionID, rowID) =>
                          this.getDefaultWork(edu, sectionID, rowID);
        Input = (
          <ListView
            key={this.state.experience}
            enableEmptySections={true}
            dataSource={this.state.workDataSource}
            renderRow={renderRow}/>
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
    let onDelete = (rowID) => this.onDeleteEdu(rowID);
    let onChangeText = (propName1, propName2, idx, text) =>
                        this.onChangeEduInfo(propName1, propName2, idx, text);

    return (
      <EduForm
        name={eduName}
        year={eduYear}
        subject={eduSubject}
        id={rowID}
        onDelete={onDelete}
        onChangeText={onChangeText} />
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
    let employer = work.employer.name;
    let position = work.position.name;
    let start = work.start_date;
    let end = work.end_date == '0000-00' ? 'present' : work.end_date;
    let onDelete = (rowID) => this.onDeleteWork(rowID);
    let onChangeText = (propName1, propName2, idx, text) =>
                        this.onChangeExpInfo(propName1, propName2, idx, text);

    return (
      <WorkForm
        employer={employer}
        position={position}
        start={start}
        end={end}
        id={rowID}
        onDelete={onDelete}
        onChangeText={onChangeText} />
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

  getTextInput(propName, defaultValue) {
    let onChangeText = (propName, text) => this.onChangeText(propName, text);
    return <EditForm
            propName={propName}
            defaultValue={defaultValue}
            onChangeText={onChangeText} />;
  }

  onChangeText(propName, text) {
    this.state[propName] = text;
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
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    paddingLeft: 40,
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
    marginRight: 40,
  },
  nextImage: {
    width: 230,
    height: 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextTxt: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
