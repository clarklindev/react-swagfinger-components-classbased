import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Upload.module.scss';
import Modal from '../Modal/Modal';
import Input from '../InputComponents/Input';
import List from '../InputComponents/List';
import ListItem from '../InputComponents/ListItem';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Checkbox from '../InputComponents/Checkbox';
import Breadcrumb from '../../Navigation/Breadcrumb';

//helpers
import * as Blob from '../../../shared/blobHelper';
import * as FirebaseHelper from '../../../shared/firebaseHelper';
import * as Clipboard from '../../../shared/clipboardHelper';

//firebase imports
import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll } from 'firebase/storage';

//styling
import buttonStyle from '../../UI/Button/Button.module.scss';

class Upload extends PureComponent {
  constructor(props) {
    super(props);
    this.firebaseConfig = {
      apiKey: 'AIzaSyDJ6sMYnxypEtTkLaXEmUHq-y9bVeJ0K3c',
      authDomain: 'react-crud-1db4b.firebaseapp.com',
      databaseURL: 'https://react-crud-1db4b.firebaseio.com',
      projectId: 'react-crud-1db4b',
      storageBucket: 'react-crud-1db4b.appspot.com',
      messagingSenderId: '44556258250',
      appId: '1:44556258250:web:f756e981ee135db270dd33',
      measurementId: 'G-QJZQEZMV2J',
    };

    const app = initializeApp(this.firebaseConfig);
    this.storage = getStorage(app);
    this.storageRef = ref(this.storage);
    this.uploadRef = React.createRef();
    console.log(
      '%cEND==============================================',
      'background:white; color:red'
    );
  }

  state = {
    //firebase
    allFolderList: [], //all firebase folders from current ref onwards(recursive)
    firebaseFolders: [], //should store refs of current folder
    firebaseFiles: [], //should store refs of current folder
    firebaseRootRef: null,
    firebaseIDRef: null,
    //local state
    currentFolderDrilldownRefs: [], //for edit modal
    currentFolderRef: null, //set when changeFolderPath() called
    currentFolderPath: null, //set when changeFolderPath() called   //used for when editing in the modal state
    placeholderFolders: [], //placeholder folder not in firebase, stores an array of obj {pathRef:, folders:[]}
    selectedFiles: [], //files added for upload
    uploadUrlOver: false,

    //is checked?
    mainChecked: false,
    mainIndeterminate: false,
    checkedFolders: [], //all checked folders in current folder
    checkedFiles: [], //all checked files in current folder
    checkedPlaceholderFolders: [], //temporary folders not in firebase yet
    checkedFile: null,

    //modal
    createFolderModal: false,
    createFolderName: '',
    tempFolderPath: null,
    editBreadcrumbModal: false,
    errorModalMessage: null,
    renameFileModal: false,
    renamedFilename: '',
    renamedFilenameExtension: '',
    showClipboardModal: false,
  };

  async componentDidMount() {
    console.log(
      '%cSTART FUNCTION componentDidMount==============================================',
      'background:white; color:red'
    );
    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    //get id from querystring
    //const query = new URLSearchParams(this.props.location.search);
    const id = '-M04kd8a-Z18lYB_XfGo'; //query.get('id'); //get id in url query params

    let myRef = ref(this.storageRef);

    if (id) {
      // //current id folder
      myRef = ref(this.storageRef, id);
    }
    console.log('storageRef:', this.storageRef);
    console.log('myRef:', myRef);
    console.log('myRef._location.path_:', myRef._location.path_);

    await this.setState((prevState) => {
      return { firebaseRootRef: this.storageRef, firebaseIDRef: myRef };
    });

    await this.changeFolderPath(myRef);
    await this.getAllFolders(myRef);
  }

  changeFolderPath = async (ref) => {
    console.log(
      '%cSTART FUNCTION changeFolderPath==============================================',
      'background:orange; color:white'
    );
    console.log(`\t%cprops: ${ref}`, 'background:orange; color:white');

    if (ref !== this.state.currentFolderRef) {
      await this.setCurrentFolderRef(ref); //sets state.currentFolderRef , state.currentFolderPath
      console.log(`\t%cSETSTATE: `, 'background:yellow; color:red');
      console.log(`\t%cmainChecked:${false}`, 'background:yellow; color:red');
      console.log(
        `\t%cmainIndeterminate:${false}`,
        'background:yellow; color:red'
      );
      console.log(`\t%ccheckedFolders:[]`, 'background:yellow; color:red');
      console.log(`\t%ccheckedFiles:[]`, 'background:yellow; color:red');
      console.log(
        `\t%ccheckedPlaceholderFolders:[]`,
        'background:yellow; color:red'
      );
      //reset checked folders and files
      await this.setState((prevState) => {
        return {
          mainChecked: false,
          mainIndeterminate: false,
          checkedFolders: [], //all checked folders in current folder
          checkedFiles: [], //all checked files in current folder
          checkedPlaceholderFolders: [], //all checked temporary folders (not in firebase yet) in current folder
        };
      });

      //go through exisiting references, look for current reference (===) the ref from props,
      let index = this.state.currentFolderDrilldownRefs.findIndex((item) => {
        return item === ref;
      });
      console.log(
        `\t%cindex in currentFolderDrilldownRefs: ${index}`,
        'background:orange; color:white'
      );
      //if it is found, then slice off from currentFolderDrilldownRefs onwards...(we navigated back)...
      //else if not found, then add to currentFolderDrilldownRefs.
      index > -1
        ? await this.updateFolderDrilldown(ref)
        : await this.addCurrentFolderToDrilldown(ref);

      console.log(
        `\t%cbefore getFolderData...`,
        'background:orange; color:white'
      );
      await this.getFolderData(ref); // from ref.. sets firebaseFolders, firebaseFiles
      console.log(
        `\t%cafter getFolderData...`,
        'background:orange; color:white'
      );

      console.log(
        `\t%c!! state.firebaseFolders: ${this.state.firebaseFolders}`,
        'background:orange; color:white'
      );
      console.log(
        `\t%c!! state.firebaseFiles: ${this.state.firebaseFiles}`,
        'background:orange; color:white'
      );
      await this.removeDuplicateFolders();
    } else {
      console.log(
        `\t%cSAME FOLDER...DO NOTHING`,
        'background:orange; color:white'
      );
    }

    console.log(
      '%cEND==============================================',
      'background:orange; color:white'
    );
  };

  setCurrentFolderRef = async (ref) => {
    console.log(
      '%cSTART FUNCTION setCurrentFolderRef==============================================',
      'background:pink; color:black'
    );
    console.log(`\t%cprops: ${ref}`, 'background:pink; color:black');
    console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
    console.log(`\t%ccurrentFolderRef:${ref}`, 'background:yellow; color:red');
    console.log(
      `\t%ccurrentFolderPath:${ref._location.path_}`,
      'background:yellow; color:red'
    );
    await this.setState((prevState) => {
      return { currentFolderRef: ref, currentFolderPath: ref._location.path_ };
    });
    console.log(
      '%cEND==============================================',
      'background:pink; color:black'
    );
  };

  updateFolderDrilldown = async (ref) => {
    console.log(
      '%cSTART==============================================',
      'background:purple; color:white'
    );
    console.log(
      `%cFUNCTION updateFolderDrilldown, props: ${ref}`,
      'background:purple; color:white'
    );
    let index = this.state.currentFolderDrilldownRefs.findIndex((item) => {
      return item._location.path_ === ref._location.path_; //comparing object paths
    });
    let updatedFolders = this.state.currentFolderDrilldownRefs.slice(
      0,
      index + 1
    );
    console.log(
      `\t%cSETSTATE: currentFolderDrilldownRefs:${updatedFolders}`,
      'background:yellow; color:red'
    );
    await this.setState((prevState) => {
      return { currentFolderDrilldownRefs: updatedFolders };
    });
    console.log(
      '%cEND==============================================',
      'background:purple; color:white'
    );
  };

  addCurrentFolderToDrilldown = async (ref) => {
    console.log(
      '%cSTART FUNCTION addCurrentFolderToDrilldown==============================================',
      'background:tomato; color:white'
    );
    console.log(`\t%cprops: ${ref}`, 'background:tomato; color:white');
    console.log(
      `\t%cSETSTATE: currentFolderDrilldownRefs: ${[
        this.state.currentFolderDrilldownRefs,
        ref,
      ]}`,
      'background:yellow; color:red'
    );
    await this.setState((prevState) => {
      return {
        currentFolderDrilldownRefs: [
          ...prevState.currentFolderDrilldownRefs,
          ref,
        ],
      };
    });
    console.log(
      '%cEND==============================================',
      'background:tomato; color:white'
    );
  };

