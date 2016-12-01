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
  TouchableOpacity,
  View,
} from 'react-native';
import EditForm from './EditForm';
import EduForm from './EduForm';
import LinearGradient from 'react-native-linear-gradient';
import MyPic from './MyPic';
import Progress from '../Shared/Progress';
import UserUtil from '../../utils/UserUtil';
import WorkForm from './WorkForm';
import {
  Actions,
  Scene,
} from 'react-native-router-flux';

class GeneralInfo extends Component {
  // List data for rendering each section.
  titles = [
    { name: 'Name', isArray: false, },
    { name: 'Email', isArray: false, },
    { name: 'Languages', isArray: false, },
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
      refreshFlag: false,
      mypic: '',
      name: '',
      email: '',
      languages: '',
      location: '',
      about: '',
      education: [],
      experience: [],
      eduDataSource: eduDS.cloneWithRows([]),
      workDataSource: workDS.cloneWithRows([]),
      imageResource: null,
      needRefresh: true,
    };
  }

  // After rendering, request user profile to server
  componentDidMount() {
    if (this.props.me) {
      let result = this.props.me;
      result.education.reverse();
      this.setState({
        mypic: result.profile_picture,
        name: result.name,
        gender: result.gender,
        email: result.email,
        languages: result.languages,
        location: result.location,
        about: result.about,
        education: result.education,
        experience: result.experience,
        eduDataSource: this.state.eduDataSource.cloneWithRows(result.education),
        workDataSource: this.state.workDataSource.cloneWithRows(result.experience),
      });
    } else {
      UserUtil.getMyProfile(this.onGetMyProfileCallback.bind(this));
    }

    if(this.props.fromEdit)
      Actions.refresh({ rightTitle: 'SAVE', onRight: this.regist.bind(this) });
  }

  componentWillReceiveProps(props) {
    if(props.fromEdit && this.state.needRefresh) {
      Actions.refresh({
        rightTitle: 'SAVE',
        onRight: this.regist.bind(this),
        onBack: () => {
          this.setState({ needRefresh: true });
          Actions.pop();
        }
      });
      this.setState({ needRefresh: false });
    }
  }

  onGetMyProfileCallback(result, error) {
    if (result) {
      result.education.reverse();
      this.setState({
        mypic: result.profile_picture,
        name: result.name,
        gender: result.gender,
        email: result.email,
        languages: result.languages,
        location: result.location,
        about: result.about,
        education: result.education,
        experience: result.experience,
        eduDataSource: this.state.eduDataSource.cloneWithRows(result.education),
        workDataSource: this.state.workDataSource.cloneWithRows(result.experience),
      });
    }

    if (error) {
      if (error.msg) {
        Alert.alert(error.msg);
      }
    }
  }

  // Render progress bar, profile image and form.
  render() {
    let readyUploadImage = (imageResource) => {
      this.state.imageResource = imageResource;
    };

    let Forms = this.getForms();
    let submitButton = null;

    if(!this.props.fromEdit)
      submitButton = (
        <View style={styles.nextView}>
          <TouchableOpacity onPress={() => this.regist()}>
            <LinearGradient
              start={[0.9, 0.5]} end={[0.0, 0.5]}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}
              style={styles.nextImage}>
              <Text style={styles.nextTxt}>NEXT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>);

    return (
      <View style={styles.container}>
        <Progress level={4} step={1} />
        <ScrollView style={styles.scrollView}>
          <MyPic uri={this.state.mypic} readyUploadImage={readyUploadImage} />
          {Forms}
          {submitButton}
        </ScrollView>
      </View>
    );
  }

  // Regist general user info.
  regist() {
    if (this.state.name === '') {
      Alert.alert('Sign In', 'Please input your name.');
      return;
    }

    let emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(this.state.email) === false) {
      Alert.alert('Sign In', 'Please input your correct email.');
      return;
    }

    let image = null;
    if (this.state.imageResource !== null) {
      image = this.state.imageResource.data;
    }

    let fieldSet = {
      name: this.state.name,
      email: this.state.email,
      languages: this.state.languages,
      location: this.state.location,
      about: this.state.about,
      education: this.state.education,
      experience: this.state.experience,
      image: image,
    };

    UserUtil.editGeneral(this.onUploadCallback.bind(this), fieldSet);
  }

  onUploadCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      if (this.props.fromEdit) {
        Actions.pop();
      } else {
        Actions.careerInfo({me: this.props.me});
      }
    }
  }

  // Get Forms(name, email, languages, location, about, education, experience)
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
    let eduName = edu.school === undefined ? '' : edu.school.name;
    let startYear = edu.startYear === undefined ? '' : edu.startYear.name;
    let endYear = edu.year === undefined ? '' : edu.year.name;
    if (edu.endYear !== undefined) endYear = edu.endYear.name;
    let eduSubject = '';
    if (edu.concentration !== undefined && edu.concentration.length > 0) {
      eduSubject = edu.concentration[0].name;
    }
    let onDelete = (rowID) => this.onDeleteEdu(rowID);
    let onChangeText = (propName1, propName2, idx, text) =>
                        this.onChangeEduInfo(propName1, propName2, idx, text);

    return (
      <EduForm
        name={eduName}
        startYear={startYear}
        endYear={endYear}
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

    if (this.state.education[idx][propName1] === undefined) {
      this.state.education[idx][propName1] = {};
    }
    this.state.education[idx][propName1][propName2] = text;
  }

  onDeleteEdu(rowID) {
    this.state.education.splice(rowID, 1);
    this.setState({
      eduDataSource: this.state.eduDataSource.cloneWithRows(this.state.education),
    });
  }

  getDefaultWork(experience, sectionID, rowID) {
    let employer = experience.employer === undefined ? '' : experience.employer.name;
    let position = experience.position === undefined ? '' : experience.position.name;
    let start = experience.start_date === undefined ? '' : experience.start_date;
    let end = '';
    if (experience.end_date !== undefined) {
      end = experience.end_date == '0000-00' ? 'present' : experience.end_date;
    }
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
    marginRight: 30,
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
    fontFamily: 'SFUIText-Bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 16,
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
