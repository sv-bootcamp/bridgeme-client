import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  AsyncStorage,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';
import SurveyUtil from '../../utils/SurveyUtil';
import CheckBox from './CheckBox';
import Activity from '../Activity/Activity';
import {
  Actions,
  Scene,
} from 'react-native-router-flux';

class EvalPage extends Component {
  constructor(props) {
    super(props);

    surveyID = null;
    questions = null;
    question = null;
    qestionPage = null;

    let onSuccess = (result) => this.onSuccess(result);
    let onError = (error) => this.onError(error);

    this.surveyUtil = new SurveyUtil(onSuccess, onError);

    if (this.props.pageNo === undefined) {
      this.props.pageNo = 0;
      AsyncStorage.getItem('token', (err, result) => {
        if (result)
          this.surveyUtil.getQuestionPage(this.props.select, result);
      });
    } else {
      AsyncStorage.getItem('qestionPage', (err, result) => {

        this.state.questionIndex = this.props.pageNo;
        this.qestionPage = JSON.parse(result);
        this.surveyID = this.qestionPage.survey_id;
        this.questions = this.qestionPage.questions;
        this.question = this.questions[this.state.questionIndex];

        this.initSelectCount();
        this.state.loaded = true;
        this.forceUpdate();
      });
    }

    this.state = {
      loaded: false,
      questionIndex: 0,
      selectCount: [],
      token: null,
      freeForm: false,
      freeFormflag: false,
      freeFormText: null,
    };
  }

  onError(error) {
    console.log(error);
  }

  onSuccess(result) {

    if (result.questions !== undefined) {
      this.qestionPage = result;
      this.surveyID = result.survey_id;
      this.questions = result.questions;
      this.question = this.questions[this.state.questionIndex];

      AsyncStorage.setItem('qestionPage', JSON.stringify(this.qestionPage));

      this.initSelectCount();

      this.setState({
        loaded: true,
      });
    } else {
      Alert.alert('Request Sent Successfully');
      Actions.main();
    }
  }

  // Initialze checked item count
  initSelectCount() {
    let size = this.questions.length;
    for (let i = 0; i < size; i++) {
      this.state.selectCount[i] = 0;
    }
  }

  // Render question title
  getQuestionTitle() {
    let questionNo = Number(this.question.question_index) + 1;
    let title = this.question.question;

    return (
      <Text style={styles.title}>
        {'Q' + questionNo + '. ' + title}
      </Text>
    );
  }

  // Render checkbox by category
  getAnswerSet() {
    return this.question.answers.map(
      (answer, idx) => {
        let options = answer.options;
        let subTitle = this.getSubTitle(answer.title);
        let optionSet = this.getOptionSet(options, idx);

        return (
          <View key={idx}>
            {subTitle}
            <View style = {styles.answerWrapper}>
              {optionSet}
            </View>
          </View>
        );
      }
    );
  }

  // Render category title
  getSubTitle(title) {
    if (title) {
      return (
        <View style = {{ marginTop: 20, marginLeft: 20, }} >
          <Text>{title}</Text>
        </View>
      );
    }

    return null;
  }

  // Render checkbox item
  getOptionSet(options, answerIdx) {
    return options.map(
      (option, idx) => {
        let isChecked = (option.isChecked === undefined) ?
                        false : option.isChecked;
        let freeForm = this.getFreeForm(
          answerIdx,
          idx,
          option.is_free_form,
          isChecked,
          option.inputValue);

        return (
          <View key={option.answer_index}>
            <CheckBox
              checked={isChecked}
              freeForm={option.is_free_form}
              label={option.content}
              answerIdx={answerIdx}
              optionIdx={idx}
              onUpdate={this.updateCheckBox.bind(this)}
              />
            {freeForm}
          </View>
        );
      }
    );
  }

  // Update checkbox state
  updateCheckBox(answerIdx, optionIdx, isFreeForm, isChecked) {
    if (this.question.allow_multiple_answer) {
      this.question.answers[answerIdx].options[optionIdx].isChecked = !isChecked;
    } else {
      let length = this.question.answers[answerIdx].options.length;

      for (let i = 0; i < length; i++) {
        this.question.answers[answerIdx].options[i].isChecked = false;
      }

      this.question.answers[answerIdx].options[optionIdx].isChecked = !isChecked;
    }

    if (!isChecked) {
      this.state.selectCount[this.state.questionIndex]++;
    } else {
      this.state.selectCount[this.state.questionIndex]--;
    }

    this.forceUpdate();
  }

