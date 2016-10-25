import React from 'react';
import NativeModules from 'NativeModules';

const FileUpload = NativeModules.FileUpload;

class FileUploader {
  option = {
    uploadUrl: 'http://192.168.0.53:8000/image/upload',
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    fields: {
      'url': '/storage/emulated/0/Pictures/image-cdd531e0-4ea9-4db6-b966-3a8cfd8fd42f.jpg',
    },
    files: [],
  };

  upload(files) {
    this.option.files = [];
    this.option.files.push(files);

    console.log('File Info : ' + JSON.stringify(this.option.fields));

    FileUpload.upload(this.option, (error, result) => {
      console.log(error);
    });
  }
}

const fileUploader = new FileUploader();

module.exports = fileUploader;