  //sets state.firebaseFolders, state.firebaseFiles
  getFolderData = async (ref) => {
    //reset folder first...
    console.log(
      '%cSTART FUNCTION getFolderData==============================================',
      'background:cyan; color:black'
    );
    console.log(`\t%cprops: ${ref}`, 'background:cyan; color:black');
    console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
    console.log(`\t%cfirebaseFolders: []`, 'background:yellow; color:red');
    console.log(`\t%cfirebaseFiles: []`, 'background:yellow; color:red');
    await this.setState((prevState) => {
      return {
        ...prevState,
        firebaseFolders: [],
        firebaseFiles: [],
      };
    });
    console.log(
      '\t%creset firebaseFolders to []',
      'background:cyan; color:black'
    );
    console.log(
      '\t%creset firebaseFiles to []',
      'background:cyan; color:black'
    );
    // //save to state folder ref from firebase storage
    await listAll(ref).then(async (res) => {
      console.log('\t%cref.listAll() ...', 'background:cyan; color:black');
      let folders = [];
      if (res.prefixes.length) {
        res.prefixes.forEach((folderRef) => {
          //console.log(`\t%cfolder: ${folderRef.name}`, 'background:cyan; color:black');
          folders.push(folderRef);
          //console.log(`\t%call folder name: ${folders.map((item) => { return item.name; })}`,'background:cyan; color:black');
        });
      }
      folders.forEach((item) => {
        console.log(`\t%cfolders: ${item}`, 'background:cyan; color:black');
      });

      let files = [];
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
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(
        `\t%cfirebaseFolders: folders`,
        'background:yellow; color:red'
      );
      console.log(`\t%cfirebaseFiles: files`, 'background:yellow; color:red');
      await this.setState((prevState) => {
        return {
          ...prevState,
          firebaseFolders: folders,
          firebaseFiles: files,
        };
      });
    });
    console.log(
      '%cEND==============================================',
      'background:cyan; color:black'
    );
  };

  //removes the placeholder folders if the firbase folder with same name exists
  removeDuplicateFolders = async () => {
    console.log(
      '%cSTART FUNCTION removeDuplicateFolders==============================================',
      'background:blue; color:white'
    );
    //sort out placeholder folders
    let placeholderFolderAllExceptMatch = [
      ...this.state.placeholderFolders.filter((item) => {
        return item.pathRef !== this.state.currentFolderRef;
      }),
    ];

    let placeholderFolderMatch = this.state.placeholderFolders.find((item) => {
      return item.pathRef === this.state.currentFolderRef;
    });
    console.log(
      `\t%cplaceholderFolderMatch: ${placeholderFolderMatch}`,
      'background:blue; color:white'
    );

    let placeholderMatchIndex = -1;
    console.log(
      `\t%cthis.state.currentFolderRef: ${this.state.currentFolderRef}`,
      'background:blue; color:white'
    );
    if (this.state.placeholderFolders.length > 0) {
      console.log(`\t%cSOMETHING HERE...`, 'background:blue; color:white');
      placeholderMatchIndex = this.state.placeholderFolders.findIndex(
        (item) => {
          console.log(
            `\t%citem.pathRef: ${item.pathRef}`,
            'background:blue; color:white'
          );
          return item.pathRef === this.state.currentFolderRef;
        }
      );
      console.log(
        `\t%cplacehodlerMatchIndex: ${placeholderMatchIndex}`,
        'background:blue; color:white'
      );
      //if found in placeholder...
      if (placeholderMatchIndex > -1) {
        //look in the pathfolders of placeholder (exclude the same name)
        let filtered = [
          ...this.state.placeholderFolders[
            placeholderMatchIndex
          ].pathfolders.filter((ref) => {
            //go thru firebase folders and see if there is a match to 'folder' name
            console.log(
              `\t%cref._location.path_: ${ref._location.path_}`,
              'background:blue; color:white'
            );
            let isFound = this.state.firebaseFolders.find((folderref) => {
              return folderref._location.path_ === ref._location.path_;
            });
            console.log(
              `\t%cISFOUND: ${isFound}`,
              'background:blue; color:white'
            );
            //if found, return false
            return isFound === undefined ? true : false;
          }),
        ];

        console.log(
          `\t%cUPDATED CHILDFOLDERS: ${filtered}`,
          'background:blue; color:white'
        );

        placeholderFolderMatch.pathfolders = filtered;

        //set state
        console.log(
          `\t%cSETSTATE: placeholderFolders: ${[
            ...placeholderFolderAllExceptMatch,
            placeholderFolderMatch,
          ]}`,
          'background:yellow; color:red'
        );
        this.setState((prevState) => {
          return {
            placeholderFolders: [
              ...placeholderFolderAllExceptMatch,
              placeholderFolderMatch,
            ],
          };
        });
      }
    }
    console.log(
      '%cEND==============================================',
      'background:blue; color:white'
    );
  };

  //resets state.allFolderList
  getAllFolders = async (ref = null) => {
    console.log(
      `%cSTART FUNCTION getAllFolders==============================================`,
      'background:magenta; color:white'
    );
    console.log(`\t%cprops: ${ref}`, 'background:magenta; color:white');
    let allArray = await this.findFoldersForBuild(
      ref === null ? this.state.firebaseIDRef : ref,
      []
    );
    console.log(`\t%callArray: ${allArray}`, 'background:magenta; color:white');
    console.log(
      `\t%cSETSTATE: allFolderList: ${allArray}`,
      'background:yellow; color:red'
    );
    await this.setState((prevState) => {
      return { allFolderList: allArray };
    });
    console.log(
      `%cEND==============================================`,
      'background:magenta; color:white'
    );
  };

  //RECURSIVE - gets all folders from ref onwards saving refs
  findFoldersForBuild = async (ref, arr) => {
    console.log(
      '%cSTART FUNCTION findFoldersForBuild==============================================',
      'background:brown; color:white'
    );
    console.log(`\t%cprops: ${ref}`, 'background:brown; color:white');
    arr.push(ref);
    console.log(
      `\t%cSETSTATE: allFolderList: ${[this.state.allFolderList, ref]}`,
      'background:yellow; color:red'
    );
    await listAll(ref).then((res) => {
      //if the current folder does NOT have folders
      res.prefixes.forEach(async (folderRef) => {
        await this.findFoldersForBuild(folderRef, arr);
      });
    });
    console.log(
      '%cEND==============================================',
      'background:brown; color:white'
    );
    return arr;
  };

  uploadUrlOverHandler = async (event) => {
    if (this.state.uploadUrlOver === false) {
      console.log(
        '%cSTART FUNCTION uploadUrlOverHandler===================================',
        'background:black; color:red'
      );
      console.log(
        `\t%cEvent target :${event.target}`,
        'background:black; color:red;'
      );
      await this.setState((prevState) => {
        console.log(
          `\t%cSETSTATE: uploadUrlOver: ${true}`,
          'background:yellow; color:red'
        );
        return { uploadUrlOver: true };
      });
      console.log(
        '%cEND===================================',
        'background:black; color:red'
      );
    }
  };

  uploadUrlOutHandler = async (event) => {
    console.log(
      '%cSTART FUNCTION uploadUrlOutHandler===================================',
      'background:black; color:red'
    );
    console.log(
      `\t%cEvent target :${event.target}`,
      'background:black; color:red;'
    );
    await this.setState((prevState) => {
      console.log(
        `\t%cSETSTATE: uploadUrlOver: ${false}`,
        'background:yellow; color:red'
      );
      return { uploadUrlOver: false };
    });
    console.log(
      '%cEND===================================',
      'background:black; color:red'
    );
  };

  errorConfirmedHandler = async () => {
    console.log(
      '%cSTART FUNCTION errorConfirmedHandler==============================================',
      'background:grey; color:white'
    );
    await this.setState((prevState) => {
      console.log(
        `\t%cSETSTATE: errorModal: null`,
        'background:yellow; color:red'
      );
      return { errorModal: null };
    });
    console.log(
      '%cEND==============================================',
      'background:grey; color:white'
    );
  };

  editBreadcrumbModal = async () => {
    console.log(
      '%cSTART FUNCTION editBreadcrumbModal==============================================',
      'background:gold; color:blue'
    );
    await this.setState((prevState) => {
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(
        `\t%ceditBreadcrumbModal: ${true}`,
        'background:yellow; color:red'
      );
      console.log(
        `\t%ccurrentFolderPath: ${prevState.currentFolderRef._location.path_}, `,
        'background:yellow; color:red'
      );
      console.log(
        `\t%cerrorModalMessage: ${null}`,
        'background:yellow; color:red'
      );
      console.log(
        `\t%tempFolderPath: ${prevState.currentFolderPath}`,
        'background:yellow; color:red'
      );

      return {
        editBreadcrumbModal: true,
        currentFolderPath: prevState.currentFolderRef._location.path_, //reset the value when modal is opened
        errorModalMessage: null,
        tempFolderPath: prevState.currentFolderPath,
      };
    });
    console.log(
      '%cEND==============================================',
      'background:gold; color:blue'
    );
  };

