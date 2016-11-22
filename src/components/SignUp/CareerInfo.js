import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Option,
  OptionList,
  Select,
  updatePosition
} from '../../utils/dropdown/index';
import Dropdown from 'react-native-dropdown-android';
import LinearGradient from 'react-native-linear-gradient';
import Progress from '../Shared/Progress';
import UserUtil from '../../utils/UserUtil';
import { Actions, Scene, }  from 'react-native-router-flux';
import { CareerData } from './SignUpMETA';

class CareerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: CareerData.questions,
      checked: [],
      selected: [],
      option: [],
      selectOP: '',
      clearFlag: false,
    };

    this.state.option[0] = CareerData.area;
    this.state.option[1] = [];
    this.state.option[2] = CareerData.years;
    this.state.option[3] = CareerData.education_background;

    for (i = 0; i < this.state.option.length; i++) {
      this.state.checked.push(false);
      this.state.selected.push('');
    }

    if (Platform.OS === 'android') {
      this.state.option[1] = CareerData.role[0].list;
      this.state.selected[0] = CareerData.area[0];
      this.state.selected[1] = CareerData.role[0].list[0];
      this.state.selected[2] = CareerData.years[0];
      this.state.selected[3] = CareerData.education_background[0];

      this.state.checked[0] = true;
      this.state.checked[1] = true;
      this.state.checked[2] = true;
      this.state.checked[3] = true;
    }

  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      for (idx = 0; idx < this.state.questions.length; idx++) {
        updatePosition(this.refs['SELECT' + idx]);
        updatePosition(this.refs['OPTION' + idx]);
      }
    }

    if(this.props.fromEdit)
      Actions.refresh({ rightTitle: 'SAVE', onRight: this.onNextBtnPressed.bind(this) });
  }

  getOptionList(index) {
    this.state.selectOP = index;
    this.forceUpdate();
    return this.refs['OPTION' + String(index)];
  }

  onSelect(province, idx) {
    if (idx === 0 && province !== this.state.selected[idx])
      this.state.checked[1] = false;

    this.state.selectOP = idx;
    this.state.selected[idx] = province;
    this.state.checked[idx] = true;

    if (idx === 0) {
      for (i = 0; i < CareerData.role.length; i++) {
        if (CareerData.role[i].area === this.state.selected[0]) {
          this.state.option[1] = CareerData.role[i].list;
          this.state.clearFlag = true;
          break;
        }
      }
    }

    this.forceUpdate();
  }

  getOptionSet(index) {
    return this.state.option[index].map(
      (area, idx) => <Option key={idx}>{area}</Option>
    );
  }

  getQuestionSet() {
    return this.state.questions.map(
        (question, idx) => {
          let clear = false;
          let zIdx = (this.state.selectOP === idx)  ? 200 : 100;
          let activate = (this.state.selected[0] === '' && idx === 1) ? false : true;
          if (this.state.clearFlag && idx === 1) {
            this.state.clearFlag = false;
            clear = true;
          }

          if (Platform.OS === 'android') {
            return (
              <View key={idx} style={[styles.questionContainer, { zIndex: zIdx }]}>
                <Text style={styles.questionText}>{this.state.questions[idx]}</Text>
                <View key={idx} style={[styles.dropdownContainerAndroid]}>
                  <Dropdown
                    style={{ height: 40, width: Dimensions.get('window').width - 60 }}
                    values={this.state.option[idx]}
                    onChange={(CareerData) => {
                      this.onSelect(CareerData.value, idx);
                    }}/>

                </View>
              </View>
              );
          } else {
            return (
              <View key={idx} style={[styles.questionContainer, { zIndex: zIdx }]}>
                <Text style={styles.questionText}>{this.state.questions[idx]}</Text>
                <View style={[styles.dropdownContainer]}>
                  <Select
                    ref={'SELECT' + idx}
                    clear={clear}
                    activate={activate}
                    index={idx}
                    width={Dimensions.get('window').width - 60}
                    defaultValue={' '}
                    optionListRef={this.getOptionList.bind(this)}
                    onSelect={this.onSelect.bind(this)}>
                    {this.getOptionSet(idx)}
                    </Select>
                    <OptionList ref={'OPTION' + idx} index={idx}/>
                </View>
              </View>
            );
          }
        }
      );
  }

  onUploadCallback(result, error) {
    if (error) {
      alert(JSON.stringify(error));
    } else if (result) {
      if (this.props.fromEdit) {
        Actions.pop();
      } else {
        Actions.expertInfo({me: this.props.me});
      }
    }
  }

  onNextBtnPressed() {
    let job = [
    {
      area: this.state.selected[0],
      role: this.state.selected[1],
      years: this.state.selected[2],
      education_background: this.state.selected[3],
    },
    ];

    let body = { job };
    UserUtil.editJob(this.onUploadCallback.bind(this), body);

  }

  renderNextBtn() {
    let opacity = 1;
    let disabled  = false;
    for (i = 0; i < this.state.checked.length; i++) {
      if (!this.state.checked[i]) {
        opacity = 0.5;
        disabled  = true;
      }
    }

    return (
        <TouchableOpacity disabled ={disabled}
          onPress = {this.onNextBtnPressed.bind(this)}>
          <LinearGradient style={styles.btnStyle}
            start={[0.9, 0.5]} end={[0.0, 0.5]} locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}>
            <View  opacity={opacity}>
              <Text style={styles.buttonText}>
                NEXT
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
    );
  }

  render() {
    let submitButton = null;

    if(!this.props.fromEdit)
      submitButton = this.renderNextBtn();
    return (
      <View style ={styles.container}>
        <Progress level={4} step={2} />
        <ScrollView contentContainerStyle ={styles.scrollViewcontainer}>
          <View style={styles.header}>
            <Text style={styles.titleText}>What do you do?</Text>
            <Text style={styles.subTitleText}>Let us know your career background.</Text>
          </View>
          <View style={styles.body}>
            {this.getQuestionSet()}
          </View>
          <View style={styles.btnContainer}>
            {submitButton}
          </View>
        </ScrollView>
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
  },
  scrollViewcontainer: {
    flex: 1,
  },
  header: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d6dada',
  },
  body: {
    flex: 4,
    marginLeft: 30,
    marginRight: 30,
    zIndex: 100,
  },
  questionContainer: {
    marginBottom: 20,
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownContainerAndroid: {
    marginTop: 10,
    borderColor: '#efeff2',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
  },
  btnContainer: {
    flex: 1,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStyle: {
    height: 45,
    width: 230,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'SFUIText-regular',
    fontSize: 18,
    color: '#2e3031',
  },
  subTitleText: {
    fontFamily: 'SFUIText-regular',
    fontSize: 12,
    color: '#2e3031',
    marginTop: 10,
  },
  questionText: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 12,
    color: '#a6aeae',
  },
  buttonText: {
    fontFamily: 'SFUIText-Bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 16,
  },
});

module.exports = CareerInfo;
