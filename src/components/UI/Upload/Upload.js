import React, { Component } from 'react';
import classes from './Upload.module.scss';
import UploadDrop from './UploadDrop';
import { withRouter } from 'react-router-dom';
//firebase imports
import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.firebaseConfig = {
      apiKey: 'AIzaSyBcmwi6R0CaeY9l1jfEUo0u71MZsVxldKo',
      authDomain: 'react-crud-1db4b.firebaseapp.com',
      databaseURL: 'https://react-crud-1db4b.firebaseio.com',
      projectId: 'react-crud-1db4b',
      storageBucket: 'react-crud-1db4b.appspot.com',
      messagingSenderId: '44556258250',
      appId: '1:44556258250:web:f756e981ee135db270dd33',
      measurementId: 'G-QJZQEZMV2J'
    };
    try {
      console.log('initializing firebase');
      firebase.initializeApp(this.firebaseConfig);
    } catch {
      console.log('already exists...');
    }
  }

  state = {
    folders: []
  };

  componentDidMount() {
    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref(); // Create a storage reference from our storage service

    const query = new URLSearchParams(this.props.location.search);
    const id = query.get('id'); //get id in url query params
    if (id) {
      console.log('id: ', id);
    }

    //create a child reference
    this.imagesRef = this.storageRef.child('images');

    //current id folder
    this.currentIdRef = this.imagesRef.child(id);

    this.currentIdRef.listAll().then(res => {
      res.prefixes.forEach((folderRef, index) => {
        console.log('folder: ', folderRef.name);
        this.setState(prevState => {
          let currFolders = [...prevState.folders];
          currFolders[index] = folderRef.name;

          return { folders: currFolders };
        });
      });
    });
  }

  render() {
    console.log('state.folders: ', this.state.folders);
    return this.state.folders.map(item => {
      return item;
    });
  }
}
export default withRouter(Upload);