  // -------------------------------------------------------------------
  //UPLOAD
  // -------------------------------------------------------------------
  // findDuplicateFile = (file) => {
  //   console.log('%c==============================================', 'background:mistyrose; color:yellow');
  //   console.log('%cFUNCTION findDuplicateFile', 'background:mistyrose; color:yellow');
  //   console.log('%c==============================================', 'background:mistyrose;color:yellow');
  //   return this.state.selectedFiles.find((existingFile) => {
  //     const isDuplicate =
  //       existingFile.name === file.name &&
  //       existingFile.lastModified === file.lastModified &&
  //       existingFile.size === file.size &&
  //       existingFile.type === file.type;
  //     console.log(`%cIS DUPLICATE? ${isDuplicate}`, 'background:mistyrose; color:yellow');
  //     return isDuplicate;
  //   });
  // };

  fileChangedHandler = async (event) => {
    console.log(
      '%cSTART FUNCTION fileChangedHandler==============================================',
      'background:salmon; color:white'
    );
    event.preventDefault();
    const files = event.target.files;

    let toUpload = [];

    //finds duplicates from current selection
    Array.from(files).forEach((file) => {
      // const existingFile = this.findDuplicateFile(file);
      // if (existingFile) {
      //   console.error('Existing file:', existingFile);
      //   return;
      // }
      toUpload.push(file);
      console.warn(`\t%cAdded file:${file}`, 'background:salmon; color:white');
    });
    console.log(
      `\t%cFILES TO UPLOAD: ${toUpload}`,
      'background:salmon; color:white'
    );
    console.log('\t%cwaypoint1!!!!', 'background:salmon; color:white');
    await this.setState((prevState) => {
      console.log(
        `\t%cSETSTATE: selectedFiles: ${[...toUpload]}`,
        'background:yellow; color:red'
      );
      return {
        selectedFiles: [...toUpload],
      };
    });
    console.log(
      `\t%cCALLBACK (waypoint2)!!!!'`,
      'background:salmon; color:white'
    );
    console.log(
      `\t%cthis.state.selectedFiles: ${this.state.selectedFiles}`,
      'background:salmon; color:white'
    );

    await Promise.all(
      this.state.selectedFiles.map((item, index) => {
        console.log(
          `\t%cuploadHandler item: ${item.name}`,
          'background:salmon; color:white'
        );
        let file = this.state.selectedFiles[index];
        let fileName = this.state.selectedFiles[index].name;
        // console.log('FILE: ', file, '| filename: ', fileName);
        let fileRef = this.state.currentFolderRef.child(fileName);
        //using .fullPath
        //let path = fileRef.fullPath; //path is images/{filename}
        //put() takes files via javascript File and Blob api and uploads them to cloud storage
        let uploadTask = fileRef.put(file);
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed', //or firebase.storage.TaskEvent.STATE_CHANGED
            (snapshot) => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(
                `\t%cUPLOAD PROGRESS: ${progress}`,
                'background:salmon; color:white'
              );
            },
            (error) => {
              reject(new Error('FAIL!!'));
            },
            async () => {
              console.log('\t%cCOMPLETED!!', 'background:salmon; color:white');
              await this.getFolderData(this.state.currentFolderRef);
              resolve();
            }
          );
        });
      })
    ).then(() => {
      console.log('\t%cDONE', 'background:salmon; color:white');
      console.log(
        '%c==============================================',
        'background:salmon; color:white'
      );
    });

    //there is no items to add or remove as upload items go straight to cloud or are removed straight from cloud
    // this.state.selectedFiles.forEach((item, index) => {
    //   this.context.addinput(event, this.props.name, item);
    // });

    //FILEREADER...
    //use file reference by instantiating a FileReader object to read contents into memeory,
    //when load finishes, the reader's onload event is fired
    //and its 'result' attr can be used to access the file data

    //options:
    //FileReader.readAsBinaryString(Blob|File)
    //FileReader.readAsText(Blob|File, opt_encoding)
    //FileReader.readAsDataURL(Blob|File)
    //FileReader.readAsArrayBuffer(Blob|File)
    /*
        Once one of these read methods is called on your FileReader object can be used to track its progress. 
        - onloadstart 
        - onload 
        - onabort 
        - onerror 
        - onloadend 
        */

    // let reader = new FileReader();

    // reader.readAsDataURL(this.state.selectedFiles[i]);
  };

  // -------------------------------------------------------------------
  //Checkbox related
  // -------------------------------------------------------------------

  fileCheckHandler = async (index, isChecked, event = null) => {
    console.log(
      '%cSTART FUNCTION fileCheckHandler===================================',
      'background:aquamarine; color:yellow'
    );
    console.log(
      `\t%cprops: ${index}, ${isChecked}`,
      'background:aquamarine; color:yellow'
    );
    console.log(
      `\t%conChangeHandler CLICKED: ${index}, ${isChecked}`,
      'background:aquamarine; color:yellow'
    );
    await this.setState((prevState) => {
      let files = [...prevState.checkedFiles];
      files[index] = isChecked;
      console.log(
        `\t%cSETSTATE: checkedFiles: ${files}`,
        'background:yellow; color:red'
      );
      return { checkedFiles: files };
    });

    await this.checkIndeterminate();
    console.log(
      '%cEND==============================================',
      'background:aquamarine; color:yellow'
    );
  };

  folderCheckHandler = async (index, isChecked, event = null) => {
    console.log(
      '%cSTART FUNCTION folderCheckHandler===================================',
      'background:yellowgreen; color:yellow'
    );
    console.log(
      `\t%cprops: ${index}, ${isChecked}`,
      'background:yellowgreen; color:yellow'
    );
    console.log(
      '\t%conChangeHandler CLICKED: ',
      index,
      isChecked,
      'background:yellowgreen; color:yellow'
    );
    await this.setState((prevState) => {
      let folders = [...prevState.checkedFolders];
      folders[index] = isChecked;
      console.log(
        `\t%cSETSTATE: checkedFolders: ${folders}`,
        'background:yellow; color:red'
      );
      return { checkedFolders: folders };
    });
    await this.checkIndeterminate();
    console.log(
      '%cEND==============================================',
      'background:yellowgreen; color:yellow'
    );
  };

  placeholderFolderCheckHandler = async (index, isChecked, event = null) => {
    console.log(
      '%cSTART FUNCTION placeholderFolderCheckHandler===================================',
      'background:darkseagreen; color:yellow'
    );
    console.log(
      `\t%cprops: ${index}, ${isChecked}`,
      'background:darkseagreen; color:yellow'
    );
    console.log(
      `\t%conChangeHandler CLICKED: ', ${index}, ${isChecked}`,
      'background:darkseagreen; color:yellow'
    );
    await this.setState((prevState) => {
      let placeholderFolders = [...prevState.checkedPlaceholderFolders];
      placeholderFolders[index] = isChecked;
      console.log(
        `\t%cplaceholderFolders: ${placeholderFolders}`,
        'background:darkseagreen; color:yellow'
      );
      console.log(
        `\t%cSETSTATE: checkedPlaceholderFolders: ${placeholderFolders}`,
        'background:yellow; color:red'
      );
      return { checkedPlaceholderFolders: placeholderFolders };
    });
    await this.checkIndeterminate();
    console.log(
      '%cEND==============================================',
      'background:darkseagreen; color:yellow'
    );
  };

  toggleCheckAllFolders = async (isChecked) => {
    console.log(
      '%cSTART FUNCTION toggleCheckAllFolders==============================================',
      'background:lime; color:yellow'
    );
    console.log(`\t%cprops: ${isChecked}`, 'background:lime; color:yellow');
    await this.setState((prevState) => {
      //check all firebase folders
      let folders = [...prevState.firebaseFolders];
      let resultFolders = folders.map((item) => {
        return isChecked;
      });

      //check all pathfolders of current folder
      let placeholderFolderMatch = prevState.placeholderFolders.find((item) => {
        return item.pathRef === prevState.currentFolderRef;
      });
      let placeholderFolderMatchIndex = prevState.placeholderFolders.findIndex(
        (item) => {
          //note placeholderFolders stores object {path:, ref:, folders:[]}
          return item.pathRef === prevState.currentFolderRef;
        }
      );
      let resultPathFolders = [];
      if (placeholderFolderMatch !== undefined) {
        console.log(
          `\t%cplaceholderFolderMatchIndex: ', ${placeholderFolderMatchIndex}`,
          'background:lime; color:yellow'
        );
        resultPathFolders = prevState.placeholderFolders[
          placeholderFolderMatchIndex
        ].pathfolders.map((item) => {
          return isChecked;
        });
      }

      console.log(
        `\t%ccheckAllFolders: ${resultFolders} , ${resultPathFolders}`,
        'background:lime; color:yellow'
      );
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(
        `\t%ccheckedFolders: ${resultFolders}`,
        'background:yellow; color:red'
      );
      console.log(
        `\t%ccheckedPlaceholderFolders: ${resultPathFolders}`,
        'background:yellow; color:red'
      );
      return {
        checkedFolders: resultFolders,
        checkedPlaceholderFolders: resultPathFolders,
      };
    });
    console.log(
      '%cEND==============================================',
      'background:lime; color:yellow'
    );
  };

  toggleCheckAllFiles = async (isChecked) => {
    console.log(
      '%cSTART FUNCTION toggleCheckAllFiles==============================================',
      'background:mediumorchid; color:white'
    );
    console.log(
      `\t%cprops: ${isChecked}`,
      'background:mediumorchid; color:white'
    );
    await this.setState((prevState) => {
      let files = [...prevState.firebaseFiles];
      let result = files.map((item) => {
        return isChecked;
      });
      console.log(
        `\t%ccheckedFiles: ${result}`,
        'background:mediumorchid; color:white'
      );
      console.log(
        `\t%cSETSTATE: checkedFiles: ${result}`,
        'background:yellow; color:red'
      );
      return { checkedFiles: result };
    });
    console.log(
      '%cEND==============================================',
      'background:mediumorchid; color:white'
    );
  };

  toggleMainChecked = async (val) => {
    console.log(
      '%cSTART FUNCTION toggleMainChecked==============================================',
      'background:dodgerblue; color:white'
    );
    console.log(`\t%cprops: ${val}`, 'background:dodgerblue; color:white');
    await this.setState((prevState) => {
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(
        `\t%cmainChecked: ${val ? val : !prevState.mainChecked}`,
        'background:yellow; color:red'
      );
      console.log(
        `\t%cmainIndeterminate: false`,
        'background:yellow; color:red'
      );
      return {
        mainChecked: val ? val : !prevState.mainChecked,
        mainIndeterminate: false,
      };
    });
    console.log(
      '%cEND==============================================',
      'background:dodgerblue; color:white'
    );
  };

  getCheckPlaceholderFoldersPathLength = () => {
    // console.log('==============================================')
    // console.log('FUNCTION getCheckFoldersLength');
    return this.state.checkedPlaceholderFolders.filter((item) => {
      return item === true;
    }).length;
  };

  getCheckFoldersLength = () => {
    // console.log('==============================================')
    // console.log('FUNCTION getCheckFoldersLength');
    return this.state.checkedFolders.filter((item) => {
      return item === true;
    }).length;
  };

  getCheckedFilesLength = () => {
    // console.log('==============================================')
    // console.log('FUNCTION getCheckedFilesLength');
    return this.state.checkedFiles.filter((item) => {
      return item === true;
    }).length;
  };

  checkIndeterminate = async () => {
    console.log(
      `%cSTART FUNCTION checkIndeterminate==============================================`,
      'background:peru; color:yellow'
    );
    let placeholderFolderMatch = this.state.placeholderFolders.find((item) => {
      return item.pathRef === this.state.currentFolderRef;
    });

    let placeholderFolderMatchIndex = this.state.placeholderFolders.findIndex(
      (item) => {
        //note placeholderFolders stores object {path:, ref:, folders:[]}
        return item.pathRef === this.state.currentFolderRef;
      }
    );

    let pathfolders = [];
    if (placeholderFolderMatch !== undefined) {
      console.log(
        `\t%cpathfolders: ${pathfolders}`,
        'background:peru; color:yellow'
      );
      pathfolders =
        this.state.placeholderFolders[placeholderFolderMatchIndex].pathfolders;
    }
    let checkedItems =
      this.getCheckFoldersLength() +
      this.getCheckedFilesLength() +
      this.getCheckPlaceholderFoldersPathLength();
    let allItems =
      this.state.firebaseFiles.length +
      this.state.firebaseFolders.length +
      pathfolders.length;

    if (checkedItems === allItems) {
      await this.setState((prevState) => {
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(
          `\t%cmainIndeterminate: ${false}`,
          'background:yellow; color:red'
        );
        console.log(`\t%cmainChecked: ${true}`, 'background:yellow; color:red');
        return { mainIndeterminate: false, mainChecked: true };
      });
    } else if (checkedItems === 0) {
      await this.setState((prevState) => {
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(
          `\t%cmainIndeterminate: ${false}`,
          'background:yellow; color:red'
        );
        console.log(
          `\t%cmainChecked: ${false}`,
          'background:yellow; color:red'
        );
        return { mainIndeterminate: false, mainChecked: false };
      });
    } else if (checkedItems < allItems) {
      console.log('\t%cINDETERMINATE STATE!!', 'background:peru; color:yellow');
      await this.setState((prevState) => {
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(
          `\t%cmainIndeterminate: ${true}`,
          'background:yellow; color:red'
        );
        console.log(`\t%cmainChecked: ${true}`, 'background:yellow; color:red');
        return { mainIndeterminate: true, mainChecked: true };
      });
    }
    console.log(
      '%cEND==============================================',
      'background:peru; color:yellow'
    );
  };

  // -------------------------------------------------------------------
  //ADD folder
  // -------------------------------------------------------------------
  addFolderHandler = async (event) => {
    console.log(
      '%cSTART FUNCTION addFolderHandler==============================================',
      'background:orangered; color:white'
    );
    event.preventDefault();
    console.log(
      `\t%cthis.state.currentFolderRef._location.path_: ${this.state.currentFolderRef._location.path_}`,
      'background:orangered; color:white'
    );

    await this.setState((prevState) => {
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(
        `\t%ccreateFolderModal: ${true}`,
        'background:yellow; color:red'
      );
      console.log(
        `\t%cerrorModalMessage: ${false}`,
        'background:yellow; color:red'
      );
      console.log(
        `\t%ccreateFolderName: ${''}`,
        'background:yellow; color:red'
      );
      return {
        createFolderModal: true,
        errorModalMessage: false,
        createFolderName: '',
      };
    });
    console.log(
      '%cEND==============================================',
      'background:orangered; color:white'
    );
  };

  //new folder needs to be specific for the currentFolderRef
  addFolder = async (folderRef) => {
    console.log(
      '%cSTART FUNCTION addFolder==============================================',
      'background:lime; color:black'
    );
    console.log(
      `\t%cthis.state.currentFolderRef._location.path_:${this.state.currentFolderRef._location.path_}`,
      'background:lime; color:black'
    );

    await this.setState((prevState) => {
      //can we find it in same directory from firebase?
      console.log(
        `\t%ctry find in firebaseFolders`,
        'background:lime; color:black'
      );
      let foundInFirebaseIndex = prevState.firebaseFolders.findIndex((item) => {
        console.log(
          `\t%ccompare - item.name: ${item.name} | folderRef: ${folderRef.name}`,
          'background:lime; color:black'
        );
        return item.name === folderRef.name;
      });
      console.log(
        `\t%cfoundInFirebaseIndex: ${foundInFirebaseIndex}`,
        'background:lime; color:black'
      );

      //if found in firebase...
      if (foundInFirebaseIndex > -1) {
        console.log(`\t%cFOLDER EXISTS`, 'background:lime; color:black');
        this.setState((prevState) => {
          console.log(
            `\t%cSETSTATE: errorModalMessage: 'Path already exists'`,
            'background:yellow; color:red'
          );
          return { errorModalMessage: 'Path already exists' };
        });
        return prevState;
      }

      //current folder match...
      //try find current folder in placeholderFolders...
      let placeholderFolderMatch = prevState.placeholderFolders.find((item) => {
        return item.pathRef === this.state.currentFolderRef;
      });

      let placeholderFolderMatchIndex = prevState.placeholderFolders.findIndex(
        (item) => {
          //note placeholderFolders stores object {path:, ref:, folders:[]}
          return item.pathRef === this.state.currentFolderRef;
        }
      );
      console.log(
        `\t%cplaceholderFolderMatchIndex: ${placeholderFolderMatchIndex}`,
        'background:lime; color:black'
      );

      let placeholderFolderAllExceptMatch = [
        ...prevState.placeholderFolders.filter((item) => {
          return item.pathRef !== this.state.currentFolderRef;
        }),
      ];

      //not found in placeholderFolders?...add to placeholderFolders!
      if (placeholderFolderMatchIndex === -1) {
        console.log(
          '\t%cNOT FOUND, adding to pathfolders',
          'background:lime; color:black'
        );
        console.log(
          `\t%cfolderRef: ${folderRef}`,
          'background:lime; color:black'
        );
        let obj = {
          pathRef: this.state.currentFolderRef,
          pathfolders: [folderRef],
        };
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(
          `\t%cplaceholderFolders: ${[...prevState.placeholderFolders, obj]}`,
          'background:yellow; color:red'
        );
        console.log(
          `\t%ccreateFolderModal: false`,
          'background:yellow; color:red'
        );
        return {
          placeholderFolders: [...prevState.placeholderFolders, obj],
          createFolderName: '',
          createFolderModal: false,
          selectedFiles: [],
        };
      }
      //FOUND current folder in placeholderFolders
      else {
        //index in pathfolders
        console.log(folderRef._location.path_);
        let foundIndex = prevState.placeholderFolders[
          placeholderFolderMatchIndex
        ].pathfolders.findIndex((item) => {
          return item._location.path_ === folderRef._location.path_;
        });

        //folder found in pathfolders
        if (foundIndex > -1) {
          console.log(`\t%cFOLDER EXISTS`, 'background:lime; color:black');
          console.log(
            `\t%cSETSTATE: errorModalMessage: 'Path already exists'`,
            'background:yellow; color:red'
          );
          this.setState({ errorModalMessage: 'Path already exists' });
          return prevState;
        }
        //not found in pathfolders
        else {
          console.log(
            `\t%cFOLDER DOES NOT EXIST YET`,
            'background:lime; color:black'
          );
          let isFound = placeholderFolderMatch.pathfolders.findIndex((item) => {
            return item === folderRef;
          });
          if (isFound === -1) {
            let updatedFolders = [
              ...placeholderFolderMatch.pathfolders,
              folderRef,
            ];
            placeholderFolderMatch.pathfolders = updatedFolders;
          }
          console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
          console.log(
            `\t%cplaceholderFolders: ${[
              ...placeholderFolderAllExceptMatch,
              placeholderFolderMatch,
            ]}`,
            'background:yellow; color:red'
          );
          console.log(
            `\t%ccreateFolderModal: false`,
            'background:yellow; color:red'
          );
          return {
            placeholderFolders: [
              ...placeholderFolderAllExceptMatch,
              placeholderFolderMatch,
            ],
            createFolderModal: false,
          };
        }
      }
    });
    console.log(
      `%cEND==============================================`,
      'background:lime; color:black'
    );
  };

  // -------------------------------------------------------------------
  //DELETE folder
  // -------------------------------------------------------------------
  deleteFolder = async (ref) => {
    console.log(
      '%cSTART FUNCTION deleteFolder==============================================',
      'background:red; color:white'
    );
    let res = await listAll(ref);
    //folders' children...
    //folders
    if (res.prefixes.length) {
      for (let folder of res.prefixes) {
        await this.deleteFolder(folder);
      }
    }
    //folders' children...
    //delete the files
    if (res.items.length) {
      for (let file of res.items) {
        await file.delete();
      }
    }
    console.log(
      '%cEND==============================================',
      'background:red; color:white'
    );
  };

  deleteSelected = async (event) => {
    console.log(
      '%cSTART FUNCTION deleteSelected==============================================',
      'background:grey; color:yellow'
    );
    event.preventDefault();
    //go through file refs
    [...this.state.firebaseFiles].forEach(async (item, index) => {
      //remove checked
      if (this.state.checkedFiles[index] === true) {
        await item.delete();
        await this.getFolderData(this.state.currentFolderRef);
        await this.setState((prevState) => {
          console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
          console.log(
            `\t%cmainIndeterminate: ${false}`,
            'background:yellow; color:red'
          );
          console.log(
            `\t%cmainChecked: ${false}`,
            'background:yellow; color:red'
          );
          console.log(`\t%ccheckedFiles: []`, 'background:yellow; color:red');
          return {
            mainIndeterminate: false,
            mainChecked: false,
            checkedFiles: [],
          };
        });
      }
    });

    //go through folder refs
    [...this.state.firebaseFolders].forEach(async (item, index) => {
      if (this.state.checkedFolders[index] === true) {
        //loop through folder
        await this.deleteFolder(item); //recursively go through folders and delete files
        await this.getFolderData(this.state.currentFolderRef);
        await this.setState((prevState) => {
          console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
          console.log(
            `\t%cmainIndeterminate: ${false}`,
            'background:yellow; color:red'
          );
          console.log(
            `\t%cmainChecked: ${false}`,
            'background:yellow; color:red'
          );
          console.log(`\t%ccheckedFiles: []`, 'background:yellow; color:red');
          return {
            mainIndeterminate: false,
            mainChecked: false,
            checkedFolders: [],
          };
        });
      }
    });

    //WHAT IF WE DELETED A PLACEHOLDER?
    //1. remove from pathfolders of current directory
    //2. remove from placeholderFolders all children related to the folder we selected
    //3. remove from placeholderFolder's pathfolders all paths that have the selected for delete as parent...
    if (this.state.placeholderFolders.length) {
      //get the pathfolders of currentfolder to find out what was selected...
      let placeholderFolderMatch = this.state.placeholderFolders.find(
        (item) => {
          return item.pathRef === this.state.currentFolderRef;
        }
      );
      console.log(
        `\t%cplaceholderFolderMatch: ${placeholderFolderMatch}`,
        'background:grey; color:yellow'
      );

      let placeholderMatchIndex = -1;
      placeholderMatchIndex = this.state.placeholderFolders.findIndex(
        (item) => {
          console.log(
            `\t%citem.pathRef: ${item.pathRef}`,
            'background:grey; color:yellow'
          );
          return item.pathRef === this.state.currentFolderRef;
        }
      );
      console.log(
        `\t%cplacehodlerMatchIndex: ${placeholderMatchIndex}`,
        'background:grey; color:yellow'
      );
      let checked = [];
      if (placeholderMatchIndex > -1) {
        checked = this.state.placeholderFolders[
          placeholderMatchIndex
        ].pathfolders.filter((ref, index) => {
          return this.state.checkedPlaceholderFolders[index] === true
            ? true
            : false;
        });
      }

      //delete the selected reference from:
      //1. remove from pathfolders of current directory
      //2. remove from placeholderFolders all children related to the folder we selected
      //3. remove from placeholderFolder's pathfolders all paths that have the selected for delete as parent...
      let updatedPlaceholderFolders = this.state.placeholderFolders.filter(
        (placeholder) => {
          //each placeholder's pathfolders with checked items removed
          let updatedPathFolders = placeholder.pathfolders.filter((pathRef) => {
            //try find checkedRef._location.path_ in pathRef._location.path_
            let foundMatch = checked.some((checkRef) => {
              return pathRef._location.path_.includes(checkRef._location.path_);
            });
            console.log('foundMatch:', foundMatch, 'ie. return: ', !foundMatch);
            return !foundMatch;
          });
          console.log('updatedPathFolders:', updatedPathFolders);
          placeholder.pathfolders = [...updatedPathFolders];

          //try find checkedref._location.path_ in placeholder.pathRef._location.path_
          //includeItem is true if matched
          let includeItem = checked.some((checkRef) => {
            return placeholder.pathRef._location.path_.includes(
              checkRef._location.path_
            );
          });

          if (includeItem === true || placeholder.pathfolders.length === 0) {
            return false;
          }
          return true;
        }
      );
      console.log('updatedPlaceholderFolders:', updatedPlaceholderFolders);

      await this.setState((prevState) => {
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(
          `\t%cplaceholderFolders: ${updatedPlaceholderFolders}`,
          'background:yellow; color:red'
        );
        console.log(
          `\t%ccheckedPlaceholderFolders: []`,
          'background:yellow; color:red'
        );
        return {
          placeholderFolders: updatedPlaceholderFolders,
          mainChecked: false,
          mainIndeterminate: false,
          checkedPlaceholderFolders: [],
        };
      });
    }
    console.log(
      '%cEND==============================================',
      'background:grey; color:yellow'
    );
  };

  // -------------------------------------------------------------------
  //RENAME file
  // -------------------------------------------------------------------
  renameFileHandler = (event) => {
    console.log(
      '%cSTART FUNCTION renameFileHandler==============================================',
      'background:grey; color:yellow'
    );
    event.preventDefault();

    //get the file that is checked, will only be 1 file because this function can only be called when rename button is clicked, and rename button only shows when a single file is selected
    let findfile = [...this.state.firebaseFiles].find((item, index) => {
      //remove checked
      return this.state.checkedFiles[index] === true;
    });

    this.setState({
      renameFileModal: true,
      checkedFile: findfile,
      renamedFilename: findfile.name.split('.').slice(0, -1).join('.'),
      renamedFilenameExtension: findfile.name.substr(
        findfile.name.lastIndexOf('.')
      ),
    });
  };

  // -------------------------------------------------------------------
  //RENDER
  // -------------------------------------------------------------------
  render() {
    console.log(
      '%cSTART FUNCTION render==============================================',
      'background:green;color:white'
    );
    console.log(
      `\t%cfirebaseIDRef: ${this.state.firebaseIDRef}`,
      `background:green;color:white`
    );
    console.log(
      '\tallFolderList *(firebase folder recursive):',
      this.state.allFolderList
    );
    console.log(
      `\t%cfirebaseFolders: ${this.state.firebaseFolders}`,
      'background:green;color:white'
    );
    console.log(
      `\t%cfirebaseFiles: ${this.state.firebaseFiles}`,
      'background:green;color:white'
    );
    console.log('\n');
    console.log(
      `\t%ccurrentFolderDrilldownRefs: ${this.state.currentFolderDrilldownRefs}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ccurrentFolderRef: ${this.state.currentFolderRef}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ccurrentFolderPath: ${this.state.currentFolderPath}`,
      'background:green;color:white'
    );
    console.log('\t%cplaceholderFolders:', this.state.placeholderFolders);
    console.log(
      `\t%cselectedFiles: ${this.state.selectedFiles}`,
      'background:green;color:white'
    );
    console.log(
      `\t%cuploadUrlOver: ${this.state.uploadUrlOver}`,
      'background:green;color:white'
    );
    console.log(`\n`);
    console.log(
      `\t%cmainChecked: ${this.state.mainChecked}`,
      'background:green;color:white'
    );
    console.log(
      `\t%cmainIndeterminate: ${this.state.mainIndeterminate}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ccheckedPlaceholderFolders: ${this.state.checkedPlaceholderFolders}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ccheckedFolders: ${this.state.checkedFolders}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ccheckedFiles: ${this.state.checkedFiles}`,
      'background:green;color:white'
    );
    console.log(`\n`);
    console.log(
      `\t%ccreateFolderName: ${this.state.createFolderName}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ctempFolderPath: ${this.state.tempFolderPath}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ccreateFolderModal: ${this.state.createFolderModal}`,
      'background:green;color:white'
    );
    console.log(
      `\t%ceditBreadcrumbModal: ${this.state.editBreadcrumbModal}`,
      'background:green;color:white'
    );
    console.log(
      `\t%cerrorModalMessage: ${this.state.errorModalMessage}`,
      'background:green;color:white'
    );
    console.log('===');

    //sort out placeholder folders
    let placeholderMatchIndex = -1;
    let pathFolders = [];

    if (this.state.placeholderFolders.length) {
      console.log('\t%cSOMETHING HERE...', 'background:green;color:white');
      placeholderMatchIndex = this.state.placeholderFolders.findIndex(
        (item) => {
          return (
            item.pathRef._location.path_ ===
            this.state.currentFolderRef._location.path_
          );
        }
      );

      console.log(
        `\t%cplaceholderMatchIndex: ${placeholderMatchIndex}`,
        'background:green;color:white'
      );

      if (placeholderMatchIndex > -1) {
        pathFolders =
          this.state.placeholderFolders[placeholderMatchIndex].pathfolders;
      }
    }

    //CHECKBOX FOR FILE/FOLDER/PLACEHOLDERFOLDER RELATED
    let sortedDOM = [
      //placeholderFolders
      ...pathFolders.map((item, index) => {
        console.log(`\t%cpathfolder: ${item}`, 'background:green;color:white');
        let key =
          this.state.currentFolderRef._location.path_ +
          '_placeholderfolder_' +
          index;
        //console.log('key: ', key);

        return (
          <React.Fragment key={key}>
            <Checkbox
              onChange={(index, checked) =>
                this.placeholderFolderCheckHandler(index, checked)
              }
              index={index}
              checked={this.state.checkedPlaceholderFolders[index]}
            ></Checkbox>
            <ListItem
              style={{ display: 'flex', justifyContent: 'flex-start' }}
              hovereffect={true}
              onClick={() => {
                console.clear();
                console.log('CHANGING FOLDER :)');
                this.changeFolderPath(item);
              }}
              title={item.name}
            >
              <Icon iconstyle='far' code='folder' size='lg' />
              <p>{item.name}/</p>
            </ListItem>
          </React.Fragment>
        );
      }),

      //firebase folders
      ...this.state.firebaseFolders.map((item, index) => {
        let key =
          this.state.currentFolderRef._location.path_ + '_folder_' + index;
        //console.log('key: ', key);

        return (
          <React.Fragment key={key}>
            <Checkbox
              onChange={(index, checked) =>
                this.folderCheckHandler(index, checked)
              }
              index={index}
              checked={this.state.checkedFolders[index]}
            ></Checkbox>
            <ListItem
              style={{ display: 'flex', justifyContent: 'space-between' }}
              hovereffect={true}
              onClick={() => {
                console.clear();
                console.log('CHANGING FOLDER :)');
                this.changeFolderPath(item);
              }}
              title={item.name}
            >
              {/* flex-direction:row */}
              <div className={{ display: 'flex', flexDirection: 'row' }}>
                <Icon iconstyle='far' code='folder' size='lg' />
                <p>{item.name}/</p>
              </div>
              <div className={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  className={buttonStyle.NoStyle}
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    Clipboard.copyStringToClipboard(
                      `gs://${item.location.bucket}/${item._location.path_}`
                    );
                    this.setState({ showClipboardModal: true });
                    setTimeout(() => {
                      this.setState({ showClipboardModal: false });
                    }, 1000);
                  }}
                  title='copy to clipboard'
                >
                  <Icon iconstyle='far' code='copy' size='sm' />
                </Button>
              </div>
            </ListItem>
          </React.Fragment>
        );
      }),
    ].sort((a, b) => {
      var nameA = a.props.children[1].props.title.toLowerCase();
      var nameB = b.props.children[1].props.title.toLowerCase();
      console.log('compare: ', nameA, '| ', nameB);
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    //console.log('this.state.firebaseAndPlaceholderFolders: ', this.state.firebaseAndPlaceholderFolders);
    console.log(`\t%csortedDOM: ${sortedDOM}`, 'background:green;color:white');
    console.log(
      `\t%cthis.state.firebaseFiles: ${this.state.firebaseFiles}`,
      'background:green;color:white'
    );
    let currentFolderData = [
      ...sortedDOM,
      //=====================================
      ...this.state.firebaseFiles.map((item, index) => {
        let key =
          this.state.currentFolderRef._location.path_ +
          '_firebaseFiles_' +
          index;
        //console.log('key: ', key);

        return (
          <React.Fragment key={key}>
            <Checkbox
              onChange={(index, checked) =>
                this.fileCheckHandler(index, checked)
              }
              index={index}
              checked={this.state.checkedFiles[index]}
            ></Checkbox>
            <ListItem
              style={{ display: 'flex', justifyContent: 'space-between' }}
              hovereffect={true}
              onClick={async (event) => {
                /* opens up asset in new window */
                event.stopPropagation();
                console.log('VIEW CLICKED: ', item);
                const url = await FirebaseHelper.urlFromRef(item);
                console.log('URL: ', url);
                window.open(url, '_blank');
              }}
              title={item.name}
            >
              <div className={{ display: 'flex', flexDirection: 'row' }}>
                <Icon iconstyle='far' code='file' size='lg' />
                <p>{item.name}</p>
              </div>
              <div className={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  className={buttonStyle.NoStyle}
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('VIEW CLICKED: ', item);
                    const url = await FirebaseHelper.urlFromRef(item);
                    console.log('URL: ', url);
                    window.open(url, '_blank');
                  }}
                  title='open as external link'
                >
                  <Icon iconstyle='fas' code='external-link-alt' size='sm' />
                </Button>

                {/* downloads assets to drive */}
                <Button
                  className={buttonStyle.NoStyle}
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('Copy to clipboard CLICKED');
                    const url = await FirebaseHelper.urlFromRef(item);
                    Clipboard.copyStringToClipboard(url);
                    this.setState({ showClipboardModal: true }, () => {
                      setTimeout(() => {
                        this.setState({ showClipboardModal: false });
                      }, 1000);
                    });
                  }}
                  title='copy to clipboard'
                >
                  <Icon iconstyle='far' code='copy' size='sm' />
                </Button>
              </div>
            </ListItem>
          </React.Fragment>
        );
      }),
    ];

    //CHECK
    let isIndeterminateClass =
      this.state.mainIndeterminate === true ||
      (this.getCheckFoldersLength() +
        this.getCheckedFilesLength() +
        this.getCheckPlaceholderFoldersPathLength() ===
        this.state.firebaseFiles.length +
          this.state.firebaseFolders.length +
          pathFolders.length &&
        this.state.firebaseFiles.length +
          this.state.firebaseFolders.length +
          pathFolders.length >
          0)
        ? classes.StyleUploadIndeterminate
        : null;

    //console.log('IS INDETERMINATE: ', isIndeterminateClass);

    let isHoverUploadUrl =
      this.state.uploadUrlOver === true
        ? classes.UploadUrlOver
        : classes.UploadUrlOut;
    console.log(
      '%cEND==============================================',
      'background:green;color:white'
    );
    return (
      <div className={classes.Upload}>
        <div className={[classes.Border].join(' ')}>
          <div
            className={[classes.UploadHeader, isIndeterminateClass].join(' ')}
          >
            {/*DELETE/CANCEL SELECT WHEN ITEMS ARE SELECTED */}
            {this.state.mainIndeterminate === true ||
            (this.getCheckFoldersLength() +
              this.getCheckedFilesLength() +
              this.getCheckPlaceholderFoldersPathLength() ===
              this.state.firebaseFiles.length +
                this.state.firebaseFolders.length +
                pathFolders.length &&
              this.state.firebaseFiles.length +
                this.state.firebaseFolders.length +
                pathFolders.length >
                0) ? (
              <React.Fragment>
                <div className={classes.UploadIndeterminate}>
                  <Button
                    type='CheckboxSize'
                    color='White'
                    onClick={async (event) => {
                      event.preventDefault();
                      await this.toggleMainChecked(false);
                      await this.toggleCheckAllFolders(false);
                      await this.toggleCheckAllFiles(false);
                    }}
                  >
                    <Icon iconstyle='fas' code='times' size='lg' />
                  </Button>
                  <span>
                    {this.getCheckFoldersLength() +
                      this.getCheckedFilesLength() +
                      this.getCheckPlaceholderFoldersPathLength() +
                      ' selected'}
                  </span>
                </div>
                <div className={classes.ButtonGroup}>
                  {this.getCheckedFilesLength() === 1 ? (
                    <Button
                      type='Action'
                      onClick={(event) => {
                        this.renameFileHandler(event);
                      }}
                    >
                      Rename
                    </Button>
                  ) : null}

                  <Button
                    type='Action'
                    onClick={async (event) => {
                      await this.deleteSelected(event);
                      //update folders
                      this.getAllFolders();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              // BREADCRUMB + EDIT BUTTON
              <React.Fragment>
                <div
                  className={classes.UploadHeaderUrl}
                  onMouseOver={(event) => {
                    event.stopPropagation();
                    this.uploadUrlOverHandler(event);
                  }}
                  onMouseLeave={(event) => {
                    event.stopPropagation();
                    this.uploadUrlOutHandler(event);
                  }}
                >
                  {/* <Breadcrumb
                    path={this.state.currentFolderDrilldownRefs}
                    onClick={(ref) => this.changeFolderPath(ref)}
                    onEdit={() => this.editBreadcrumbModal()}
                  ></Breadcrumb> */}

                  <div
                    className={[classes.UploadEdit, isHoverUploadUrl].join(' ')}
                    title='edit'
                    onClick={() => this.editBreadcrumbModal()}
                  >
                    <Icon iconstyle='fas' code='edit' size='sm' />
                  </div>
                </div>

                {/* UPLOAD FILE + NEW FOLDER BUTTON */}
                <div className={[classes.UploadHeaderActionButtons].join(' ')}>
                  <input
                    ref={this.uploadRef}
                    type='file'
                    accept='image/*, video/*, audio/*, application/pdf'
                    multiple
                    onChange={(event) => {
                      console.clear();
                      this.fileChangedHandler(event);
                    }}
                  />

                  {/* UPLOAD FILE */}
                  <Button
                    className={classes.UploadHeaderUploadFile}
                    type='Action'
                    onClick={(event) => {
                      event.preventDefault();
                      this.uploadRef.current.click();
                    }}
                    title='upload'
                  >
                    <Icon iconstyle='fas' code='arrow-circle-up' size='lg' />
                    Upload file
                  </Button>

                  {/* NEW FOLDER */}
                  <Button
                    className={classes.UploadHeaderNewFolder}
                    type='LastItemRight'
                    onClick={this.addFolderHandler}
                    title='new folder'
                  >
                    <Icon iconstyle='fas' code='folder-plus' size='lg' />
                  </Button>
                </div>
              </React.Fragment>
            )}
          </div>

          {/* INTERMINATE STATE BUTTON */}
          <React.Fragment>
            <div className={classes.UploadBodyHeader}>
              <div className={classes.HeaderRow}>
                <Checkbox
                  index={0}
                  checked={this.state.mainChecked}
                  indeterminate={this.state.mainIndeterminate}
                  isDisabled={currentFolderData.length > 0 ? false : true}
                  onChange={async () => {
                    await this.toggleMainChecked(!this.state.mainChecked); //when this is async/await call, state.mainChecked updates here...

                    //when async/await, these following calls should use this.state.mainChecked,
                    //when NOT async/await, these following calls should use !this.state.mainChecked
                    await this.toggleCheckAllFolders(this.state.mainChecked);
                    await this.toggleCheckAllFiles(this.state.mainChecked);
                  }}
                ></Checkbox>
                <span className={classes.LabelName}>Name</span>
              </div>
            </div>

            {/* UPLOAD BODY... FILES/FOLDERS ETC */}
            <div className={classes.UploadBody}>
              {
                // > 1 because else it is the root node
                this.state.currentFolderDrilldownRefs.length > 1 ? (
                  <div
                    className={[
                      classes.FlexGroupRow,
                      classes.NavigateUpOneFolder,
                    ].join(' ')}
                  >
                    <ListItem
                      style={{ display: 'flex', justifyContent: 'flex-start' }}
                      hovereffect={true}
                      onClick={() => {
                        //get current index on drilldown,
                        let index =
                          this.state.currentFolderDrilldownRefs.findIndex(
                            (item) => {
                              return (
                                item._location.path_ ===
                                this.state.currentFolderRef._location.path_
                              );
                            }
                          );
                        //navigate to index -1
                        console.clear();
                        this.changeFolderPath(
                          this.state.currentFolderDrilldownRefs[index - 1]
                        );
                      }}
                    >
                      <Icon
                        iconstyle='fas'
                        code='level-up-alt'
                        size='sm'
                        flip='horizontal'
                      />
                      ../
                    </ListItem>
                  </div>
                ) : null
              }

              {currentFolderData.length ? (
                <List
                  value={{
                    data: currentFolderData,
                  }}
                ></List>
              ) : (
                'There are no files here yet'
              )}
            </div>
          </React.Fragment>
        </div>

        {
          /* create folder modal for all instances */
          // --------------------------------------------------------------------
        }
        <Modal
          label='Create folder'
          show={this.state.createFolderModal}
          isInteractive={true}
          modalClosed={async () => {
            await this.setState((prevState) => {
              console.log(
                `\t%cSETSTATE: createFolderModal: ${false}`,
                'background:yellow; color:red'
              );
              return { createFolderModal: false };
            });
          }}
          continue={async () => {
            console.clear();
            console.log('\t%ccontinue', 'background:green;color:white');
            if (this.state.createFolderName.trim() !== '') {
              const newRef = this.state.currentFolderRef.child(
                this.state.createFolderName
              );
              await this.addFolder(newRef);
              //refresh list of all firebase folders
              await this.getAllFolders();
            } else {
              this.setState({ errorModalMessage: 'Enter a foldername' });
            }
          }}
        >
          <Input
            value={{ data: this.state.createFolderName }}
            placeholder='Folder name'
            onChange={async (event) => {
              event.preventDefault();
              console.log(
                `\t%ctyped: ${event.target.value}`,
                'background:green;color:white'
              );
              let targetVal = event.target.value;

              await this.setState((prevState) => {
                console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
                console.log(
                  `\t%cerrorModalMessage: ${null}`,
                  'background:yellow; color:red'
                );
                console.log(
                  `\t%ccreateFolderName: ${targetVal}`,
                  'background:yellow; color:red'
                );
                return {
                  errorModalMessage: null,
                  createFolderName: targetVal,
                };
              });
            }}
          />
          <div className={classes.Errors}>{this.state.errorModalMessage}</div>
        </Modal>

        {
          /* Rename file modal */
          // --------------------------------------------------------------------
        }
        <Modal
          label='Rename file'
          show={this.state.renameFileModal}
          isInteractive={true}
          modalClosed={async () => {
            await this.setState((prevState) => {
              console.log(
                `\t%cSETSTATE: createFolderModal: ${false}`,
                'background:yellow; color:red'
              );
              return {
                renameFileModal: false,
                checkedFile: null,
                renamedFilename: '',
                renamedFilenameExtension: '',
              };
            });
          }}
          continue={async () => {
            console.clear();
            console.log('\t%ccontinue', 'background:green;color:white');
            if (this.state.renamedFilename.trim() !== '') {
              const oldRef = this.state.checkedFile;
              const newRef = this.state.currentFolderRef.child(
                this.state.renamedFilename + this.state.renamedFilenameExtension
              );

              console.log('adding new file..................');
              console.log('newREF:', newRef);
              await oldRef.getDownloadURL().then(async (url) => {
                const renameBlogFile = await Blob.getFileBlob(url);
                await newRef.put(renameBlogFile);
                await oldRef.delete();
                console.log('uploaded a blob file!');
              });
              //DOESNT NEED TO CALL THIS AS ITS ONLY GOT TO DO WITH FOLDERS
              //await this.getAllFolders(this.state.firebaseRootRef);
              await this.getFolderData(this.state.currentFolderRef);

              await this.setState((prevState) => {
                console.log(
                  `\t%cSETSTATE: renameFileModal: ${false}`,
                  'background:yellow; color:red'
                );
                return {
                  renameFileModal: false,
                  mainChecked: false,
                  mainIndeterminate: false,
                  checkedFile: null,
                  checkedFiles: [],
                  renamedFilename: '',
                  renamedFilenameExtension: '',
                };
              }); //refresh list of all firebase folders
            } else {
              this.setState({ errorModalMessage: 'Enter new file name' });
            }
          }}
        >
          <Input
            value={{ data: this.state.renamedFilename }}
            placeholder='New file name'
            onChange={async (event) => {
              event.preventDefault();
              console.log(
                `\t%ctyped: ${event.target.value}`,
                'background:green;color:white'
              );
              let targetVal = event.target.value;

              await this.setState((prevState) => {
                console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
                console.log(
                  `\t%cerrorModalMessage: ${null}`,
                  'background:yellow; color:red'
                );
                console.log(
                  `\t%ccreateFolderName: ${targetVal}`,
                  'background:yellow; color:red'
                );
                return {
                  errorModalMessage: null,
                  renamedFilename: targetVal,
                };
              });
            }}
          />
          <div className={classes.Errors}>{this.state.errorModalMessage}</div>
        </Modal>

        {
          /* edit folder modal for all instances */
          // --------------------------------------------------------------------
        }
        <Modal
          label='Edit folder path'
          show={this.state.editBreadcrumbModal}
          isInteractive={true}
          modalClosed={async () => {
            await this.setState((prevState) => {
              console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
              console.log(
                `\t%ceditBreadcrumbModal: ${false}`,
                'background:yellow; color:red'
              );
              console.log(
                `\t%cerrorModalMessage: ${null}`,
                'background:yellow; color:red'
              );
              console.log(
                `\t%ctempFolderPath: ${null}`,
                'background:yellow; color:red'
              );

              return {
                editBreadcrumbModal: false,
                errorModalMessage: null,
                tempFolderPath: null,
              };
            });
          }}
          continue={async () => {
            console.log('\t%ccontinue', 'background:green;color:white');
            //go through directory list
            //navigate if folders exists..
            //ie. check all paths in directory list
            console.log('this.state.allFolderList: ', this.state.allFolderList);

            //try find in firebase paths
            let isFoundFirebaseIndex = this.state.allFolderList.findIndex(
              (item, index) => {
                console.log(
                  `\t%callFolderList item: index:[${index}] ${item._location.path_}`,
                  'background:green;color:white'
                );
                console.log('item._location.path_: ', item._location.path_);
                console.log(
                  'this.state.tempFolderPath: ',
                  this.state.tempFolderPath
                );
                return item._location.path_ === this.state.tempFolderPath
                  ? true
                  : false;
              }
            );
            console.log('isFoundFirebaseIndex: ', isFoundFirebaseIndex);
            if (isFoundFirebaseIndex > -1) {
              //found in drilldown...so it exists, navigate to it
              await this.changeFolderPath(
                this.state.allFolderList[isFoundFirebaseIndex]
              );
              //on continue, navigate to new ref
              await this.setState((prevState) => {
                console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
                console.log(
                  `\t%ceditBreadcrumbModal: ${false}`,
                  'background:yellow; color:red'
                );
                console.log(
                  `\t%cerrorModalMessage: ${null}`,
                  'background:yellow; color:red'
                );
                return {
                  editBreadcrumbModal: false,
                  errorModalMessage: null,
                };
              });
            }

            //try find in placeholder paths
            let isFoundPlaceholderIndex =
              this.state.placeholderFolders.findIndex((placeholder) => {
                return placeholder.pathRef._location.path_ ===
                  this.state.tempFolderPath
                  ? true
                  : false;
              });
            console.log('isFoundPlaceholderIndex: ', isFoundPlaceholderIndex);
            if (isFoundPlaceholderIndex > -1) {
              await this.changeFolderPath(
                this.state.placeholderFolders[isFoundPlaceholderIndex].pathRef
              );
              //on continue, navigate to new ref
              await this.setState((prevState) => {
                console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
                console.log(
                  `\t%ceditBreadcrumbModal: ${false}`,
                  'background:yellow; color:red'
                );
                console.log(
                  `\t%cerrorModalMessage: ${null}`,
                  'background:yellow; color:red'
                );
                return {
                  editBreadcrumbModal: false,
                  errorModalMessage: null,
                };
              });
            }

            //try find in placeholderFolders pathfolders
            let isFoundPath = undefined;
            this.state.placeholderFolders.forEach((placeholder, index) => {
              let foundIndex = placeholder.pathfolders.findIndex((pathRef) => {
                if (pathRef._location.path_ === this.state.tempFolderPath) {
                  return true;
                }
                return false;
              });

              if (foundIndex > -1) {
                isFoundPath =
                  this.state.placeholderFolders[index].pathfolders[foundIndex];
              }
            });
            console.log('isFoundPath: ', isFoundPath);
            if (isFoundPath !== undefined) {
              await this.changeFolderPath(isFoundPath);
              await this.setState((prevState) => {
                console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
                console.log(
                  `\t%ceditBreadcrumbModal: ${false}`,
                  'background:yellow; color:red'
                );
                console.log(
                  `\t%cerrorModalMessage: ${null}`,
                  'background:yellow; color:red'
                );
                return {
                  editBreadcrumbModal: false,
                  errorModalMessage: null,
                };
              });
            }

            if (
              this.state.tempFolderPath[
                this.state.currentFolderPath.length - 1
              ] === '/'
            ) {
              console.error(
                '\t%cpath does not exist',
                'background:green;color:white'
              );
              await this.setState((prevState) => {
                console.log(
                  `\t%cSETSTATE: errorModalMessage: ${'Remove trailing "/" character from path'}`,
                  'background:yellow; color:red'
                );
                return {
                  errorModalMessage: 'Remove trailing "/" character from path',
                };
              });
            }

            if (
              isFoundFirebaseIndex === -1 &&
              isFoundPlaceholderIndex === -1 &&
              isFoundPath === undefined
            ) {
              console.error('path does not exist');
              await this.setState((prevState) => {
                console.log(
                  `\t%cSETSTATE: errorModalMessage: ${'Path does not exist'}`,
                  'background:yellow; color:red'
                );
                return {
                  errorModalMessage: 'Path does not exist',
                };
              });
            }
          }}
        >
          <Input
            value={{
              data: this.state.tempFolderPath,
            }}
            placeholder='Folder'
            onChange={(event) => {
              event.persist();
              event.preventDefault();
              console.log(
                `\t%ctyped: ${event.target.value}`,
                'background:green;color:white'
              );
              this.setState((prevState) => {
                console.log(
                  `\t%cSETSTATE: tempFolderPath: ${event.target.value}`,
                  'background:yellow; color:red'
                );
                return { tempFolderPath: event.target.value };
              });
            }}
          />
          <div className={classes.Errors}>{this.state.errorModalMessage}</div>
        </Modal>

        {/* copied to clipboard modal */}
        <Modal show={this.state.showClipboardModal}>
          <div style={{ display: 'flex', flexDirection: 'center' }}>
            <p>Copied to clipboard</p>
          </div>
        </Modal>
      </div>
    );
  }
}
export default withRouter(Upload);
