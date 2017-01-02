import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '../../utils/CheckBox';
import LinearGradient from 'react-native-linear-gradient';
import Progress from '../Shared/Progress';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';
import { Actions, Scene, }  from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import { Options } from './SignUpMETA';

const window = Dimensions.get('window');

class ExpertInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: Options,
      checked: [],
      needRefresh: true,
    };
    for (i = 0; i < this.state.options.length; i++) {
      this.state.checked.push(false);
    }

    UserUtil.getExpert(this.onGetExpertCallback.bind(this));
  }

  componentDidMount() {
    if (this.props.fromEdit)
      Actions.refresh({
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Save',
        onRight: this.onNextBtnPressed.bind(this),
      });
  }

  // Update checkbox state
  updateCheckBox(answerIdx, optionIdx, isFreeForm, isChecked) {
    this.state.checked[optionIdx] = !this.state.checked[optionIdx];
    this.forceUpdate();
  }

  componentWillReceiveProps(props) {
    if (props.fromEdit && this.state.needRefresh) {
      Actions.refresh({
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Save',
        onRight: this.onNextBtnPressed.bind(this),
        onBack: () => {
          this.setState({ needRefresh: true });
          Actions.pop();
        },
      });
      this.setState({ needRefresh: false });
    }
  }

  getOptionSet() {
    return this.state.options.map(
        (option, idx) => (
            <CheckBox key={idx}
              iconStyle={styles.iconStyle}
              labelStyle={styles.labelStyle}
              checked={this.state.checked[idx]}
              label={this.state.options[idx]}
              optionIdx={idx}
              onUpdate={this.updateCheckBox.bind(this)}
            />
        )
    );
  }

  onUploadCallback(result, error) {
    if (error) {
      alert(error.msg);
    } else if (result) {
      if (this.props.fromEdit) {
        Actions.pop();
      } else {
        Actions.personality({ me: this.props.me });
      }
    }
  }

  onGetExpertCallback(result, error) {
    if (error) {
      alert(error.msg);
    } else if (result.length !== 0) {
      result.map(
        (object, idx) => {
          this.state.checked[object.index] = true;
        }
      );
      this.forceUpdate();
    }
  }

  onNextBtnPressed() {
    let expertise = [];
    for (i = 0; i < this.state.checked.length; i++) {
      if (this.state.checked[i]) {
        expertise.push({
          select: this.state.options[i],
          index: i,
        });
      }
    }

    let body = { expertise };
    UserUtil.editExpertise(this.onUploadCallback.bind(this), body);
  }

  render() {

    let submitButton = null;

    if (!this.props.fromEdit)
      submitButton = (
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress = {this.onNextBtnPressed.bind(this)} >
            <LinearGradient style={styles.btnStyle}
                            start={[0.9, 0.5]} end={[0.0, 0.5]} locations={[0, 0.75]}
                            colors={['#07e4dd', '#44acff']}>
              <Text style={styles.buttonText}>NEXT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>);

    return (
      <View style={styles.container}>
        {this.props.fromEdit ? null : (<Progress level={4} step={3} />)}
        <ScrollView>
          <View style={styles.header}>
            <Text allowFontScaling={false} style={styles.titleText}>
              {'Add all Keywords that\nyou can help others with.'}
            </Text>
            <Text allowFontScaling={false} style={styles.subTitleText}>
              {'We use this information to\nrecommend the most fit advisor.'}
            </Text>
          </View>
          <View style ={styles.body}>
            {this.getOptionSet()}
          </View>
          {submitButton}
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
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d6dada',
    paddingTop: dimensions.heightWeight * 54,
    paddingBottom: dimensions.heightWeight * 50,
  },
  body: {
    height: dimensions.heightWeight * 370,
    borderTopColor: '#efeff2',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  btnContainer: {
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: dimensions.heightWeight * 40,
    paddingBottom: dimensions.heightWeight * 30,
  },
  btnStyle: {
    height: dimensions.heightWeight * 45,
    width: dimensions.widthWeight * 230,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: dimensions.fontWeight * 18,
    textAlign: 'center',
    color: '#2e3031',
  },
  subTitleText: {
    fontSize: dimensions.fontWeight * 12,
    textAlign: 'center',
    color: '#2e3031',
    marginTop: dimensions.heightWeight * 10,
  },
  buttonText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: dimensions.fontWeight * 16,
  },
  iconStyle: {
    width: dimensions.widthWeight * 50,
    height: dimensions.heightWeight * 50,
  },
  labelStyle: {
    height: dimensions.heightWeight * 50,
    borderBottomColor: '#efeff2',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  rightTextStyle: {
    backgroundColor: 'transparent',
    color: '#44acff',
    fontSize: dimensions.fontWeight * 16,
    marginRight: dimensions.widthWeight * 15,
  },
});

module.exports = ExpertInfo;
