import React, { Component } from 'react';
import classes from './ProfileRead.module.scss';
import * as align from '../../shared/alignFlex.module.scss';

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
import Button from '../../components/UI/Button/Button';
import Icon from '../../components/UI/InputComponents/Icon';
import Modal from '../../components/UI/Modal/Modal';
//styling
import buttonStyle from '../../components/UI/Button/Button.module.scss';
import FlexRow from '../../hoc/Layout/FlexRow';

//helpers
import * as Blob from '../../shared/blob';
import * as FirebaseHelper from '../../shared/firebaseHelper';
import * as Clipboard from '../../shared/clipboard';

//firebase imports
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

class ProfileRead extends Component {
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
      classes.ProfileRead,
      'ProfileRead',
      props.className,
    ]);
  }

  state = {
    id: null,
    isLoading: true,
    firebaseFolders: null,
    activeTab: 'profile',
    showClipboardModal: false,
  };

  async componentDidMount() {
    //hide the toolbar
    this.props.hideToolbar(true);

    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref(); // Create a storage reference from our storage service

    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');
    let ref = this.storageRef;
    if (id) {
      this.props.onFetchProfile(id);
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
            hovereffect={true}
            align={align.JustifyContentSpaceBetween}
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();
              console.log('VIEW CLICKED: ', file);
              const url = await FirebaseHelper.urlFromRef(file);
              console.log('URL: ', url);
              window.open(url, '_blank');
            }}
            title={file.name}>
            <FlexRow>
              <Icon iconstyle='far' code='file' size='lg' />
              <p>{file.name}</p>
            </FlexRow>
            <FlexRow spacingChildren='left'>
              <Button
                className={buttonStyle.NoStyle}
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  console.log('VIEW CLICKED: ', file);
                  const url = await FirebaseHelper.urlFromRef(file);
                  window.open(url, '_blank');
                }}
                title='open as external link'>
                <Icon iconstyle='fas' code='external-link-alt' size='sm' />
              </Button>
              {/* downloads assets to drive */}
              <Button
                className={buttonStyle.NoStyle}
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  console.log('DOWNLOAD CLICKED');
                  const url = await FirebaseHelper.urlFromRef(file);
                  const blob = await Blob.getFileBlob(url);
                  const dl = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  document.body.appendChild(a);
                  a.href = dl;
                  a.download = file.name;
                  a.click();

                  // Cleanup
                  window.URL.revokeObjectURL(a.href);
                  document.body.removeChild(a);
                }}
                title='download file'>
                <Icon iconstyle='fas' code='download' size='sm' />
              </Button>
            </FlexRow>
          </ListItem>
        );
      });
      console.log('OLD FOLDERS: ', oldFolders);

      return {
        firebaseFolders: oldFolders,
      };
    });
  };

  render() {
    let data = null;
    if (this.props.activeProfile) {
      switch (this.state.activeTab) {
        case 'profile':
          data = (
            <React.Fragment>
              {/* <ComponentFactory
                data={{
                  label: 'Name',
                  component: 'input',
                  value: { data: this.props.activeProfile['name'] },
                  readOnly: true,
                }}
              /> */}
              <ComponentFactory
                data={{
                  label: 'Name',
                  component: 'raw',
                  value: (
                    <ListItem align={align.JustifyContentSpaceBetween}>
                      <FlexRow>
                        <p>{this.props.activeProfile['name']}</p>
                      </FlexRow>
                      <FlexRow>
                        <Button
                          className={buttonStyle.NoStyle}
                          onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('Copy to clipboard');
                            Clipboard.copyStringToClipboard(
                              this.props.activeProfile['name']
                            );
                            this.setState({ showClipboardModal: true });
                            setTimeout(() => {
                              this.setState({ showClipboardModal: false });
                            }, 1000);
                          }}
                          title='copy to clipboard'>
                          <Icon iconstyle='far' code='clipboard' size='sm' />
                        </Button>
                      </FlexRow>
                    </ListItem>
                  ),
                }}
              />
              <ComponentFactory
                data={{
                  label: 'Last name',
                  component: 'raw',
                  value: (
                    <ListItem align={align.JustifyContentSpaceBetween}>
                      <FlexRow>
                        <p>{this.props.activeProfile['lastname']}</p>
                      </FlexRow>
                      <FlexRow>
                        <Button
                          className={buttonStyle.NoStyle}
                          onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            console.log('Copy to clipboard');
                            this.setState({ showClipboardModal: true });
                            setTimeout(() => {
                              this.setState({ showClipboardModal: false });
                            }, 1000);
                            Clipboard.copyStringToClipboard(
                              this.props.activeProfile['lastname']
                            );
                          }}
                          title='copy to clipboard'>
                          <Icon iconstyle='far' code='clipboard' size='sm' />
                        </Button>
                      </FlexRow>
                    </ListItem>
                  ),
                  readOnly: true,
                }}
              />
              <ComponentFactory
                data={{
                  label: 'Contact number',
                  component: 'list',
                  value: {
                    data: this.props.activeProfile['contactnumbers'].map(
                      (each, index) => {
                        return each !== '' ? (
                          <ListItem align={align.JustifyContentSpaceBetween}>
                            <FlexRow>
                              <p>{each}</p>
                            </FlexRow>
                            <FlexRow>
                              <Button
                                className={buttonStyle.NoStyle}
                                onClick={async (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  console.log('Copy to clipboard');
                                  this.setState({ showClipboardModal: true });
                                  setTimeout(() => {
                                    this.setState({
                                      showClipboardModal: false,
                                    });
                                  }, 1000);
                                  Clipboard.copyStringToClipboard(each);
                                }}
                                title='copy to clipboard'>
                                <Icon
                                  iconstyle='far'
                                  code='clipboard'
                                  size='sm'
                                />
                              </Button>
                            </FlexRow>
                          </ListItem>
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
                    data: this.props.activeProfile['emails'].map(
                      (each, index) => {
                        return each !== '' ? (
                          <ListItem align={align.JustifyContentSpaceBetween}>
                            <FlexRow>
                              <p>{each}</p>
                            </FlexRow>
                            <FlexRow>
                              <Button
                                className={buttonStyle.NoStyle}
                                onClick={async (event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  console.log('Copy to clipboard');
                                  Clipboard.copyStringToClipboard(each);
                                  this.setState({ showClipboardModal: true });
                                  setTimeout(() => {
                                    this.setState({
                                      showClipboardModal: false,
                                    });
                                  }, 1000);
                                }}
                                title='copy to clipboard'>
                                <Icon
                                  iconstyle='far'
                                  code='clipboard'
                                  size='sm'
                                />
                              </Button>
                            </FlexRow>
                          </ListItem>
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
                    data: this.props.activeProfile['contactpreference'],
                  },
                  readOnly: true,
                }}
              />
            </React.Fragment>
          );
          break;
        case 'documents':
          data = (
            <React.Fragment>
              <Accordion
                allowMultiOpen={true}
                hovereffect={true}
                openOnStartIndex={-1} //zero-index, negative value or invalid index to not open on start,
              >
                {this.state.firebaseFolders.map((item, index) => {
                  return (
                    <div
                      key={'file' + index}
                      label={item.folder.name}
                      onClick={
                        //console.log('CLICKED: ', folderRef);
                        this.getFiles.bind(this, item.folder, index)
                      }>
                      <List
                        value={{
                          data: item.files,
                        }}></List>
                    </div>
                  );
                })}
              </Accordion>
            </React.Fragment>
          );
          break;
        case 'appointments':
          data = <React.Fragment></React.Fragment>;
          break;
        default:
          data = undefined;
      }
    }

    return (
      <div className={this.className}>
        {this.props.isLoading && !this.props.activeProfile ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Modal show={this.state.showClipboardModal}>
              <FlexRow justifyContent='center'>
                <p>Copied to clipboard</p>
              </FlexRow>
            </Modal>
            {this.props.activeProfile ? (
              <DefaultPageLayout
                label={`${this.props.activeProfile['name']} ${this.props.activeProfile['lastname']}`}>
                <Tabs
                  tabheaders={['profile', 'documents', 'appointments']}
                  onClick={this.tabClickHandler}
                />
                <Card>{data}</Card>
              </DefaultPageLayout>
            ) : null}
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    storedPhonebook: state.profile.phoneBook,
    isLoading: state.profile.loading,
    activeProfile: state.profile.activeProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: (id) => {
      dispatch(actions.processFetchProfile(id));
    },

    hideToolbar: (bool) => {
      dispatch(actions.hasToolbar(bool));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileRead);
