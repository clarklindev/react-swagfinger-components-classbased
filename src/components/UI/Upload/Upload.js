import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Upload.module.scss';

import UploadDrop from './UploadDrop';
import Select from '../InputComponents/Select';
import Button from '../Button/Button';
import Icon from '../InputComponents/Icon';
import Modal from '../Modal/Modal';
import Input from '../InputComponents/Input';

//firebase imports
import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';

class Upload extends PureComponent {
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

    this.uploadconfig = {
      name: this.props.name,
      label: this.props.label,
      value: { data: this.state.selectedfolder },
      elementconfig: {
        placeholder: 'select a folder',
        options: []
      },
      readOnly: false,
      validation: null,
      onChange: event => {
        let targetval = event.target.value;

        //check if its creating folder...
        if (targetval === this.CREATEFOLDER) {
          console.log('CREATING A FOLDER');
          this.setState({ showModal: true, createfoldername: '' });
        } else {
          console.log('CHANGED SELECTION');
          this.setState({ selectedfolder: targetval });
        }
      }
    };
  }

  state = {
    folders: [],
    selectedfolder: '',
    showModal: false,
    createfoldername: ''
  };
  CREATEFOLDER = '***newfolder***';

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

  updateCreateFolderName = event => {
    let updatedValue = event.target.value;
    console.log('updatedValue: ', updatedValue);
    this.setState({ createfoldername: updatedValue });
  };

  addFolderToSelect = () => {
    let updatedFolders = [...this.state.folders];
    if (this.state.createfoldername.length) {
      updatedFolders.push(this.state.createfoldername);
    }
    this.setState({
      folders: updatedFolders,
      selectedfolder: this.state.createfoldername
    });
  };

  render() {
    let config = { ...this.uploadconfig };
    config.value = { data: this.state.selectedfolder };

    let updatedelementconfig = { ...config.elementconfig };
    updatedelementconfig.options = this.state.folders.map(item => {
      // console.log('POOOP: ', item);
      return { value: item, displaytext: item };
    });
    updatedelementconfig.options.push({
      value: this.CREATEFOLDER,
      displaytext: '[add new folder]'
    });
    config.elementconfig = updatedelementconfig;

    console.log('new createfoldername: ', this.state.createfoldername);

    return (
      <div className={classes.Upload}>
        {config.elementconfig.options.length ? (
          <div className={classes.FlexGroupRow}>
            <Select {...config}></Select>
          </div>
        ) : null}
        {/* <Button
          title='Add'
          type='WithBorder'
          onClick={event => {
            event.preventDefault();
            this.setState({ showModal: true, createfoldername: '' });
          }}
        >
          <Icon iconstyle='fas' code='plus' size='sm' />
          <p>Add Folder</p>
        </Button> */}

        <Modal
          label='Create folder'
          show={this.state.showModal}
          isInteractive={true}
          modalClosed={() => {
            this.setState({ showModal: false, createfoldername: '' });
          }}
          continue={() => {
            console.log('continue');
            this.addFolderToSelect();
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
