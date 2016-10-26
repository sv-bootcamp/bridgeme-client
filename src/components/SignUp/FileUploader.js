import React from 'react';
import NativeModules from 'NativeModules';

const FileUpload = NativeModules.FileUpload;

class FileUploader {
  option = {
    uploadUrl: 'http://192.168.0.53:8000/users/edit',
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
      console.log(error);
    });
  }
}

module.exports = FileUploader;
