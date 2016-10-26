import React from 'react';
import NativeModules from 'NativeModules';

const FileUpload = NativeModules.FileUpload;

class FileUploader {
  option = {
    uploadUrl: 'http://192.168.0.53:8000/image/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    fields: {

    },
    files: [],
  };

  upload(files) {
    this.option.files = [];
    this.option.files.push(files);

    console.log('File Info : ' + JSON.stringify(this.option.files));

    FileUpload.upload(this.option, (error, result) => {
      console.log(error);
    });
  }
}

const fileUploader = new FileUploader();

module.exports = fileUploader;
