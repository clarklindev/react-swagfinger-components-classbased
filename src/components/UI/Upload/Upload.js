import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Upload.module.scss';

import Modal from '../Modal/Modal';
import Input from '../InputComponents/Input';
import List from '../InputComponents/List';
import ListItem from '../InputComponents/ListItem';
import Button from '../Button/Button';
import Icon from '../InputComponents/Icon';
import Checkbox from '../InputComponents/Checkbox';
import Breadcrumb from '../InputComponents/Breadcrumb';

//firebase imports
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

class Upload extends PureComponent {
  constructor(props) {
    console.log('%c==============================================', 'background:white; color:red')
    console.log('%cCONSTRUCTOR Upload', 'background:white; color:red');
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
      console.log('%cinitializing firebase', 'background:white; color:red');
      firebase.initializeApp(this.firebaseConfig);
    } catch {
      console.log('%calready exists...', 'background:white; color:red');
    }
    this.uploadRef = React.createRef();
    console.log('%c==============================================', 'background:white; color:red')
  }

  state = {
    //firebase
    allFolderList: [],  //all firebase folders from current ref onwards(recursive)
    firebaseFolders: [], //should store refs of current folder
    firebaseFiles: [], //should store refs of current folder
    firebaseRootRef: null,
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
    checkedPlaceholderFolders:[], //temporary folders not in firebase yet

    //modal
    createFolderModal: false,
    createFolderName: '',
    editBreadcrumbModal: false,
    errorModalMessage: null,

  };

  componentDidMount() {
    console.log('%c==============================================', 'background:white; color:red')
    console.log('%cFUNCTION componentDidMount', 'background:white; color:red');
    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref(); // Create a storage reference from our storage service
    //get id from querystring
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get('id'); //get id in url query params

    let ref = this.storageRef;

    if (id) {
      console.log(`%cEXISTS - id: ${id}`, 'background:white; color:red');
      // //current id folder
      ref = this.storageRef.child(id);
    } else {
      ref = this.storageRef;
    }

    this.setState({firebaseRootRef: ref}, ()=>{
      this.changeFolderPath(ref);
      this.getAllFolders(ref);
    });
    console.log('%c==============================================', 'background:white; color:red')
  }

  changeFolderPath = async (ref) => {
    console.log('%c\n\n\n\n***************************************************************', 'background:orange; color:white')
    console.log('%cSTART==============================================', 'background:orange; color:white')
    console.log(`%cFUNCTION changeFolderPath, props: ${ref}`, 'background:orange; color:white');
    this.setCurrentFolderRef(ref); //sets state.currentFolderRef , state.currentFolderPath

    //reset checked folders and files
    this.setState({
      mainChecked: false,
      mainIndeterminate: false,
      checkedFolders: [], //all checked folders in current folder
      checkedFiles: [], //all checked files in current folder
      checkedPlaceholderFolders:[] //all checked temporary folders (not in firebase yet) in current folder
    });

    //go through exisiting references, look for current reference (===) the ref from props,
    let index = this.state.currentFolderDrilldownRefs.findIndex((item) => {
      return item === ref;
    });
    console.log('index:', index);

    //if it is found, then slice off from currentFolderDrilldownRefs onwards...(we navigated back)...
    if (index > -1) {
      //slice() returns new array..
      this.updateFolderDrilldown(ref);
    }
    //else if not found, then add to currentFolderDrilldownRefs.
    else {
      this.addCurrentFolderToDrilldown(ref);
    }
    console.log('before getFolderData...');
    await this.getFolderData(ref);// from ref.. sets firebaseFolders, firebaseFiles
    console.log('after getFolderData...');
    console.log('!! state.firebaseFolders: ', this.state.firebaseFolders);
    console.log('!! state.firebaseFiles: ', this.state.firebaseFiles);
    this.removeDuplicateFolders();
    console.log('%cEND==============================================', 'background:orange; color:white')
  };  

  setCurrentFolderRef = (ref) => {
    console.log('%cSTART==============================================', 'background:pink; color:white');
    console.log(`%cFUNCTION setCurrentFolderRef, props: ${ref}`, 'background:pink; color:white');
    this.setState({ currentFolderRef: ref, currentFolderPath: ref.location.path });
    console.log('%cEND==============================================', 'background:pink; color:white')

  };

  updateFolderDrilldown = (ref) => {
    console.log('%cSTART==============================================', 'background:purple; color:white');
    console.log(`%cFUNCTION updateFolderDrilldown, props: ${ref}`, 'background:purple; color:white');
    let index = this.state.currentFolderDrilldownRefs.findIndex((item) => {
      return item.location.path === ref.location.path; //comparing object paths
    });
    let updatedFolders = this.state.currentFolderDrilldownRefs.slice(
      0,
      index + 1
    );
    this.setState({ currentFolderDrilldownRefs: updatedFolders });
    console.log('%cEND==============================================', 'background:purple; color:white')
  };

  addCurrentFolderToDrilldown = (ref) => {
    console.log('%cSTART==============================================', 'background:purple; color:white');
    console.log(`%cFUNCTION addCurrentFolderToDrilldown, props: ${ref}`, 'background:purple; color:white');
    this.setState((prevState) => {
      return {
        currentFolderDrilldownRefs: [
          ...prevState.currentFolderDrilldownRefs,
          ref,
        ],
      };
    });
    console.log('%cEND==============================================', 'background:purple; color:white')
  };
  
  //sets state.firebaseFolders, state.firebaseFiles
  getFolderData = async (ref) => {
    //reset folder first...
    console.log('%cSTART==============================================', 'background:cyan; color:black');
    console.log(`%cFUNCTION getFolderData, props: ${ref}`, 'background:cyan; color:black');

    this.setState((prevState) => {
      return {
        ...prevState,
        firebaseFolders: [],
        firebaseFiles: [],
      };
    });
    console.log("%creset firebaseFolders to []", 'background:cyan; color:black');
    console.log('%creset firebaseFiles to []', 'background:cyan; color:black');
    // //save to state folder ref from firebase storage
    await ref.listAll().then((res) => {
      let folders = [];
      if (res.prefixes.length) {
        res.prefixes.forEach((folderRef) => {
          console.log(`%cfolder: ${folderRef}.name`, 'background:cyan; color:black');
          folders.push(folderRef);
          console.log(`%cfolder name: ${folders.map((item) => { return item.name; })}`,'background:cyan; color:black');
        });
      }
      console.log(`%cfolders: ${folders}`,'background:cyan; color:black');

      let files = [];
      if (res.items.length) {
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          console.log(`%cfile: ${itemRef.name}`,'background:cyan; color:black');
          files.push(itemRef);
          console.log(`%cfile name: ${files.map((item) => { return item.name;})}`,'background:cyan; color:black');
        });
      }      
      console.log(`%cfiles: ${files}`,'background:cyan; color:black');

      this.setState((prevState) => {
        return {
          ...prevState,
          firebaseFolders: folders,
          firebaseFiles: files,
        };
      });
    });
    console.log('%cEND==============================================', 'background:cyan; color:black');
  };

  //removes the placeholder folders if the firbase folder with same name exists
  removeDuplicateFolders = ()=>{
    console.log('%cSTART==============================================', 'background:blue; color:white');
    console.log('%cFUNCTION removeDuplicateFolders', 'background:blue; color:white');
    //sort out placeholder folders	
    let placeholderFolderAllExceptMatch = [...this.state.placeholderFolders.filter(item=>{
      return item.pathRef !== this.state.currentFolderRef;
    })];

    let placeholderFolderMatch = this.state.placeholderFolders.find(item=>{
      return item.pathRef === this.state.currentFolderRef;
    });
    console.log(`%cplaceholderFolderMatch: ${placeholderFolderMatch}`, 'background:blue; color:white');

    let placeholderMatchIndex=-1;	
    console.log(`%cthis.state.currentFolderRef: ${this.state.currentFolderRef}`, 'background:blue; color:white');
    if(this.state.placeholderFolders.length > 0){	
      console.log(`%cSOMETHING HERE...`, 'background:blue; color:white');
      placeholderMatchIndex = this.state.placeholderFolders.findIndex((item)=>{	
        console.log(`%citem.pathRef: ${item.pathRef}`, 'background:blue; color:white');
        return (item.pathRef === this.state.currentFolderRef);	
      });	
      console.log(`%cplacehodlerMatchIndex: ${placeholderMatchIndex}`, 'background:blue; color:white');
      //if found in placeholder...
      if(placeholderMatchIndex > -1){	
        //look in the pathfolders of placeholder (exclude the same name)
        let filtered = [...this.state.placeholderFolders[placeholderMatchIndex].pathfolders.filter(ref=>{	
          //go thru firebase folders and see if there is a match to 'folder' name	
          console.log(`%cref.location.path: ${ref.location.path}`, 'background:blue; color:white');
          let isFound = this.state.firebaseFolders.find(folderref=>{	
            return folderref.location.path === ref.location.path;	
          });	
          console.log(`%cISFOUND: ${isFound}`, 'background:blue; color:white');
          //if found, return false
          return (isFound === undefined) ? true : false;
        })];
        
        console.log(`%cUPDATED CHILDFOLDERS: ${filtered}`, 'background:blue; color:white');

        placeholderFolderMatch.pathfolders = filtered;	

        //set state
        this.setState({placeholderFolders: [...placeholderFolderAllExceptMatch, placeholderFolderMatch]})

      }	
    }
    console.log('%cEND==============================================', 'background:blue; color:white');
  }

  //resets state.allFolderList
  getAllFolders = (ref=null)=>{
    console.log(`%cSTART==============================================`, 'background:magenta; color:white');
    console.log(`%cFUNCTION getAllFolders, props: ${ref}`, 'background:magenta; color:white');
    this.setState({allFolderList:[]});
    this.findFoldersForBuild(ref===null? this.state.firebaseRootRef : ref);
    console.log(`%cEND==============================================`, 'background:magenta; color:white');
  }
  
  //RECURSIVE - gets all folders from ref onwards saving refs
  findFoldersForBuild = (ref) => {
    console.log('%cSTART==============================================', 'background:brown; color:white');
    console.log(`%cFUNCTION findFoldersForBuild, props: ${ref}`, 'background:brown; color:white');
    this.setState((prevState) => {
      return { allFolderList: [...prevState.allFolderList, ref] };
    });

    ref.listAll().then((res) => {
      //if the current folder does NOT have folders
      res.prefixes.forEach((folderRef) => {
        this.findFoldersForBuild(folderRef);
      });
    });
    console.log('%cEND==============================================', 'background:brown; color:white');
  };

  uploadUrlOverHandler = (event) => {
    // console.log('===================================');
    // console.log('%cFUNCTION uploadUrlOverHandler');
    this.setState({ uploadUrlOver: true });
  };

  uploadUrlOutHandler = (event) => {
    // console.log('===================================');
    // console.log('%cUNCTION uploadUrlOutHandler');
    this.setState({ uploadUrlOver: false });
  };

  errorConfirmedHandler = () => {
    console.log('==============================================')
    console.log('%cFUNCTION errorConfirmedHandler');
    this.setState({ errorModal: null });
  };

  editBreadcrumbModal = () => {
    console.log('==============================================')
    console.log('%cFUNCTION editBreadcrumbModal');
    this.setState((prevState) => {
      return {
        editBreadcrumbModal: true,
        currentFolderPath: prevState.currentFolderRef.location.path, //reset the value when modal is opened
        errorModalMessage: null,
      };
    });
  };





































