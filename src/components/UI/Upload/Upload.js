import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Upload.module.scss';

import UploadDrop from './UploadDrop';
import Modal from '../Modal/Modal';
import Input from '../InputComponents/Input';
import List from '../InputComponents/List';
import ListItem from '../InputComponents/ListItem';
import Button from '../Button/Button';
import Icon from '../InputComponents/Icon';
import Checkbox from '../InputComponents/Checkbox';
import CheckboxManager from '../InputComponents/CheckboxManager';
//firebase imports
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

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

  }

  state = {
    showModal: false,
    folders: []
  };

  componentDidMount() {
    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref(); // Create a storage reference from our storage service
    
    //get id from querystring
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get('id'); //get id in url query params
    if (id) {
      console.log('id: ', id);
    }

    // //current id folder
    this.currentIdRef = this.storageRef.child(id);

    // //save to state folder ref from firebase storage
    this.currentIdRef.listAll().then(res => {
      res.prefixes.forEach((folderRef) => {
        console.log('folder: ', folderRef.name);
        this.setState(prevState => {
          return { folders: [...prevState.folders, folderRef.name] };
        });
      });
    });
  }

  uploadHandler = (event) =>{
    event.preventDefault();
    console.log('uploadHandler');
  }
  addFolderHandler = (event)=>{
    event.preventDefault();
    console.log('addFolderHandler');
  }

  render() {

    return (
      <div className={classes.Upload}>
        
        <div className={[classes.Border].join(' ')}>
          <div className={classes.UploadHeader}>
            asdasdads
          </div>
          <div className={[classes.UploadActionButtons].join(' ')}>
            <Button type="Action" onClick={this.uploadHandler}><Icon iconstyle='fas' code='arrow-circle-up' size='lg' /> Upload file</Button>
            <Button type="WithPadding" onClick={this.addFolderHandler}><Icon iconstyle="fas" code="folder-plus" size="lg"/></Button>
          </div>  
          <CheckboxManager>
            {(this.state.folders.length || this.state.files.length)?
              <div className={classes.UploadBodyHeader}>
                <Checkbox></Checkbox>
                Name
              </div>
            :null}
            <div className={classes.UploadBody}>
              {
                <List value={ 
                  {
                    data: this.state.folders.map(item=>{
                    return <React.Fragment><Checkbox></Checkbox><ListItem aligntype="FlexStart"><Icon iconstyle='far' code='folder' size='lg' />{item}</ListItem></React.Fragment>;
                    })
                }
                }>
                </List>
              }
            </div>
          </CheckboxManager>
        </div>
        {/* upload modal for all instances */}
        <Modal
          label='Create folder'
          show={this.state.showModal}
          isInteractive={true}
          modalClosed={() => {
            this.setState({ showModal: false });
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
