import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '../../utils/CheckBox';
import LinearGradient from 'react-native-linear-gradient';
import Progress from '../Shared/Progress';
import { Actions, Scene, }  from 'react-native-router-flux';
import { Options } from './SignUpMETA';

const window = Dimensions.get('window');

class ExpertInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      options: Options,
      checked: [],
    };
    for (i = 0; i < this.state.options.length; i++) {
      this.state.checked.push(false);
    }
  }

  // Update checkbox state
  updateCheckBox(answerIdx, optionIdx, isFreeForm, isChecked) {
    this.state.checked[optionIdx] = !this.state.checked[optionIdx];
    this.forceUpdate();
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

  onUploadCallback() {
    this.onNextBtnPressed();
  }

  onNextBtnPressed() {
    let help = [];
    for (i = 0; i < this.state.checked.length; i++) {
      if (this.state.checked[i]) {
        help.push({
          select: this.state.options[i],
          index: i,
        });
      }
    }

    let body = { help };
    console.log(JSON.stringify(body));

    Actions.personality({ me: this.props.me });
  }

  render() {
    return (
      <View style={styles.container}>
        <Progress level={4} step={3} />
        <View style={styles.header}>
          <Text allowFontScaling={false} style={styles.titleText}>
            {'Add all Keywords that\nyou can help others with.'}
          </Text>
          <Text allowFontScaling={false} style={styles.subTitleText}>
            {'We use this information to\nrecommend the most fit advisor.'}
          </Text>
        </View>
        <View style ={styles.body}>
          <ScrollView>
            {this.getOptionSet()}
          </ScrollView>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress = {this.onUploadCallback.bind(this)} >
            <LinearGradient style={styles.btnStyle}
              start={[0.9, 0.5]} end={[0.0, 0.5]} locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
              <Text style={styles.buttonText}>NEXT</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  },
  header: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d6dada',
  },
  body: {
    flex: 3,
    borderTopColor: '#efeff2',
    borderTopWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
  },
  scrollViewContainer: {
    flex: 1,
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
    textAlign: 'center',
    color: '#2e3031',
  },
  subTitleText: {
    fontFamily: 'SFUIText-regular',
    fontSize: 12,
    textAlign: 'center',
    color: '#2e3031',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'SFUIText-Bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 16,
  },
  iconStyle: {
    width: 50,
    height: 50,
  },
  labelStyle: {
    height: 50,
    justifyContent: 'center',
    borderBottomColor: '#efeff2',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});

module.exports = ExpertInfo;
