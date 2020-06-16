import React, { Component } from 'react';
import classes from './ContactRead.module.scss';
import Utils from '../../Utils';
import * as actions from '../../store/actions/index';

import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
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
    fileList: [],
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
    await this.setState((prevState) => {
      return { firebaseRootRef: ref };
    });

    let files = [];
    await ref
      .child('public')
      .listAll()
      .then(async (res) => {
        if (res.items.length) {
          res.items.forEach((itemRef) => {
            // All the items under listRef.
            //console.log(`\t%cfile: ${itemRef.name}`,'background:cyan; color:black');
            files.push(itemRef);

            //console.log(`\t%call file name: ${files.map((item) => { return item.name;})}`,'background:cyan; color:black');
          });
        }
        files.forEach((item) => {
          console.log(`\t%cfiles: ${item}`, 'background:cyan; color:black');
        });
      });
    console.log('FILES: ', files);
    let filesHTML = files.map((item, index) => {
      console.log('item.name: ', item.name);
      return (
        <React.Fragment key={'filehtml' + index}>
          <ListItem title={item.name} displayText={item.name}></ListItem>
        </React.Fragment>
      );
    });
    await this.setState((prevState) => {
      return { fileList: filesHTML };
    });
  }

  render() {
    /* full contact details */
    let contact = null;
    let files = null;
    let fileList = this.state.fileList;

    if (this.props.activeContact) {
      let contactnumbers = this.props.activeContact['contactnumbers'].map(
        (each, index) => {
          return each !== '' ? (
            <ListItem displayText={each}></ListItem>
          ) : undefined;
        }
      );
      let emails = this.props.activeContact['emails'].map((each, index) => {
        return each !== '' ? (
          <ListItem displayText={each}></ListItem>
        ) : undefined;
      });

      // note the order of the render is important hence why manually setting the content order
      contact = (
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
          {/* <ComponentFactory
            data={{
              label: 'Gender',
              elementtype: 'input',
              value: { data: this.props.activeContact['gender'] },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Height',
              elementtype: 'input',
              value: { data: this.props.activeContact['height'] },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Weight',
              elementtype: 'input',
              value: { data: this.props.activeContact['weight'] },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Salary',
              elementtype: 'input',
              value: { data: this.props.activeContact['salary'].join('-') },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Date of birth',
              elementtype: 'input',
              value: {
                data: this.props.activeContact['dateofbirth']
              },
              readOnly: true
            }}
          /> */}
          <ComponentFactory
            data={{
              label: 'Contact number',
              component: 'list',
              value: { data: contactnumbers },
            }}
          />

          <ComponentFactory
            data={{
              label: 'Email',
              component: 'list',
              value: { data: emails },
            }}
          />

          {/* <ComponentFactory
            data={{
              label: 'Contact Preference',
              elementtype: 'input',
              value: { data: this.props.activeContact['contactpreference'] },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Newsletter',
              elementtype: 'input',
              value: {
                data: this.props.activeContact['newsletter']
                  .filter((each) => {
                    return each.value === true;
                  })
                  .map((item) => {
                    return item.key;
                  })
                  .join(', ')
              },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Social Media',
              elementtype: 'list',
              value: {
                data: this.props.activeContact['socialmedia'].map((each) => {
                  return (
                    <InputWithInput
                      attribute={each.key}
                      value={each.value}
                      readOnly></InputWithInput>
                  );
                })
              },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Notes',
              elementtype: 'input',
              value: { data: this.props.activeContact['notes'] },
              readOnly: true
            }}
          /> */}
          {/* <ComponentFactory
            data={{
              label: 'Hide profile',
              elementtype: 'input',
              value: { data: this.props.activeContact['privateprofile'] },
              readOnly: true
            }}
          /> */}
        </React.Fragment>
      );

      files = (
        <React.Fragment>
          <ComponentFactory
            data={{
              label: 'Files',
              component: 'list',
              value: { data: fileList },
            }}
          />
        </React.Fragment>
      );
    }

    return (
      <div className={this.className}>
        {this.props.isLoading && !this.props.activeContact ? (
          <Spinner />
        ) : (
          <DefaultPageLayout label='Contact'>
            <Tabs>
              <div label='a'>
                <Card>{contact}</Card>
              </div>
              <div label='b'>
                <Card>{files}</Card>
              </div>
            </Tabs>
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
