import React, { Component } from 'react';
import classes from './ContactRead.module.scss';
import Utils from '../../Utils';
import * as actions from '../../store/actions/index';

import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import Accordion from '../../components/UI/InputComponents/Accordion';
import List from '../../components/UI/InputComponents/List';
import ListItem from '../../components/UI/InputComponents/ListItem';
import Spinner from '../../components/UI/Loaders/Spinner';
import { connect } from 'react-redux';
import Card from '../../components/UI/Card/Card';
import Tabs from '../../components/UI/Tabs/Tabs';

//firebase imports
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

class ContactRead extends Component {
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
      measurementId: 'G-QJZQEZMV2J',
    };
    try {
      console.log('\t%cinitializing firebase', 'background:white; color:red');
      firebase.initializeApp(this.firebaseConfig);
    } catch {
      console.log('\t%calready exists...', 'background:white; color:red');
    }
    this.uploadRef = React.createRef();

    this.className = Utils.getClassNameString([
      classes.ContactRead,
      'ContactRead',
      props.className,
    ]);
  }

  state = {
    id: null,
    isLoading: true,
    firebaseFolders: null,
    activeTab: 'profile',
  };

  async componentDidMount() {
    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref(); // Create a storage reference from our storage service

    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');
    let ref = this.storageRef;
    if (id) {
      this.props.onFetchContact(id);
      ref = this.storageRef.child(id);
    }
    console.log(
      `\t%cSETSTATE: {firebaseRootRef:${ref}}`,
      'background:yellow; color:red'
    );
    let res = await ref.child('public').listAll();

    //folders is an array of objects {folder, files:[]}
    let firebaseFolders = [];
    if (res.prefixes.length) {
      res.prefixes.forEach((folder) => {
        //get content for each folder
        firebaseFolders.push({ folder: folder, files: [] });
      });
      console.log('FOLDERS: ', firebaseFolders);
    }

    await this.setState((prevState) => {
      return {
        firebaseRootRef: ref,
        firebaseFolders: firebaseFolders,
      };
    });
  }

  tabClickHandler = (clicked) => {
    this.setState({ activeTab: clicked });
  };

  getFiles = async (folderRef, index) => {
    console.log('getFiles function:', index);
    let res = await folderRef.listAll();

    this.setState((prevState) => {
      let oldFolders = [...prevState.firebaseFolders];
      console.log('BASE: ', oldFolders);

      oldFolders[index].files = res.items.map((file, index) => {
        return (
          <ListItem
            key={'file' + index}
            displayText={file.name}
            title={file.name}
          />
        );
      });
      console.log('OLD FOLDERS: '.oldFolders);

      return {
        firebaseFolders: oldFolders,
      };
    });
  };

  render() {
    let data = null;
    if (this.props.activeContact) {
      switch (this.state.activeTab) {
        case 'profile':
          data = (
            <React.Fragment>
              <ComponentFactory
                data={{
                  label: 'Name',
                  component: 'input',
                  value: { data: this.props.activeContact['name'] },
                  readOnly: true,
                }}
              />
              <ComponentFactory
                data={{
                  label: 'Last name',
                  component: 'input',
                  value: { data: this.props.activeContact['lastname'] },
                  readOnly: true,
                }}
              />
              <ComponentFactory
                data={{
                  label: 'Contact number',
                  component: 'list',
                  value: {
                    data: this.props.activeContact['contactnumbers'].map(
                      (each, index) => {
                        return each !== '' ? (
                          <ListItem displayText={each}></ListItem>
                        ) : undefined;
                      }
                    ),
                  },
                }}
              />
              <ComponentFactory
                data={{
                  label: 'Email',
                  component: 'list',
                  value: {
                    data: this.props.activeContact['emails'].map(
                      (each, index) => {
                        return each !== '' ? (
                          <ListItem displayText={each}></ListItem>
                        ) : undefined;
                      }
                    ),
                  },
                }}
              />
              <ComponentFactory
                data={{
                  label: 'Contact Preference',
                  component: 'input',
                  value: {
                    data: this.props.activeContact['contactpreference'],
                  },
                  readOnly: true,
                }}
              />
            </React.Fragment>
          );
          break;
        case 'history':
          data = (
            <React.Fragment>
              <Accordion
                allowMultiOpen={true}
                openOnStartIndex={-1} //zero-index, negative value or invalid index to not open on start,
                onClick={(folderRef, index) => {
                  console.log('CLICKED: ', folderRef);
                  this.getFiles(folderRef, index);
                }}
              >
                {this.state.firebaseFolders.map((item, index) => {
                  return (
                    <div
                      key={'file' + index}
                      label={item.folder.name}
                      firebaseRef={item.folder}
                    >
                      <List
                        value={{
                          data: item.files,
                        }}
                      ></List>
                    </div>
                  );
                })}
              </Accordion>
            </React.Fragment>
          );
          break;
        default:
          data = undefined;
      }
    }

    return (
      <div className={this.className}>
        {this.props.isLoading && !this.props.activeContact ? (
          <Spinner />
        ) : (
          <DefaultPageLayout label='CLIENT'>
            <Tabs
              tabheaders={['profile', 'history']}
              onClick={this.tabClickHandler}
            />
            <Card>{data}</Card>
          </DefaultPageLayout>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    storedPhonebook: state.contact.phoneBook,
    isLoading: state.contact.loading,
    activeContact: state.contact.activeContact,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchContact: (id) => {
      dispatch(actions.processFetchSingleContact(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactRead);
