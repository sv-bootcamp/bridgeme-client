import Actions from 'react-native-router-flux';
import NativeModules from 'NativeModules';
import React from 'react';
import UrlMeta from '../../utils/UrlMeta';

const FileUpload = NativeModules.FileUpload;

// This component is for multipart upload.
class FileUploader {
  option = {
    uploadUrl: UrlMeta.host + UrlMeta.API_USER_EDIT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    fields: null,
    files: null,
  };

  upload(files, fields) {
    this.option.files = files;
    this.option.fields = {info: escape(JSON.stringify(fields))};

    FileUpload.upload(this.option, (error, result) => {
      if (error) {
        alert(error);
      } else {
        
      }
    });
  }
}

module.exports = FileUploader;