  // Render user text input
  getFreeForm(answerIdx, optionIdx, isFreeForm, isChecked, inputValue) {
    if (isFreeForm) {
      let colorCode = isChecked ? '#546979' : '#b9babd';

      this.state.freeFormflag  = isChecked
                                  && (inputValue === undefined || inputValue === '');
      return (
        <View  style={styles.freeFormView}>
            <TextInput
              style={[styles.freeForm, { color: colorCode }]}
              onChange={(event) => this.storeFreeForm(answerIdx, optionIdx, event.nativeEvent.text)}
              editable={isChecked}
              defaultValue={inputValue}
              onChangeText={(text) => this.setState({ text })}
              underlineColorAndroid="transparent"
              value={this.state.text}
            />
         </View>
      );
    }

    return null;
  }

  // Store user text input
  storeFreeForm(answerIdx, optionIdx, text) {
    this.question.answers[answerIdx].options[optionIdx].inputValue = text;
  }

  // Render send/next button
  getBottomSet() {
    let label = 'Next';
    let onPressEvent = () => this.nextQuestion();

    if (this.question.question_index == this.questions.length - 1) {
      label = 'Send Result';
      onPressEvent = () => this.sendResult();
    }

    return (
      <TouchableOpacity
        style={styles.connectButton}
        onPress ={onPressEvent}>
        <Text style={styles.buttonText}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  // Refresh checked item data
  refreshData() {
    let selCnt = 0;
    let answers = this.question.answers;

    for (let i = 0; i < answers.length; i++) {
      for (let j = 0; j < answers[i].options.length; j++) {
        if (answers[i].options[j].isChecked) {
          selCnt++;
        }
      }
    }

    this.state.selectCount[this.state.questionIndex] = selCnt;
    this.forceUpdate();
  }

  // Go to next question page
  nextQuestion() {
    this.refreshData();

    if (this.state.selectCount[this.state.questionIndex] === 0) {
      Alert.alert(
            '',
            'Select at least on item.',
          );
      return;
    }

    if (this.state.questionIndex < this.questions.length - 1) {
      if (this.state.freeFormflag == true) {
        Alert.alert(
                '',
                '기타의 내용을 입력해 주세요.',
              );
      } else {
        AsyncStorage.getItem('qestionPage', (err, result) => {

            let data = JSON.parse(result);

            data.questions[this.state.questionIndex]
           = this.qestionPage.questions[this.state.questionIndex];

            AsyncStorage.setItem('qestionPage', JSON.stringify(data));
            Actions.evalPage({ pageNo: Number(this.state.questionIndex) + 1,
                            qestionPage: this.qestionPage,
                          });
          });
      }
    }
  }

  // Send result to server
  sendResult() {
    this.refreshData();
    if (this.state.selectCount[this.state.questionIndex] === 0) {
      Alert.alert(
            'Warning',
            'Select at least one item.',
          );
      return;
    }

    if (this.state.freeFormflag == true) {
      Alert.alert(
              'Warning',
              '기타의 내용을 입력해 주세요.',
            );
      return;
    }

    let body = {
      survey_id: this.surveyID,
      questions: this.surveyUtil.buildResult(this.questions),
    };

    AsyncStorage.getItem('token', (err, result) => {
      if (result)
        this.surveyUtil.sendResult(body, result);
    });
  }

  renderLoadingView() {
    return (
        <View style={styles.header}>
            <View style={styles.container}>
                <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, { height: 80 }]}
                    size="large"
                />
            </View>
            <Text style={styles.loadingText}>Loading</Text>
        </View>
    );
  }

  componentWillUnmount() {
    AsyncStorage.setItem('qestionPage', JSON.stringify(this.qestionPage));
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    let questionTitle = this.getQuestionTitle();
    let answerSet = this.getAnswerSet();
    let bottomSet = this.getBottomSet();

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            {questionTitle}
          </View>
          <ScrollView style={styles.scrollView}>
            {answerSet}
          </ScrollView>
        </View>
        <View>
          {bottomSet}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  answerWrapper: {
    flex: 4,
    marginLeft: 40,
    marginRight: 20,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  qTitle: {
    alignSelf: 'center',
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    marginLeft: 30,
    marginRight: 30,
    color: '#546979',
  },
  scrollView: {
    flex: 4,
    marginBottom: 10,
  },
  freeFormView: {
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderBottomColor: '#b9babd',
    borderBottomWidth: 1,
  },
  freeForm: {
    marginLeft: 10,
    marginRight: 10,
    height: 40,
  },
  connectButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1ecfe2',
    borderRadius: 3,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  backbutton: {
    position: 'absolute',
    marginTop: 15,
    height: 25,
    width: 25,
    top: 15,
    left: 10,
  },
  backbuttonimage: {
    height: 17,
    width: 24,
  },
});

module.exports = EvalPage;