// -------------------------------------------------------------------
//UPLOAD
// -------------------------------------------------------------------
  findDuplicateFile = (file) => {
    console.log('==============================================')
    console.log('FUNCTION findDuplicateFile');
    return this.state.selectedFiles.find((existingFile) => {
      const isDuplicate =
        existingFile.name === file.name &&
        existingFile.lastModified === file.lastModified &&
        existingFile.size === file.size &&
        existingFile.type === file.type;
      console.log('IS DUPLICATE? ', isDuplicate);
      return isDuplicate;
    });
  };

  fileChangedHandler = (event) => {
    console.log('==============================================')
    console.log('FUNCTION fileChangedHandler');
    event.preventDefault();
    event.persist();
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
      console.warn('Added file:', file);
    });
    console.log('FILES TO UPLOAD: ', toUpload);
    this.setState(
      (prevState) => {
        console.log('waypoint1!!!!');
        return {
          selectedFiles: [...toUpload],
        };
      },
      () => {
        console.log('waypoint2!!!!');
        console.log('this.state.selectedFiles: ', this.state.selectedFiles);
        this.state.selectedFiles.forEach((item, index) => {
          console.log('uploadHandler item: ', item.name);
          let file = this.state.selectedFiles[index];
          let fileName = this.state.selectedFiles[index].name;
          // console.log('FILE: ', file, '| filename: ', fileName);
          let fileRef = this.state.currentFolderRef.child(fileName);
    
          //using .fullPath
          //let path = fileRef.fullPath; //path is images/{filename}
          //put() takes files via javascript File and Blob api and uploads them to cloud storage
          let uploadTask = fileRef.put(file);
    
          uploadTask.on(
            'state_changed', //or firebase.storage.TaskEvent.STATE_CHANGED
            (snapshot) => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('UPLOAD PROGRESS: ', progress);
            },
            (error) => {
              console.log('error');
            },
            () => {
              //callback after completion
              console.log('uploaded file.');
              this.getFolderData(this.state.currentFolderRef);
            }
          );
        });
      }
    );

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

  fileCheckHandler = (index, isChecked, event = null) => {
    console.log('===================================');
    console.log('FUNCTION fileCheckHandler, props: ', index, isChecked);
    console.log('onChangeHandler CLICKED: ', index, isChecked);
    this.setState((prevState) => {
      let files = [...prevState.checkedFiles];
      files[index] = isChecked;
      return { checkedFiles: files };
    }, this.checkIndeterminate);
  };

  folderCheckHandler = (index, isChecked, event = null) => {
    console.log('FUNCTION folderCheckHandler, props: ', index, isChecked);
    console.log('onChangeHandler CLICKED: ', index, isChecked);
    this.setState((prevState) => {
      let folders = [...prevState.checkedFolders];
      folders[index] = isChecked;
      return { checkedFolders: folders };
    }, this.checkIndeterminate);
  };

  placeholderFolderCheckHandler = (index, isChecked, event = null)=>{
    console.log('FUNCTION placeholderFolderCheckHandler, props: ', index, isChecked);
    console.log('onChangeHandler CLICKED: ', index, isChecked);
    this.setState((prevState) => {
      let placeholderFolders = [...prevState.checkedPlaceholderFolders];
      placeholderFolders[index] = isChecked;
      console.log('placeholderFolders: ', placeholderFolders);
      return { checkedPlaceholderFolders: placeholderFolders };
    }, this.checkIndeterminate);
  }

  toggleCheckAllFolders = (isChecked) => {
    console.log('==============================================')
    console.log('FUNCTION toggleCheckAllFolders, props: ', isChecked);
    this.setState((prevState) => {
      //check all firebase folders
      let folders = [...prevState.firebaseFolders];
      let resultFolders = folders.map((item) => {
        return isChecked;
      });

      //check all pathfolders of current folder
      let placeholderFolderMatch = prevState.placeholderFolders.find(item=>{
        return item.pathRef === prevState.currentFolderRef;
      });
      let placeholderFolderMatchIndex = prevState.placeholderFolders.findIndex(item=>{  //note placeholderFolders stores object {path:, ref:, folders:[]}
        return item.pathRef === prevState.currentFolderRef;
      });
      let resultPathFolders = [];
      if(placeholderFolderMatch !== undefined){
        console.log('placeholderFolderMatchIndex: ', placeholderFolderMatchIndex);
        resultPathFolders = prevState.placeholderFolders[placeholderFolderMatchIndex].pathfolders.map(item=>{
          return isChecked;
        });
      }

      console.log('checkAllFolders: ', resultFolders, resultPathFolders);
      return { checkedFolders: resultFolders, checkedPlaceholderFolders:resultPathFolders };
    });
  };

  toggleCheckAllFiles = (isChecked) => {
    console.log('==============================================')
    console.log('FUNCTION toggleCheckAllFiles, props: ', isChecked);
    this.setState((prevState) => {
      let files = [...prevState.firebaseFiles];
      let result = files.map((item) => {
        return isChecked;
      });
      console.log('checkedFiles: ', result);
      return { checkedFiles: result };
    });
  };

  toggleMainChecked = (val) => {
    console.log('==============================================')
    console.log('FUNCTION toggleMainChecked, props: ', val);

    this.setState((prevState) => {
      return {
        mainChecked: val ? val : !prevState.mainChecked,
        mainIndeterminate: false,
      };
    });
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



  checkIndeterminate = () => {
    console.log('==============================================')
    console.log('FUNCTION checkIndeterminate');

    let placeholderFolderMatch = this.state.placeholderFolders.find(item=>{
      return item.pathRef === this.state.currentFolderRef;
    });

    let placeholderFolderMatchIndex = this.state.placeholderFolders.findIndex(item=>{  //note placeholderFolders stores object {path:, ref:, folders:[]}
      return item.pathRef === this.state.currentFolderRef;
    });

    let pathfolders = [];
    if(placeholderFolderMatch !== undefined){
      console.log('pathfolders: ', pathfolders);
      pathfolders = this.state.placeholderFolders[placeholderFolderMatchIndex].pathfolders;
    }
    let checkedItems =
      this.getCheckFoldersLength() + this.getCheckedFilesLength() + this.getCheckPlaceholderFoldersPathLength();
    let allItems = this.state.firebaseFiles.length + this.state.firebaseFolders.length + pathfolders.length;

    if (checkedItems === allItems) {
      this.setState({ mainIndeterminate: false, mainChecked: true });
    } else if (checkedItems === 0) {
      this.setState({ mainIndeterminate: false, mainChecked: false });
    } else if (checkedItems < allItems) {
      console.log('INDETERMINATE STATE!!');
      this.setState({ mainIndeterminate: true, mainChecked: true });
    }
  };



  






























  
// -------------------------------------------------------------------
//ADD folder
// -------------------------------------------------------------------
  addFolderHandler = (event) => {
    console.log('%cSTART==============================================', 'background:yellow; color:black');
    console.log('%cFUNCTION addFolderHandler', 'background:yellow; color:black');
    event.preventDefault();
    console.log(`%cthis.state.currentFolderRef.location.path: ${this.state.currentFolderRef.location.path}`, 'background:yellow; color:black');
    this.setState({ createFolderModal: true, errorModalMessage: false, createFolderName: ''});
    console.log('%cEND==============================================', 'background:yellow; color:black');
  };

  //new folder needs to be specific for the currentFolderRef
  addFolder = (folderRef) => {
    console.log('%cSTART==============================================', 'background:lime; color:black');
    console.log('%cFUNCTION addFolder', 'background:lime; color:black');
    console.log(`%cthis.state.currentFolderRef.location.path:${this.state.currentFolderRef.location.path}`, 'background:lime; color:black');
    this.setState((prevState)=>{
      
      //can we find it in firebase?
      console.log(`%ctry find in firebaseFolders`, 'background:lime; color:black');
      let foundInFirebaseIndex = prevState.firebaseFolders.findIndex((item)=>{
        console.log(`%ccompare - item.name: ${item.name} | folderRef: ${folderRef.name}`, 'background:lime; color:black');
        return item.name === folderRef.name;
      });
      console.log(`%cfoundInFirebaseIndex: ${foundInFirebaseIndex}`, 'background:lime; color:black');

      //if found in firebase...
      if(foundInFirebaseIndex > -1){
        console.log(`%cFOLDER EXISTS`, 'background:lime; color:black');
        this.setState({errorModalMessage: 'Path already exists'});
        return prevState;
      } 

      //current folder match...
      //try find current folder in placeholderFolders...
      

      let placeholderFolderAllExceptMatch = [...prevState.placeholderFolders.filter(item=>{
        return item.pathRef !== this.state.currentFolderRef;
      })];

      let placeholderFolderMatch = prevState.placeholderFolders.find(item=>{
        return item.pathRef === this.state.currentFolderRef;
      });

      let placeholderFolderMatchIndex = prevState.placeholderFolders.findIndex(item=>{  //note placeholderFolders stores object {path:, ref:, folders:[]}
        return item.pathRef === this.state.currentFolderRef;
      });
      
      console.log(`%cplaceholderFolderMatchIndex: ${placeholderFolderMatchIndex}`, 'background:lime; color:black');
      
      //not found in placeholderFolders?...add!
      if(placeholderFolderMatchIndex === -1){
        console.log('%cNOT FOUND, adding to pathfolders', 'background:lime; color:black');
        console.log(`%cfolderRef: ${folderRef}`, 'background:lime; color:black');
        let obj={pathRef: this.state.currentFolderRef, pathfolders: [folderRef]};
        
        return { placeholderFolders: [...prevState.placeholderFolders, obj], 
        //firebaseAndPlaceholderFolders:firebaseAndPlaceholderFolders, 
        createFolderModal: false}
      }
      //FOUND current folder in placeholderFolders
      else{
        //index in pathfolders
        let foundIndex = prevState.placeholderFolders[placeholderFolderMatchIndex].pathfolders.findIndex((item)=>{
          return item === folderRef;
        });

        //folder found in pathfolders
        if(foundIndex > -1){
          console.log(`%cFOLDER EXISTS`, 'background:lime; color:black');
          this.setState({errorModalMessage: 'Path already exists'});
          return prevState;
        }
        //not found in pathfolders
        else{
          console.log(`%cFOLDER DOES NOT EXIST YET`, 'background:lime; color:black');
          let isFound = placeholderFolderMatch.pathfolders.findIndex(item=>{
            return item === folderRef;
          });
          if(isFound === -1){
            let updatedFolders = [...placeholderFolderMatch.pathfolders, folderRef];
            placeholderFolderMatch.pathfolders = updatedFolders;
          }
          return { placeholderFolders: [...placeholderFolderAllExceptMatch, placeholderFolderMatch], createFolderModal: false}
        }
      }
    },()=>{
      console.log(`%cEND==============================================`, 'background:lime; color:black');
    });
  };
  
  





























  
// -------------------------------------------------------------------
//DELETE folder
// -------------------------------------------------------------------
  deleteFolder = async (ref)=>{
    console.log('%cSTART==============================================', 'background:red; color:white');
    console.log('%cFUNCTION deleteFolder', 'background:red; color:white');
    let res = await ref.listAll();
    //folders' children...
    //folders
    if (res.prefixes.length) {
      for(let folder of res.prefixes){
        await this.deleteFolder(folder);
      }
    }
    //folders' children...
    //delete the files
    if (res.items.length) {
      for(let file of res.items){
        await file.delete();
      }
    }
    console.log('%cEND==============================================', 'background:red; color:white');
  }

  deleteSelected = (event) => {
    console.log('%cSTART==============================================', 'background:grey; color:yellow');
    console.log('%cFUNCTION deleteSelected', 'background:grey; color:yellow');
    event.preventDefault();
    //go through file refs
    [...this.state.firebaseFiles].forEach(async (item, index) => {
      //remove checked
      if (this.state.checkedFiles[index] === true) {
        await item.delete();
        await this.getFolderData(this.state.currentFolderRef);
        this.setState({
          mainIndeterminate: false,
          mainChecked: false,
          checkedFiles: [],
        });
      }
    });

    //go through folder refs
    [...this.state.firebaseFolders].forEach(async (item, index) => {
      if (this.state.checkedFolders[index] === true) {
        //loop through folder
        await this.deleteFolder(item);//recursively go through folders and delete files
        await this.getFolderData(this.state.currentFolderRef); 
        this.setState(prevState=>{
          return {
            mainIndeterminate: false,
            mainChecked: false,
            checkedFolders: [],
          }
        });
      }
    });

    let placeholderFolderAllExceptMatch = this.state.placeholderFolders.filter(item=>{
      return item.pathRef !== this.state.currentFolderRef;
    });

    //cleanup Placeholders
    let placeholderFolderMatch = this.state.placeholderFolders.find(item=>{
      return item.pathRef === this.state.currentFolderRef;
    });
    console.log(`%cplaceholderFolderMatch: ${placeholderFolderMatch}`, 'background:grey; color:yellow');

    let placeholderMatchIndex=-1;	
    console.log(`%cthis.state.currentFolderRef: ${this.state.currentFolderRef}`, 'background:grey; color:yellow');
    if(this.state.placeholderFolders.length){	
      console.log('%cSOMETHING HERE...', 'background:grey; color:yellow');
      placeholderMatchIndex = this.state.placeholderFolders.findIndex((item)=>{	
        console.log(`%citem.pathRef: ${item.pathRef}`, 'background:grey; color:yellow');
        return (item.pathRef === this.state.currentFolderRef);	
      });	
      console.log(`%cplacehodlerMatchIndex: ${placeholderMatchIndex}`, 'background:grey; color:yellow');
      //if found in placeholder...
      if(placeholderMatchIndex > -1){	
        //go through placeholderFolders, check if .location.path includes pathfolders[index].name
        //try find 'name' in all the rest of placeholdFolders

        let cleanedUpPlaceholders = this.state.placeholderFolders.filter(item=>{

          let includeItem = placeholderFolderMatch.pathfolders.some((ref,index)=>{	
            return (item.pathRef.location.path.includes(ref.location.path) && this.state.checkedPlaceholderFolders[index] === true);
          });

          console.log(`%cis checked and in path?  ${includeItem}`, 'background:grey; color:yellow');

          return !includeItem;
        });

        console.log(`%ccleanedUpPlaceholders: ${cleanedUpPlaceholders}`, 'background:grey; color:yellow');
        let removeDud = cleanedUpPlaceholders.filter(item=>{
        console.log(`%citem.pathRef.location.path: ${item.pathRef.location.path}`, 'background:grey; color:yellow');
        console.log(`%cthis.state.currentFolderRef.location.path: ${this.state.currentFolderRef.location.path}`, 'background:grey; color:yellow');
        console.log(`%citem.pathfolders: ${item.pathfolders}`, 'background:grey; color:yellow');
        console.log(`%citem.pathfolders.length: ${item.pathfolders.length}`, 'background:grey; color:yellow');
          return !(item.pathRef.location.path === this.state.currentFolderRef.location.path);
        });

        console.log(`%cremoveDud: ${removeDud}`, 'background:grey; color:yellow');

        //look in the pathfolders of placeholder (exclude the same name)
        let filtered = placeholderFolderMatch.pathfolders.filter((ref,index)=>{	
          if(this.state.checkedPlaceholderFolders[index] === true){
            //it was checked...we need to delete it from pathfolders
            return false;
          }
          return true;
        });
        placeholderFolderMatch.pathfolders = filtered;
        let updatedPlaceholderFolders = [...removeDud]

        //we have now cut out all those pathfolders that were checked...
        this.setState({placeholderFolders: updatedPlaceholderFolders ,checkedPlaceholderFolders:[]})
      }
    }
    console.log('%cEND==============================================', 'background:grey; color:yellow');
  };




































  
// -------------------------------------------------------------------
//RENDER
// -------------------------------------------------------------------

  render() {
    console.log('%c==============================================', 'background:green;color:white');
    console.log('%cFUNCTION render', 'background:green;color:white');
    console.log(`%callFolderList *(firebase folder recursive): ${this.state.allFolderList}`, `background:green;color:white`);
    console.log(`%cfirebaseFolders: ${this.state.firebaseFolders}`, 'background:green;color:white');
    console.log(`%cfirebaseFiles: ${this.state.firebaseFiles}`, 'background:green;color:white');
    console.log(`%cplaceholderFolders: ${this.state.placeholderFolders}`, 'background:green;color:white');
    console.log(`%ccurrentFolderDrilldownRefs: ${this.state.currentFolderDrilldownRefs}`, 'background:green;color:white');
    console.log(`%ccurrentFolderRef: ${this.state.currentFolderRef}`, 'background:green;color:white');
    console.log(`%ccurrentFolderPath: ${this.state.currentFolderPath}`, 'background:green;color:white');
    console.log(`%ccheckedPlaceholderFolders: ${this.state.checkedPlaceholderFolders}`, 'background:green;color:white');
    console.log(`%ccheckedFolders: ${this.state.checkedFolders}`, 'background:green;color:white');
    console.log(`%ccheckedFiles: ${this.state.checkedFiles}`, 'background:green;color:white');
    //sort out placeholder folders
    let placeholderMatchIndex=-1;
    let pathFolders = [];

    if(this.state.placeholderFolders.length){
      console.log('SOMETHING HERE...')
      placeholderMatchIndex = this.state.placeholderFolders.findIndex((item)=>{
        return (item.pathRef.location.path === this.state.currentFolderRef.location.path);
      });
      
      console.log('placeholderMatchIndex: ', placeholderMatchIndex);
    
      if(placeholderMatchIndex > -1){
        pathFolders = this.state.placeholderFolders[placeholderMatchIndex].pathfolders;
      }
    }
    
    let sortedDOM = [
      
      //placeholderFolders
      ...pathFolders.map((item, index)=>{
        console.log('pathfolder:', item);
        let key = this.state.currentFolderRef.location.path+'_placeholderfolder_'+index;
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
              aligntype="FlexStart"
              hovereffect={true}
              onClick={() => {
                console.clear();
                console.log('CHANGING FOLDER :)');
                this.changeFolderPath(item)
              }}
              title={item.name}
            >
              <Icon iconstyle="far" code="folder" size="lg" />
              <p>{item.name}/</p>
            </ListItem>
          </React.Fragment>
        );
      }),

      //firebase folders
      ...this.state.firebaseFolders.map((item, index)=>{
          
        let key = this.state.currentFolderRef.location.path+'_folder_'+index;
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
              aligntype="FlexStart"
              hovereffect={true}
              onClick={() => {
                console.clear();
                console.log('CHANGING FOLDER :)');
                this.changeFolderPath(item)
              }}
              title={item.name}
            >
              <Icon iconstyle="far" code="folder" size="lg" />
              <p>{item.name}/</p>
            </ListItem>
          </React.Fragment>
        );
      })
    ].sort((a,b)=>{
      var nameA = a.props.children[1].props.title.toLowerCase();
      var nameB = b.props.children[1].props.title.toLowerCase();
      console.log('compare: ', nameA, '| ', nameB);
      if(nameA < nameB){
        return -1;
      }
      if(nameA > nameB){
        return 1;
      }
      return 0;
    })

    //console.log('this.state.firebaseAndPlaceholderFolders: ', this.state.firebaseAndPlaceholderFolders);
    console.log('sortedDOM: ', sortedDOM);
    console.log('this.state.firebaseFiles: ', this.state.firebaseFiles);
    let currentFolderData = [
      ...sortedDOM,
      //=====================================
      ...this.state.firebaseFiles.map((item, index) => {
        let key = this.state.currentFolderRef.location.path+'_firebaseFiles_'+index;
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
              aligntype="FlexStart"
              hovereffect={true}
              //onClick={() => this.changeFolderPath(item)}
            >
              <Icon iconstyle="far" code="file" size="lg" />
              <p>{item.name}</p>
            </ListItem>
          </React.Fragment>
        );
      }),
    ];
    
    let isIndeterminateClass =
      this.state.mainIndeterminate === true ||
      (this.getCheckFoldersLength() + this.getCheckedFilesLength() ===
        this.state.firebaseFiles.length + this.state.firebaseFolders.length &&
        this.state.firebaseFiles.length + this.state.firebaseFolders.length > 0)
        ? classes.StyleUploadIndeterminate
        : null;

    //console.log('IS INDETERMINATE: ', isIndeterminateClass);

    let isHoverUploadUrl =
      this.state.uploadUrlOver === true
        ? classes.UploadUrlOver
        : classes.UploadUrlOut;
    console.log('%c==============================================', 'background:green;color:white');
    return (
      <div className={classes.Upload}>
        <div className={[classes.Border].join(' ')}>
          <div
            className={[classes.UploadHeader, isIndeterminateClass].join(' ')}
            onMouseOver={this.uploadUrlOverHandler}
            onMouseOut={this.uploadUrlOutHandler}
          >
            {this.state.mainIndeterminate === true ||
            (this.getCheckFoldersLength() + this.getCheckedFilesLength() + this.getCheckPlaceholderFoldersPathLength() ===
              this.state.firebaseFiles.length + this.state.firebaseFolders.length + pathFolders.length &&
              this.state.firebaseFiles.length + this.state.firebaseFolders.length + pathFolders.length > 0) ? (
              <React.Fragment>
                <div className={classes.UploadIndeterminate}>
                  <Button
                    type="CheckboxSize"
                    color="White"
                    onClick={(event) => {
                      event.preventDefault();
                      this.toggleMainChecked(false);
                      this.toggleCheckAllFolders(false);
                      this.toggleCheckAllFiles(false);
                    }}
                  >
                    <Icon iconstyle="fas" code="times" size="lg" />
                  </Button>
                  <span>
                    {this.getCheckFoldersLength() +
                      this.getCheckedFilesLength() +
                      this.getCheckPlaceholderFoldersPathLength() + 
                      ' selected'}
                  </span>
                </div>
                <Button type="Action" onClick={(event)=>{
                  this.deleteSelected(event);

                  //update folders
                  this.getAllFolders();
                  
                  }}>
                  Delete
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={classes.UploadUrl}>
                  <Breadcrumb
                    path={this.state.currentFolderDrilldownRefs}
                    onClick={(ref) => this.changeFolderPath(ref)}
                    onEdit={() => this.editBreadcrumbModal()}
                  ></Breadcrumb>

                  <div
                    className={[classes.Divider, isHoverUploadUrl].join(' ')}
                    title="edit"
                    onClick={() => this.editBreadcrumbModal()}
                  >
                    <Icon iconstyle="fas" code="edit" size="sm" />
                  </div>
                </div>
                <div className={[classes.UploadActionButtons].join(' ')}>
                  <input
                    ref={this.uploadRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event)=>{
                      console.clear();
                      this.fileChangedHandler(event);
                    }
                    }
                  />
                  <Button
                    type="Action"
                    onClick={(event) => {
                      event.preventDefault();
                      this.uploadRef.current.click();
                    }}
                    title="upload"
                  >
                    <Icon iconstyle="fas" code="arrow-circle-up" size="lg" />
                    Upload file
                  </Button>
                  <Button
                    type="LastItemRight"
                    onClick={this.addFolderHandler}
                    title="new folder"
                  >
                    <Icon iconstyle="fas" code="folder-plus" size="lg" />
                  </Button>
                </div>
              </React.Fragment>
            )}
          </div>

          <React.Fragment>
            <div className={classes.UploadBodyHeader}>
              <div className={classes.HeaderRow}>
                <Checkbox
                  index={0}
                  checked={this.state.mainChecked}
                  indeterminate={this.state.mainIndeterminate}
                  onChange={() => {
                    this.toggleMainChecked();
                    this.toggleCheckAllFolders(!this.state.mainChecked);
                    this.toggleCheckAllFiles(!this.state.mainChecked);
                  }}
                ></Checkbox>
                <span className={classes.LabelName}>Name</span>
              </div>
            </div>

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
                      aligntype="FlexStart"
                      hovereffect={true}
                      onClick={() => {
                        //get current index on drilldown,
                        let index = this.state.currentFolderDrilldownRefs.findIndex(
                          (item) => {
                            return (
                              item.location.path ===
                              this.state.currentFolderRef.location.path
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
                        iconstyle="fas"
                        code="level-up-alt"
                        size="sm"
                        flip="horizontal"
                      />
                      ../
                    </ListItem>
                  </div>
                ) : null
              }

              {currentFolderData.length  ? (
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

        {/* create folder modal for all instances */
        // --------------------------------------------------------------------
        }
        <Modal
          label="Create folder"
          show={this.state.createFolderModal}
          isInteractive={true}
          modalClosed={() => {
            this.setState({ createFolderModal: false });
          }}
          continue={() => {
            console.clear();
            console.log('continue');
            const newRef = this.state.currentFolderRef.child(this.state.createFolderName);
            this.addFolder(newRef);
            //refresh list of all firebase folders
            this.getAllFolders();
          }}
        >
          <Input
            value={{ data: this.state.createFolderName }}
            placeholder="Folder name"
            onChange={(event) => {
              event.preventDefault();
              console.log('typed: ', event.target.value);
              let targetVal = event.target.value;

              this.setState((prevState) => {
                return {
                  errorModalMessage: null,
                  createFolderName: targetVal,
                };
              });
            }}
          />
          <div className={classes.Errors}>{this.state.errorModalMessage}</div>
        </Modal>
        {/* edit folder modal for all instances */
        // --------------------------------------------------------------------
        }
        <Modal
          label="Edit folder path"
          show={this.state.editBreadcrumbModal}
          isInteractive={true}
          modalClosed={() => {
            this.setState({
              editBreadcrumbModal: false,
              errorModalMessage: null,
            });
          }}
          continue={() => {
            console.log('continue');
            //go through directory list
            //navigate if folders exists..
            //ie. check all paths in directory list
            try {
              this.state.allFolderList.forEach((item, index) => {
                console.log(
                  `allFolderList item: index:[${index}]`,
                  item.location.path
                );
                if (item.location.path === this.state.currentFolderPath) {
                  //found in drilldown...so it exists, navigate to it
                  this.changeFolderPath(item);
                  //on continue, navigate to new ref
                  this.setState({
                    editBreadcrumbModal: false,
                    errorModalMessage: null,
                  });
                } else if (
                  this.state.currentFolderPath[
                    this.state.currentFolderPath.length - 1
                  ] === '/'
                ) {
                  console.error('path does not exist');
                  this.setState({
                    errorModalMessage:
                      'Remove trailing "/" character from path',
                  });
                } else {
                  console.error('path does not exist');
                  this.setState({
                    errorModalMessage: 'Path does not exist',
                  });
                }
              });
            } catch {
              //go thru drilldown,
              this.state.currentFolderDrilldownRefs.forEach((item) => {
                //compare to drilldown ref.location.path, if found, that is the new ref

                if (item.location.path === this.state.currentFolderPath) {
                  //found in drilldown...so it exists, navigate to it
                  this.changeFolderPath(item);
                  //on continue, navigate to new ref
                  this.setState({
                    editBreadcrumbModal: false,
                    errorModalMessage: null,
                  });
                } else if (
                  this.state.currentFolderPath[
                    this.state.currentFolderPath.length - 1
                  ] === '/'
                ) {
                  console.error('path does not exist');
                  this.setState({
                    errorModalMessage:
                      'Remove trailing "/" character from path',
                  });
                } else {
                  console.error('path does not exist');
                  this.setState({
                    errorModalMessage: 'Path does not exist',
                  });
                }
              });
            }
          }}
        >
          <Input
            value={{
              data: this.state.currentFolderPath
                ? this.state.currentFolderPath
                : null,
            }}
            placeholder="Folder"
            onChange={(event) => {
              event.preventDefault();
              console.log('typed: ', event.target.value);
              this.setState({ currentFolderPath: event.target.value });
            }}
          />
          <div className={classes.Errors}>{this.state.errorModalMessage}</div>
        </Modal>
      </div>
    );
    
  }
}
export default withRouter(Upload);
