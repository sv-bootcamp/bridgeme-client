import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';

const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  formEditView: {
    width: deviceWidth - dimensions.widthWeight * 30,
    borderBottomWidth: 1,
    borderBottomColor: '#a6aeae',
    paddingTop: dimensions.heightWeight * 50,
    paddingBottom: dimensions.heightWeight * 35,
    paddingLeft: dimensions.widthWeight * 15,
    paddingRight: dimensions.widthWeight * 15,
    marginRight: dimensions.widthWeight * 15,
    marginLeft: dimensions.widthWeight * 15,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#ffffff',
  },
  formEditBottomLine: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    marginBottom: dimensions.heigthWeight * 15,
  },
  formView: {
    width: deviceWidth - dimensions.widthWeight * 40,
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
    paddingBottom: dimensions.heightWeight * 15,
  },
  deleteView: {
    width: dimensions.widthWeight * 77,
    backgroundColor: '#fd5b52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#ffffff',
  },
  formNameContainer: {
    width: deviceWidth - dimensions.widthWeight * 40,
    height: dimensions.heightWeight * 16,
  },
  formName: {
    color: '#2e3031',
    fontSize: dimensions.fontWeight * 16,
  },
  formEditName: {
    textAlign: 'left',
    textAlignVertical: 'center',
    height: dimensions.heightWeight * 40,
  },
  formDate: {
    color: '#2e3031',
    marginTop: dimensions.heightWeight * 10,
    fontSize: dimensions.fontWeight * 12,
  },
  formEditDegree: {
    width: deviceWidth - 70,
  },
  formEditYear: {
    flex: 1,
  },
  formEditMid: {
    width: dimensions.widthWeight * 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formEditPlaceholder: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingTop: dimensions.heightWeight * 10,
    paddingBottom: dimensions.heightWeight * 10,
    paddingLeft: dimensions.widthWeight * 10,
    paddingRight: dimensions.widthWeight * 10,
    height: dimensions.widthWeight * 30,
  },
  doneWrapper: {
    alignItems: 'flex-end',
    backgroundColor: '#fbfbfb',
    paddingVertical: dimensions.heightWeight * 10,
    paddingHorizontal: dimensions.widthWeight * 10,
  },
  doneText: {
    fontSize: dimensions.fontWeight * 16,
    color: '#44acff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formEditDate: {
    height: dimensions.heightWeight * 30,
    borderWidth: 0,
    alignItems: 'center',
  },
  firstMargin: {
    marginTop: dimensions.heightWeight * 20,
  },
  sectionMargin: {
    marginTop: dimensions.heightWeight * 10.5,
  },
  flexR: {
    flexDirection: 'row',
  },
  editL: {
    flex: 1,
    marginTop: dimensions.heightWeight * 15,
    justifyContent: 'flex-start',
  },
  editR: {
    width: dimensions.widthWeight * 26,
    marginTop: dimensions.heightWeight * 15,
    marginRight: dimensions.widthWeight * 20,
    justifyContent: 'flex-end',
  },
  editBtn: {
    width: dimensions.widthWeight * 16,
    height: dimensions.heightWeight * 16,
  },
});

module.exports = styles;
