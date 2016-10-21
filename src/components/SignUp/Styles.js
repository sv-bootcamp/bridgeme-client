import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  formEditView: {
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
    paddingBottom: 15,
  },

  formView: {
    width: 320,
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
    height: 24,
  },

  formEditDate: {
    width: 100,
    height: 30,
    borderWidth: 0,
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
    width: 16,
    marginTop: 15,
    justifyContent: 'flex-end',
  },

  editBtn: {
    width: 16,
    height: 16,
  },

});

module.exports = styles;
