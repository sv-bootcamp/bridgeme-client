import {
  Dimensions,
  StyleSheet,
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  formEditView: {
    borderBottomWidth: 1,
    borderBottomColor: '#a6aeae',
    paddingBottom: 15,
  },
  formEditBottomLine: {
    borderBottomColor: '#a6aeae',
    borderBottomWidth: 1,
  },
  formView: {
    width: deviceWidth - 40,
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
    paddingBottom: 15,
  },
  deleteView: {
    width: 77,
    backgroundColor: '#fd5b52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#ffffff',
  },
  formNameContainer: {
    width: deviceWidth - 40,
    height: 16,
  },
  formName: {
    color: '#2e3031',
    fontSize: 16,
  },
  formEditName: {
    textAlign: 'left',
    textAlignVertical: 'center',
    height: 40,
  },
  formDate: {
    color: '#2e3031',
    marginTop: 10,
    fontSize: 12,
  },
  formEditYear: {
    width: 100,
    //height: 24,
  },
  doneWrapper: {
    alignItems: 'flex-end',
    backgroundColor: '#fbfbfb',
    padding: 10,
  },
  doneText: {
    fontSize: 16,
    color: '#44acff',
  },
  modalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
  },
  formEditDate: {
    height: 30,
    borderWidth: 0,
    alignItems: 'flex-start',
  },
  firstMargin: {
    marginTop: 20,
  },
  sectionMargin: {
    marginTop: 10.5,
  },
  flexR: {
    flexDirection: 'row',
  },
  editL: {
    flex: 1,
    marginTop: 15,
    justifyContent: 'flex-start',
  },
  editR: {
    width: 26,
    marginTop: 15,
    marginRight: 20,
    justifyContent: 'flex-end',
  },
  editBtn: {
    width: 16,
    height: 16,
  },
});

module.exports = styles;
