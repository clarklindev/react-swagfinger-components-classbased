import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Upload.module.scss';

import UploadDrop from './UploadDrop';
import Select from '../InputComponents/Select';
import Button from '../Button/Button';
import Icon from '../InputComponents/Icon';
import Modal from '../Modal/Modal';
import Input from '../InputComponents/Input';
import Accordion from '../InputComponents/Accordion';

//firebase imports
import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';

class Upload extends PureComponent {
  CREATEFOLDER = '***newfolder***';

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

    this.selectconfig = {
      name: this.props.name,
      label: this.props.label,
      value: { data: '' }, //default value which will match selects' placeholder text
      elementconfig: {
        placeholder: 'select a folder',
        options: []
      },
      readOnly: false,
      validation: null
    };

    this.accordionconfig = {
      value: [],
      allowMultiOpen: false,
      openOnStartIndex: -1 //zero-index, negative value or invalid index to not open on start,
    };
  }
  state = {
    folders: [], //select
    selectedFolders: [], //accordion - removed items from 'folders',
    createfoldername: '',
    showModal: false
  };

  componentDidMount() {
    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref(); // Create a storage reference from our storage service
    //create a child reference 'images'
    this.imagesRef = this.storageRef.child('images');

    const query = new URLSearchParams(this.props.location.search);
    const id = query.get('id'); //get id in url query params
    if (id) {
      console.log('id: ', id);
    }

    //current id folder
    this.currentIdRef = this.imagesRef.child(id);

    //save to state folder ref from firebase storage
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

  addFolderToSelect = newfolder => {
    if (newfolder.length) {
      this.setState({
        folders: [...this.state.folders, newfolder]
      });
    }
  };

  uploadSelectChangeHandler = event => {
    let targetval = event.target.value;

    //check if its creating folder...
    if (targetval === this.CREATEFOLDER) {
      console.log('CREATING A FOLDER');
      this.setState({ showModal: true, createfoldername: '' });
    } else {
      console.log('CHANGED SELECTION');

      let currentFolders = [...this.state.folders];
      let filteredFolders = currentFolders.filter(item => {
        console.log('item: ', item, '| targetval: ', targetval);
        return item !== targetval;
      });
      console.log('UPDATED Folders: ', filteredFolders);
      this.setState(prevState => {
        return {
          folders: filteredFolders,
          selectedFolders: [...prevState.selectedFolders, targetval]
        };
      });
    }
  };
  render() {
    let selectconfig = { ...this.selectconfig };
    // //update selectconfig.elementconfig
    const selectmandatoryconfig = {
      value: this.CREATEFOLDER,
      displaytext: '[add new folder]'
    };
    const selectoptionalconfig = this.state.folders.map(item => {
      return { value: item, displaytext: item };
    });
    let selectelementconfig = { ...selectconfig.elementconfig };
    selectelementconfig.options = [
      selectmandatoryconfig,
      ...selectoptionalconfig
    ];
    //assign back to config
    selectconfig.elementconfig = selectelementconfig;

    //accordion
    let accordionconfig = { ...this.accordionconfig };
    accordionconfig.value = this.state.selectedFolders.map(item => {
      return {
        title: item,
        content: item
      };
    });

    return (
      <div className={classes.Upload}>
        <div className={classes.FlexGroupRow}>
          <Select
            {...selectconfig}
            onChange={this.uploadSelectChangeHandler}
          ></Select>
        </div>

        <div className={classes.FlexGroupRow}>
          <Accordion {...accordionconfig}></Accordion>
        </div>

        {/* {this.state.selectedfolder ? (
          <UploadDrop name={this.props.name}></UploadDrop>
        ) : null} */}

        {/* upload modal for all instances */}
        <Modal
          label='Create folder'
          show={this.state.showModal}
          isInteractive={true}
          modalClosed={() => {
            this.setState({ showModal: false, createfoldername: '' });
          }}
          continue={() => {
            console.log('continue');
            this.addFolderToSelect(this.state.createfoldername);
            this.setState({ showModal: false });
          }}
        >
          <Input
            value={{ data: this.state.createfoldername }}
            placeholder='Folder name'
            onChange={event => {
              event.preventDefault();
              console.log('typed: ', event.target.value);
              let targetVal = event.target.value;

              this.setState(prevState => {
                return {
                  createfoldername: targetVal
                };
              });
            }}
          />
        </Modal>
      </div>
    );
  }
}
export default withRouter(Upload);
