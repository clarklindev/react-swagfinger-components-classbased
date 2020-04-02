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
    folders: [],
    files: [],
    checkedFolders: [],
    checkedFiles: [],
    mainChecked: false,
    mainIndeterminate: false
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
      res.prefixes.forEach(folderRef => {
        console.log('folder: ', folderRef.name);
        this.setState(prevState => {
          return {
            ...prevState,
            folders: [...prevState.folders, folderRef.name]
          };
        });
      });
      res.items.forEach(itemRef => {
        // All the items under listRef.
        this.setState(prevState => {
          return {
            ...prevState,
            files: [...prevState.files, itemRef.name]
          };
        });
      });
    });
  }

  uploadHandler = event => {
    event.preventDefault();
    console.log('uploadHandler');
  };
  addFolderHandler = event => {
    event.preventDefault();
    console.log('addFolderHandler');
    this.setState({ showModal: true });
  };

  fileCheckHandler = (index, isChecked, event = null) => {
    console.log('onChangeHandler CLICKED: ', index, isChecked);
    this.setState(prevState => {
      let files = [...prevState.checkedFiles];
      files[index] = isChecked;
      return { checkedFiles: files };
    }, this.checkIndeterminate);
  };

  folderCheckHandler = (index, isChecked, event = null) => {
    console.log('onChangeHandler CLICKED: ', index, isChecked);
    this.setState(prevState => {
      let folders = [...prevState.checkedFolders];
      folders[index] = isChecked;
      return { checkedFolders: folders };
    }, this.checkIndeterminate);
  };

  toggleCheckAllFolders = isChecked => {
    this.setState(prevState => {
      let folders = [...prevState.folders];
      let result = folders.map(item => {
        return isChecked;
      });
      console.log('checkAllFolders: ', result);
      return { checkedFolders: result };
    });
  };

  toggleCheckAllFiles = isChecked => {
    this.setState(prevState => {
      let files = [...prevState.files];
      let result = files.map(item => {
        return isChecked;
      });
      console.log('checkedFiles: ', result);
      return { checkedFiles: result };
    });
  };

  toggleMainChecked = checked => {
    console.log('toggleMainChecked');
    this.toggleCheckAllFolders(!checked);
    this.toggleCheckAllFiles(!checked);
    this.setState(prevState => {
      return { mainChecked: !prevState.mainChecked };
    });
  };

  updateCheck = index => {
    console.log('updateCheck: ', index);
  };

  checkIndeterminate = () => {
    console.log('checkIndeterminate!!!!');

    let checkedFolderLength = this.state.checkedFolders.filter(item => {
      return item === true;
    }).length;

    let checkedFileLength = this.state.checkedFiles.filter(item => {
      return item === true;
    }).length;

    let checkedItems = checkedFolderLength + checkedFileLength;
    let allItems = this.state.files.length + this.state.folders.length;

    if (checkedItems === allItems) {
      this.setState({ mainIndeterminate: false, mainChecked: true });
    } else if (checkedItems === 0) {
      this.setState({ mainIndeterminate: false, mainChecked: false });
    } else {
      this.setState({ mainIndeterminate: true });
    }
  };

  render() {
    let currentFolderData = [
      ...this.state.folders.map((item, index) => {
        console.log(`folder [${index}]: ${this.state.checkedFolders[index]}`);
        return (
          <React.Fragment>
            <Checkbox
              onChange={(index, checked) =>
                this.folderCheckHandler(index, checked)
              }
              index={index}
              checked={this.state.checkedFolders[index]}
            ></Checkbox>
            <ListItem aligntype="FlexStart">
              <Icon iconstyle="far" code="folder" size="lg" />
              {item}/
            </ListItem>
          </React.Fragment>
        );
      }),
      ...this.state.files.map((item, index) => {
        return (
          <React.Fragment>
            <Checkbox
              onChange={(index, checked) =>
                this.fileCheckHandler(index, checked)
              }
              index={index}
              checked={this.state.checkedFiles[index]}
            ></Checkbox>
            <ListItem aligntype="FlexStart">
              <Icon iconstyle="far" code="file" size="lg" />
              {item}
            </ListItem>
          </React.Fragment>
        );
      })
    ];

    return (
      <div className={classes.Upload}>
        <div className={[classes.Border].join(' ')}>
          <div className={classes.UploadHeader}>
            <div className={classes.UploadUrl}>asdasdasdasd</div>
            <div className={[classes.UploadActionButtons].join(' ')}>
              <Button type="Action" onClick={this.uploadHandler}>
                <Icon iconstyle="fas" code="arrow-circle-up" size="lg" /> Upload
                file
              </Button>
              <Button type="LastItemRight" onClick={this.addFolderHandler}>
                <Icon iconstyle="fas" code="folder-plus" size="lg" />
              </Button>
            </div>
          </div>
          {this.state.folders.length ? (
            <React.Fragment>
              <div className={classes.UploadBodyHeader}>
                <Checkbox
                  index={0}
                  checked={this.state.mainChecked}
                  indeterminate={this.state.mainIndeterminate}
                  onChange={() => {
                    this.toggleMainChecked(this.state.mainChecked);
                  }}
                ></Checkbox>
                Name
              </div>

              <div className={classes.UploadBody}>
                {
                  <List
                    value={{
                      data: currentFolderData
                    }}
                  ></List>
                }
              </div>
            </React.Fragment>
          ) : null}
        </div>

        {/* upload modal for all instances */}
        <Modal
          label="Create folder"
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
            placeholder="Folder name"
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
