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
    console.log('NOTE: console.log() happens before setState() as setState() is async');
    console.log('%cSTART CONSTRUCTOR Upload==============================================', 'background:white; color:red')
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
    console.log('%cEND==============================================', 'background:white; color:red')
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

  async componentDidMount() {
    console.log('%cSTART FUNCTION componentDidMount==============================================', 'background:white; color:red')
    //get from storage folders
    // Get a reference to the storage service, which is used to create references in your storage bucket
    this.storage = firebase.storage();
    this.storageRef = this.storage.ref(); // Create a storage reference from our storage service
    //get id from querystring
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get('id'); //get id in url query params

    let ref = this.storageRef;

    if (id) {
      console.log(`\t%cEXISTS - id: ${id}`, 'background:white; color:red');
      // //current id folder
      ref = this.storageRef.child(id);
    } else {
      ref = this.storageRef;
    }
    console.log(`\t%cSETSTATE: {firebaseRootRef:${ref}}`, 'background:yellow; color:red');
    await this.setState((prevState)=>{
      return {firebaseRootRef: ref}
    });
    console.log('%cEND==============================================', 'background:white; color:red');
    await this.changeFolderPath(ref);
    await this.getAllFolders(ref);
  }

  changeFolderPath = async (ref) => {
    console.log('%cSTART FUNCTION changeFolderPath==============================================', 'background:orange; color:white')
    console.log(`\t%cprops: ${ref}`, 'background:orange; color:white');
    await this.setCurrentFolderRef(ref); //sets state.currentFolderRef , state.currentFolderPath
    
    console.log(`\t%cSETSTATE: `, 'background:yellow; color:red');
    console.log(`\t%cmainChecked:${false}`, 'background:yellow; color:red');
    console.log(`\t%cmainIndeterminate:${false}`, 'background:yellow; color:red');
    console.log(`\t%ccheckedFolders:[]`, 'background:yellow; color:red');
    console.log(`\t%ccheckedFiles:[]`, 'background:yellow; color:red');
    console.log(`\t%ccheckedPlaceholderFolders:[]`, 'background:yellow; color:red');
    //reset checked folders and files
    await this.setState((prevState)=>{
      return {
        mainChecked: false,
        mainIndeterminate: false,
        checkedFolders: [], //all checked folders in current folder
        checkedFiles: [], //all checked files in current folder
        checkedPlaceholderFolders:[] //all checked temporary folders (not in firebase yet) in current folder
      } 
    });
    
    //go through exisiting references, look for current reference (===) the ref from props,
    let index = this.state.currentFolderDrilldownRefs.findIndex((item) => {
      return item === ref;
    });
    console.log(`\t%cindex in currentFolderDrilldownRefs: ${index}`, 'background:orange; color:white');
    //if it is found, then slice off from currentFolderDrilldownRefs onwards...(we navigated back)...
    //else if not found, then add to currentFolderDrilldownRefs.
    (index > -1) ? await this.updateFolderDrilldown(ref) : await this.addCurrentFolderToDrilldown(ref);

    console.log(`\t%cbefore getFolderData...`, 'background:orange; color:white');
    await this.getFolderData(ref);// from ref.. sets firebaseFolders, firebaseFiles
    console.log(`\t%cafter getFolderData...`, 'background:orange; color:white');

    console.log(`\t%c!! state.firebaseFolders: ${this.state.firebaseFolders}`, 'background:orange; color:white');
    console.log(`\t%c!! state.firebaseFiles: ${this.state.firebaseFiles}`, 'background:orange; color:white');
    await this.removeDuplicateFolders();
    console.log('%cEND==============================================', 'background:orange; color:white') 
  };  

  setCurrentFolderRef = async (ref) => {
    console.log('%cSTART FUNCTION setCurrentFolderRef==============================================', 'background:pink; color:black');
    console.log(`\t%cprops: ${ref}`, 'background:pink; color:black');
    console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
    console.log(`\t%ccurrentFolderRef:${ref}`, 'background:yellow; color:red');
    console.log(`\t%ccurrentFolderPath:${ref.location.path}`, 'background:yellow; color:red');
    await this.setState((prevState)=>{   
      return { currentFolderRef: ref, currentFolderPath: ref.location.path }
    });
    console.log('%cEND==============================================', 'background:pink; color:black');
  };

  updateFolderDrilldown = async (ref) => {
    console.log('%cSTART==============================================', 'background:purple; color:white');
    console.log(`%cFUNCTION updateFolderDrilldown, props: ${ref}`, 'background:purple; color:white');
    let index = this.state.currentFolderDrilldownRefs.findIndex((item) => {
      return item.location.path === ref.location.path; //comparing object paths
    });
    let updatedFolders = this.state.currentFolderDrilldownRefs.slice(
      0,
      index + 1
    );
    console.log(`\t%cSETSTATE: currentFolderDrilldownRefs:${updatedFolders}`, 'background:yellow; color:red');
    await this.setState((prevState)=>{
      return{ currentFolderDrilldownRefs: updatedFolders }
    });
    console.log('%cEND==============================================', 'background:purple; color:white')
  };

  addCurrentFolderToDrilldown = async (ref) => {
    console.log('%cSTART FUNCTION addCurrentFolderToDrilldown==============================================', 'background:tomato; color:white');
    console.log(`\t%cprops: ${ref}`, 'background:tomato; color:white');
    console.log(`\t%cSETSTATE: currentFolderDrilldownRefs: ${[this.state.currentFolderDrilldownRefs,ref]}`, 'background:yellow; color:red');
    await this.setState((prevState) => {
      return {
        currentFolderDrilldownRefs: [
          ...prevState.currentFolderDrilldownRefs,
          ref,
        ],
      };
    });
    console.log('%cEND==============================================', 'background:tomato; color:white');
  };
  
  //sets state.firebaseFolders, state.firebaseFiles
  getFolderData = async (ref) => {
    //reset folder first...
    console.log('%cSTART FUNCTION getFolderData==============================================', 'background:cyan; color:black');
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
    console.log("\t%creset firebaseFolders to []", 'background:cyan; color:black');
    console.log('\t%creset firebaseFiles to []', 'background:cyan; color:black');
    // //save to state folder ref from firebase storage
    await ref.listAll().then( async (res) => {
      console.log('\t%cref.listAll() ...', 'background:cyan; color:black');
      let folders = [];
      if (res.prefixes.length) {
        res.prefixes.forEach((folderRef) => {
          //console.log(`\t%cfolder: ${folderRef.name}`, 'background:cyan; color:black');
          folders.push(folderRef);
          //console.log(`\t%call folder name: ${folders.map((item) => { return item.name; })}`,'background:cyan; color:black');
        });
      }
      folders.forEach(item=>{
        console.log(`\t%cfolders: ${item}`,'background:cyan; color:black');
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
      files.forEach(item=>{
        console.log(`\t%cfiles: ${item}`,'background:cyan; color:black');
      });
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(`\t%cfirebaseFolders: folders`, 'background:yellow; color:red');
      console.log(`\t%cfirebaseFiles: files`, 'background:yellow; color:red');
      await this.setState((prevState) => {
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
  removeDuplicateFolders = async ()=>{
    console.log('%cSTART FUNCTION removeDuplicateFolders==============================================', 'background:blue; color:white');
    //sort out placeholder folders	
    let placeholderFolderAllExceptMatch = [...this.state.placeholderFolders.filter(item=>{
      return item.pathRef !== this.state.currentFolderRef;
    })];

    let placeholderFolderMatch = this.state.placeholderFolders.find(item=>{
      return item.pathRef === this.state.currentFolderRef;
    });
    console.log(`\t%cplaceholderFolderMatch: ${placeholderFolderMatch}`, 'background:blue; color:white');

    let placeholderMatchIndex=-1;	
    console.log(`\t%cthis.state.currentFolderRef: ${this.state.currentFolderRef}`, 'background:blue; color:white');
    if(this.state.placeholderFolders.length > 0){	
      console.log(`\t%cSOMETHING HERE...`, 'background:blue; color:white');
      placeholderMatchIndex = this.state.placeholderFolders.findIndex((item)=>{	
        console.log(`\t%citem.pathRef: ${item.pathRef}`, 'background:blue; color:white');
        return (item.pathRef === this.state.currentFolderRef);	
      });	
      console.log(`\t%cplacehodlerMatchIndex: ${placeholderMatchIndex}`, 'background:blue; color:white');
      //if found in placeholder...
      if(placeholderMatchIndex > -1){	
        //look in the pathfolders of placeholder (exclude the same name)
        let filtered = [...this.state.placeholderFolders[placeholderMatchIndex].pathfolders.filter(ref=>{	
          //go thru firebase folders and see if there is a match to 'folder' name	
          console.log(`\t%cref.location.path: ${ref.location.path}`, 'background:blue; color:white');
          let isFound = this.state.firebaseFolders.find(folderref=>{	
            return folderref.location.path === ref.location.path;	
          });	
          console.log(`\t%cISFOUND: ${isFound}`, 'background:blue; color:white');
          //if found, return false
          return (isFound === undefined) ? true : false;
        })];
        
        console.log(`\t%cUPDATED CHILDFOLDERS: ${filtered}`, 'background:blue; color:white');

        placeholderFolderMatch.pathfolders = filtered;	

        //set state
        console.log(`\t%cSETSTATE: placeholderFolders: ${[...placeholderFolderAllExceptMatch, placeholderFolderMatch]}`, 'background:yellow; color:red');
        this.setState((prevState)=>{
          return {placeholderFolders: [...placeholderFolderAllExceptMatch, placeholderFolderMatch]}
        });

      }	
    }
    console.log('%cEND==============================================', 'background:blue; color:white');
  }

  //resets state.allFolderList
  getAllFolders = async (ref=null)=>{
    console.log(`%cSTART FUNCTION getAllFolders==============================================`, 'background:magenta; color:white');
    console.log(`\t%cprops: ${ref}`, 'background:magenta; color:white');
    let allArray = await this.findFoldersForBuild(ref===null? this.state.firebaseRootRef : ref, []);
    console.log(`\t%callArray: ${allArray}`, 'background:magenta; color:white');
    console.log(`\t%cSETSTATE: allFolderList: ${allArray}`, 'background:yellow; color:red');
    await this.setState((prevState)=>{
      return {allFolderList:allArray}
    });
    console.log(`%cEND==============================================`, 'background:magenta; color:white');
  }
  
  //RECURSIVE - gets all folders from ref onwards saving refs
  findFoldersForBuild = async (ref, arr) => {
    console.log('%cSTART FUNCTION findFoldersForBuild==============================================', 'background:brown; color:white');
    console.log(`\t%cprops: ${ref}`, 'background:brown; color:white');
    arr.push(ref);
    console.log(`\t%cSETSTATE: allFolderList: ${[this.state.allFolderList, ref]}`, 'background:yellow; color:red');
    await ref.listAll().then((res) => {
      //if the current folder does NOT have folders
      res.prefixes.forEach(async(folderRef) => {
        await this.findFoldersForBuild(folderRef, arr);
      });
    });
    console.log('%cEND==============================================', 'background:brown; color:white');
    return arr;

  };

  uploadUrlOverHandler = async (event) => {
    if(this.state.uploadUrlOver === false){
      console.log('%cSTART FUNCTION uploadUrlOverHandler===================================', 'background:black; color:red');
      console.log(`\t%cEvent target :${event.target}`, 'background:black; color:red;')
      await this.setState((prevState)=>{
        console.log(`\t%cSETSTATE: uploadUrlOver: ${true}`, 'background:yellow; color:red');
        return {uploadUrlOver: true };
      });
      console.log('%cEND===================================', 'background:black; color:red');
    }
  };

  uploadUrlOutHandler = async (event) => {
    console.log('%cSTART FUNCTION uploadUrlOutHandler===================================', 'background:black; color:red');
    console.log(`\t%cEvent target :${event.target}`, 'background:black; color:red;');
    await this.setState((prevState)=>{
      console.log(`\t%cSETSTATE: uploadUrlOver: ${false}`, 'background:yellow; color:red');
      return {uploadUrlOver: false };
    });
    console.log('%cEND===================================', 'background:black; color:red');
  };

  errorConfirmedHandler = async () => {
    console.log('%cSTART FUNCTION errorConfirmedHandler==============================================', 'background:grey; color:white');
    await this.setState((prevState)=>{
      console.log(`\t%cSETSTATE: errorModal: null`, 'background:yellow; color:red');
      return { errorModal: null }
    });
    console.log('%cEND==============================================', 'background:grey; color:white');
  };

  editBreadcrumbModal = async () => {
    console.log('%cSTART FUNCTION editBreadcrumbModal==============================================', 'background:gold; color:blue');
    await this.setState((prevState) => {
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(`\t%ceditBreadcrumbModal: ${true}`, 'background:yellow; color:red');
      console.log(`\t%ccurrentFolderPath: ${prevState.currentFolderRef.location.path}, `, 'background:yellow; color:red');
      console.log(`\t%cerrorModalMessage: ${null}`, 'background:yellow; color:red');
      return {
        editBreadcrumbModal: true,
        currentFolderPath: prevState.currentFolderRef.location.path, //reset the value when modal is opened
        errorModalMessage: null,
      };
    });
    console.log('%cEND==============================================', 'background:gold; color:blue');
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
    console.log('%cSTART FUNCTION fileChangedHandler==============================================', 'background:salmon; color:white');
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
    console.log(`\t%cFILES TO UPLOAD: ${toUpload}`, 'background:salmon; color:white');
    console.log('\t%cwaypoint1!!!!', 'background:salmon; color:white');
    await this.setState(
      (prevState) => {
        console.log(`\t%cSETSTATE: selectedFiles: ${[...toUpload]}`, 'background:yellow; color:red');
        return {
          selectedFiles: [...toUpload],
        };
      }
    );
    console.log(`\t%cCALLBACK (waypoint2)!!!!'`, 'background:salmon; color:white');
    console.log(`\t%cthis.state.selectedFiles: ${this.state.selectedFiles}`, 'background:salmon; color:white');
    
    await Promise.all(this.state.selectedFiles.map( 
      (item, index) => {
        console.log(`\t%cuploadHandler item: ${item.name}`, 'background:salmon; color:white');
        let file = this.state.selectedFiles[index];
        let fileName = this.state.selectedFiles[index].name;
        // console.log('FILE: ', file, '| filename: ', fileName);
        let fileRef = this.state.currentFolderRef.child(fileName);
        //using .fullPath
        //let path = fileRef.fullPath; //path is images/{filename}
        //put() takes files via javascript File and Blob api and uploads them to cloud storage
        let uploadTask = fileRef.put(file);
        return new Promise((resolve, reject)=>{
          uploadTask.on(
            'state_changed', //or firebase.storage.TaskEvent.STATE_CHANGED
            (snapshot) => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`\t%cUPLOAD PROGRESS: ${progress}`, 'background:salmon; color:white');
            }, (error)=>{
              reject(new Error('FAIL!!'));
            },
            async ()=>{
              console.log('\t%cCOMPLETED!!', 'background:salmon; color:white');
              await this.getFolderData(this.state.currentFolderRef);
              resolve();
            }
          );
        });
      }
    )).then(()=>{
      console.log('\t%cDONE', 'background:salmon; color:white');
      console.log('%c==============================================', 'background:salmon; color:white');
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
    console.log('%cSTART FUNCTION fileCheckHandler===================================','background:aquamarine; color:yellow');
    console.log(`\t%cprops: ${index}, ${isChecked}`,'background:aquamarine; color:yellow');
    console.log(`\t%conChangeHandler CLICKED: ${index}, ${isChecked}`,'background:aquamarine; color:yellow');
    await this.setState((prevState) => {
      let files = [...prevState.checkedFiles];
      files[index] = isChecked;
      console.log(`\t%cSETSTATE: checkedFiles: ${files}`, 'background:yellow; color:red');
      return { checkedFiles: files };
    });

    await this.checkIndeterminate();
    console.log('%cEND==============================================','background:aquamarine; color:yellow');
  };

  folderCheckHandler = async (index, isChecked, event = null) => {
    console.log('%cSTART FUNCTION folderCheckHandler===================================','background:yellowgreen; color:yellow');
    console.log(`\t%cprops: ${index}, ${isChecked}`,'background:yellowgreen; color:yellow');
    console.log('\t%conChangeHandler CLICKED: ', index, isChecked,'background:yellowgreen; color:yellow');
    await this.setState((prevState) => {
      let folders = [...prevState.checkedFolders];
      folders[index] = isChecked;
      console.log(`\t%cSETSTATE: checkedFolders: ${folders}`, 'background:yellow; color:red');
      return { checkedFolders: folders };
    });
    await this.checkIndeterminate();
    console.log('%cEND==============================================','background:yellowgreen; color:yellow');
  };

  placeholderFolderCheckHandler = async (index, isChecked, event = null)=>{
    console.log('%cSTART FUNCTION placeholderFolderCheckHandler===================================','background:darkseagreen; color:yellow');
    console.log(`\t%cprops: ${index}, ${isChecked}`,'background:darkseagreen; color:yellow');
    console.log(`\t%conChangeHandler CLICKED: ', ${index}, ${isChecked}`,'background:darkseagreen; color:yellow');
    await this.setState((prevState) => {
      let placeholderFolders = [...prevState.checkedPlaceholderFolders];
      placeholderFolders[index] = isChecked;
      console.log(`\t%cplaceholderFolders: ${placeholderFolders}`,'background:darkseagreen; color:yellow');
      console.log(`\t%cSETSTATE: checkedPlaceholderFolders: ${placeholderFolders}`, 'background:yellow; color:red');
      return { checkedPlaceholderFolders: placeholderFolders };
    });
    await this.checkIndeterminate();
    console.log('%cEND==============================================','background:darkseagreen; color:yellow');
  }

  toggleCheckAllFolders = async (isChecked) => {
    console.log('%cSTART FUNCTION toggleCheckAllFolders==============================================', 'background:lime; color:yellow');
    console.log(`\t%cprops: ${isChecked}`, 'background:lime; color:yellow');
    await this.setState((prevState) => {
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
        console.log(`\t%cplaceholderFolderMatchIndex: ', ${placeholderFolderMatchIndex}`, 'background:lime; color:yellow');
        resultPathFolders = prevState.placeholderFolders[placeholderFolderMatchIndex].pathfolders.map(item=>{
          return isChecked;
        });
      }

      console.log(`\t%ccheckAllFolders: ${resultFolders} , ${resultPathFolders}`, 'background:lime; color:yellow');
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(`\t%ccheckedFolders: ${resultFolders}`, 'background:yellow; color:red');
      console.log(`\t%ccheckedPlaceholderFolders: ${resultPathFolders}`, 'background:yellow; color:red');
      return { checkedFolders: resultFolders, checkedPlaceholderFolders:resultPathFolders };
    });
    console.log('%cEND==============================================', 'background:lime; color:yellow');
  };

  toggleCheckAllFiles = async (isChecked) => {
    console.log('%cSTART FUNCTION toggleCheckAllFiles==============================================','background:mediumorchid; color:white');
    console.log(`\t%cprops: ${isChecked}`,'background:mediumorchid; color:white');
    await this.setState((prevState) => {
      let files = [...prevState.firebaseFiles];
      let result = files.map((item) => {
        return isChecked;
      });
      console.log(`\t%ccheckedFiles: ${result}`,'background:mediumorchid; color:white');
      console.log(`\t%cSETSTATE: checkedFiles: ${result}`, 'background:yellow; color:red');
      return { checkedFiles: result };
    });
    console.log('%cEND==============================================','background:mediumorchid; color:white');
  };

  toggleMainChecked = async (val) => {
    console.log('%cSTART FUNCTION toggleMainChecked==============================================','background:dodgerblue; color:white');
    console.log(`\t%cprops: ${val}`,'background:dodgerblue; color:white');
    await this.setState((prevState) => {
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(`\t%cmainChecked: ${ val ? val : !prevState.mainChecked}`, 'background:yellow; color:red');
      console.log(`\t%cmainIndeterminate: false`, 'background:yellow; color:red');
      return {
        mainChecked: val ? val : !prevState.mainChecked,
        mainIndeterminate: false,
      };
    });
    console.log('%cEND==============================================','background:dodgerblue; color:white');
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
    console.log(`%cSTART FUNCTION checkIndeterminate==============================================`,'background:peru; color:yellow');
    let placeholderFolderMatch = this.state.placeholderFolders.find(item=>{
      return item.pathRef === this.state.currentFolderRef;
    });

    let placeholderFolderMatchIndex = this.state.placeholderFolders.findIndex(item=>{  //note placeholderFolders stores object {path:, ref:, folders:[]}
      return item.pathRef === this.state.currentFolderRef;
    });

    let pathfolders = [];
    if(placeholderFolderMatch !== undefined){
      console.log(`\t%cpathfolders: ${pathfolders}`,'background:peru; color:yellow');
      pathfolders = this.state.placeholderFolders[placeholderFolderMatchIndex].pathfolders;
    }
    let checkedItems =
      this.getCheckFoldersLength() + this.getCheckedFilesLength() + this.getCheckPlaceholderFoldersPathLength();
    let allItems = this.state.firebaseFiles.length + this.state.firebaseFolders.length + pathfolders.length;

    if (checkedItems === allItems) {
      await this.setState((prevState)=>{
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(`\t%cmainIndeterminate: ${false}`, 'background:yellow; color:red');
        console.log(`\t%cmainChecked: ${true}`, 'background:yellow; color:red');
        return { mainIndeterminate: false, mainChecked: true };
      });
    } else if (checkedItems === 0) {
      await this.setState((prevState)=> {
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(`\t%cmainIndeterminate: ${false}`, 'background:yellow; color:red');
        console.log(`\t%cmainChecked: ${false}`, 'background:yellow; color:red');
        return { mainIndeterminate: false, mainChecked: false };
      });
    } else if (checkedItems < allItems) {
      console.log('\t%cINDETERMINATE STATE!!','background:peru; color:yellow');
      await this.setState((prevState)=>{
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(`\t%cmainIndeterminate: ${true}`, 'background:yellow; color:red');
        console.log(`\t%cmainChecked: ${true}`, 'background:yellow; color:red');
        return{ mainIndeterminate: true, mainChecked: true };
      });
    }
    console.log('%cEND==============================================','background:peru; color:yellow');
  };



  






























  
// -------------------------------------------------------------------
//ADD folder
// -------------------------------------------------------------------
  addFolderHandler = async (event) => {
    console.log('%cSTART FUNCTION addFolderHandler==============================================', 'background:orangered; color:white');
    event.preventDefault();
    console.log(`\t%cthis.state.currentFolderRef.location.path: ${this.state.currentFolderRef.location.path}`, 'background:orangered; color:white');
    
    await this.setState((prevState)=>{
      console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
      console.log(`\t%ccreateFolderModal: ${true}`, 'background:yellow; color:red');
      console.log(`\t%cerrorModalMessage: ${false}`, 'background:yellow; color:red');
      console.log(`\t%ccreateFolderName: ${''}`, 'background:yellow; color:red');
      return{ createFolderModal: true, errorModalMessage: false, createFolderName: ''}
    });
    console.log('%cEND==============================================', 'background:orangered; color:white');
  };

  //new folder needs to be specific for the currentFolderRef
  addFolder = async (folderRef) => {
    console.log('%cSTART FUNCTION addFolder==============================================', 'background:lime; color:black');
    console.log(`\t%cthis.state.currentFolderRef.location.path:${this.state.currentFolderRef.location.path}`, 'background:lime; color:black');
    await this.setState((prevState)=>{
      
      //can we find it in firebase?
      console.log(`\t%ctry find in firebaseFolders`, 'background:lime; color:black');
      let foundInFirebaseIndex = prevState.firebaseFolders.findIndex((item)=>{
        console.log(`\t%ccompare - item.name: ${item.name} | folderRef: ${folderRef.name}`, 'background:lime; color:black');
        return item.name === folderRef.name;
      });
      console.log(`\t%cfoundInFirebaseIndex: ${foundInFirebaseIndex}`, 'background:lime; color:black');

      //if found in firebase...
      if(foundInFirebaseIndex > -1){
        console.log(`\t%cFOLDER EXISTS`, 'background:lime; color:black');
        this.setState( (prevState)=>{
          console.log(`\t%cSETSTATE: errorModalMessage: 'Path already exists'`, 'background:yellow; color:red');
          return{errorModalMessage: 'Path already exists'}
        });
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
      
      console.log(`\t%cplaceholderFolderMatchIndex: ${placeholderFolderMatchIndex}`, 'background:lime; color:black');
      
      //not found in placeholderFolders?...add!
      if(placeholderFolderMatchIndex === -1){
        console.log('\t%cNOT FOUND, adding to pathfolders', 'background:lime; color:black');
        console.log(`\t%cfolderRef: ${folderRef}`, 'background:lime; color:black');
        let obj={pathRef: this.state.currentFolderRef, pathfolders: [folderRef]};
        console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
        console.log(`\t%cplaceholderFolders: ${[...prevState.placeholderFolders, obj]}`, 'background:yellow; color:red');
        console.log(`\t%ccreateFolderModal: false`, 'background:yellow; color:red');
        return { placeholderFolders: [...prevState.placeholderFolders, obj], createFolderModal: false}
      }
      //FOUND current folder in placeholderFolders
      else{
        //index in pathfolders
        let foundIndex = prevState.placeholderFolders[placeholderFolderMatchIndex].pathfolders.findIndex((item)=>{
          return item === folderRef;
        });

        //folder found in pathfolders
        if(foundIndex > -1){
          console.log(`\t%cFOLDER EXISTS`, 'background:lime; color:black');
          console.log(`\t%cSETSTATE: errorModalMessage: 'Path already exists'`, 'background:yellow; color:red');
          this.setState({errorModalMessage: 'Path already exists'});
          return prevState;
        }
        //not found in pathfolders
        else{
          console.log(`\t%cFOLDER DOES NOT EXIST YET`, 'background:lime; color:black');
          let isFound = placeholderFolderMatch.pathfolders.findIndex(item=>{
            return item === folderRef;
          });
          if(isFound === -1){
            let updatedFolders = [...placeholderFolderMatch.pathfolders, folderRef];
            placeholderFolderMatch.pathfolders = updatedFolders;
          }
          console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
          console.log(`\t%cplaceholderFolders: ${[...placeholderFolderAllExceptMatch, placeholderFolderMatch]}`, 'background:yellow; color:red');
          console.log(`\t%ccreateFolderModal: false`, 'background:yellow; color:red');
          return { placeholderFolders: [...placeholderFolderAllExceptMatch, placeholderFolderMatch], createFolderModal: false}
        }
      }
    });
    console.log(`%cEND==============================================`, 'background:lime; color:black');
  };
  
  





























  
// -------------------------------------------------------------------
//DELETE folder
// -------------------------------------------------------------------
  deleteFolder = async (ref)=>{
    console.log('%cSTART FUNCTION deleteFolder==============================================', 'background:red; color:white');
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

  deleteSelected = async (event) => {
    console.log('%cSTART FUNCTION deleteSelected==============================================', 'background:grey; color:yellow');
    event.preventDefault();
    //go through file refs
    [...this.state.firebaseFiles].forEach(async (item, index) => {
      //remove checked
      if (this.state.checkedFiles[index] === true) {
        await item.delete();
        await this.getFolderData(this.state.currentFolderRef);
        await this.setState((prevState)=>{
          console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
          console.log(`\t%cmainIndeterminate: ${false}`, 'background:yellow; color:red');
          console.log(`\t%cmainChecked: ${false}`, 'background:yellow; color:red');
          console.log(`\t%ccheckedFiles: []`, 'background:yellow; color:red');
          return {
            mainIndeterminate: false,
            mainChecked: false,
            checkedFiles: [],
          }
        });
      }
    });

    //go through folder refs
    [...this.state.firebaseFolders].forEach(async (item, index) => {
      if (this.state.checkedFolders[index] === true) {
        //loop through folder
        await this.deleteFolder(item);//recursively go through folders and delete files
        await this.getFolderData(this.state.currentFolderRef); 
        await this.setState(prevState=>{
          console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
          console.log(`\t%cmainIndeterminate: ${false}`, 'background:yellow; color:red');
          console.log(`\t%cmainChecked: ${false}`, 'background:yellow; color:red');
          console.log(`\t%ccheckedFiles: []`, 'background:yellow; color:red');
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
    console.log(`\t%cplaceholderFolderMatch: ${placeholderFolderMatch}`, 'background:grey; color:yellow');

    let placeholderMatchIndex=-1;	
    console.log(`\t%cthis.state.currentFolderRef: ${this.state.currentFolderRef}`, 'background:grey; color:yellow');
    if(this.state.placeholderFolders.length){	
      console.log('\t%cSOMETHING HERE...', 'background:grey; color:yellow');
      placeholderMatchIndex = this.state.placeholderFolders.findIndex((item)=>{	
        console.log(`\t%citem.pathRef: ${item.pathRef}`, 'background:grey; color:yellow');
        return (item.pathRef === this.state.currentFolderRef);	
      });	
      console.log(`\t%cplacehodlerMatchIndex: ${placeholderMatchIndex}`, 'background:grey; color:yellow');
      //if found in placeholder...
      if(placeholderMatchIndex > -1){	
        //go through placeholderFolders, check if .location.path includes pathfolders[index].name
        //try find 'name' in all the rest of placeholdFolders

        let cleanedUpPlaceholders = this.state.placeholderFolders.filter(item=>{

          let includeItem = placeholderFolderMatch.pathfolders.some((ref,index)=>{	
            return (item.pathRef.location.path.includes(ref.location.path) && this.state.checkedPlaceholderFolders[index] === true);
          });

          console.log(`\t%cis checked and in path?  ${includeItem}`, 'background:grey; color:yellow');

          return !includeItem;
        });

        console.log(`\t%ccleanedUpPlaceholders: ${cleanedUpPlaceholders}`, 'background:grey; color:yellow');
        let removeDud = cleanedUpPlaceholders.filter(item=>{
        console.log(`\t%citem.pathRef.location.path: ${item.pathRef.location.path}`, 'background:grey; color:yellow');
        console.log(`\t%cthis.state.currentFolderRef.location.path: ${this.state.currentFolderRef.location.path}`, 'background:grey; color:yellow');
        console.log(`\t%citem.pathfolders: ${item.pathfolders}`, 'background:grey; color:yellow');
        console.log(`\t%citem.pathfolders.length: ${item.pathfolders.length}`, 'background:grey; color:yellow');
          return !(item.pathRef.location.path === this.state.currentFolderRef.location.path);
        });

        console.log(`\t%cremoveDud: ${removeDud}`, 'background:grey; color:yellow');

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
        await this.setState((prevState)=>{
          console.log(`\t%cSETSTATE:`, 'background:yellow; color:red');
          console.log(`\t%cplaceholderFolders: ${updatedPlaceholderFolders}`, 'background:yellow; color:red');
          console.log(`\t%ccheckedPlaceholderFolders: []`, 'background:yellow; color:red');
          return {placeholderFolders: updatedPlaceholderFolders ,checkedPlaceholderFolders:[]}
        });
      }
    }
    console.log('%cEND==============================================', 'background:grey; color:yellow');
  };




































  
// -------------------------------------------------------------------
//RENDER
// -------------------------------------------------------------------

  render() {
    console.log('%cSTART FUNCTION render==============================================', 'background:green;color:white');
    console.log(`\t%cfirebaseRootRef: ${this.state.firebaseRootRef}`, `background:green;color:white`);
    console.log(`\t%callFolderList *(firebase folder recursive): ${this.state.allFolderList}`, `background:green;color:white`);
    console.log(`\t%cfirebaseFolders: ${this.state.firebaseFolders}`, 'background:green;color:white');
    console.log(`\t%cfirebaseFiles: ${this.state.firebaseFiles}`, 'background:green;color:white');
    console.log(`\t%cplaceholderFolders: ${this.state.placeholderFolders}`, 'background:green;color:white');
    console.log(`\t%ccurrentFolderDrilldownRefs: ${this.state.currentFolderDrilldownRefs}`, 'background:green;color:white');
    console.log(`\t%ccurrentFolderRef: ${this.state.currentFolderRef}`, 'background:green;color:white');
    console.log(`\t%ccurrentFolderPath: ${this.state.currentFolderPath}`, 'background:green;color:white');
    console.log(`\t%ccheckedPlaceholderFolders: ${this.state.checkedPlaceholderFolders}`, 'background:green;color:white');
    console.log(`\t%ccheckedFolders: ${this.state.checkedFolders}`, 'background:green;color:white');
    console.log(`\t%ccheckedFiles: ${this.state.checkedFiles}`, 'background:green;color:white');
    //sort out placeholder folders
    let placeholderMatchIndex=-1;
    let pathFolders = [];

    if(this.state.placeholderFolders.length){
      console.log('\t%cSOMETHING HERE...','background:green;color:white');
      placeholderMatchIndex = this.state.placeholderFolders.findIndex((item)=>{
        return (item.pathRef.location.path === this.state.currentFolderRef.location.path);
      });
      
      console.log(`\t%cplaceholderMatchIndex: ${placeholderMatchIndex}`, 'background:green;color:white');
    
      if(placeholderMatchIndex > -1){
        pathFolders = this.state.placeholderFolders[placeholderMatchIndex].pathfolders;
      }
    }
    












    //CHECKBOX FOR FILE/FOLDER/PLACEHOLDERFOLDER RELATED
    let sortedDOM = [
      
      //placeholderFolders
      ...pathFolders.map((item, index)=>{
        console.log(`\t%cpathfolder: ${item}`,'background:green;color:white');
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
    console.log(`\t%csortedDOM: ${sortedDOM}`,'background:green;color:white');
    console.log(`\t%cthis.state.firebaseFiles: ${this.state.firebaseFiles}`,'background:green;color:white');
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


















    //CHECK
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
    console.log('%cEND==============================================', 'background:green;color:white');
    return (
      <div className={classes.Upload}>
        <div className={[classes.Border].join(' ')}>
          <div
            className={[classes.UploadHeader, isIndeterminateClass].join(' ')}
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
                    onClick={async (event) => {
                      event.preventDefault();
                      await this.toggleMainChecked(false);
                      await this.toggleCheckAllFolders(false);
                      await this.toggleCheckAllFiles(false);
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
                <Button type="Action" onClick={async (event)=>{
                  await this.deleteSelected(event);

                  //update folders
                  this.getAllFolders();
                  
                  }}>
                  Delete
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={classes.UploadHeaderUrl} 
                  onMouseOver={(event)=>{
                    event.stopPropagation();
                    this.uploadUrlOverHandler(event);
                  }}
                  onMouseLeave={(event)=>{
                    event.stopPropagation();
                    this.uploadUrlOutHandler(event);
                  }}>
                  <Breadcrumb
                    path={this.state.currentFolderDrilldownRefs}
                    onClick={(ref) => this.changeFolderPath(ref)}
                    onEdit={() => this.editBreadcrumbModal()}
                  ></Breadcrumb>

                  <div
                    className={[classes.UploadEdit, isHoverUploadUrl].join(' ')}
                    title="edit"
                    onClick={() => this.editBreadcrumbModal()}
                  >
                    <Icon iconstyle="fas" code="edit" size="sm" />
                  </div>
                </div>
                <div className={[classes.UploadHeaderActionButtons].join(' ')}>
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

                  {/* UPLOAD FILE */}
                  <Button
                    className={classes.UploadHeaderUploadFile}
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

                  {/* NEW FOLDER */}
                  <Button
                    className={classes.UploadHeaderNewFolder}
                    type='LastItemRight'
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
                  onChange={async () => {
                    await this.toggleMainChecked(!this.state.mainChecked);//when this is async/await call, state.mainChecked updates here...

                    //when async/await, these following calls should use this.state.mainChecked, 
                    //when NOT async/await, these following calls should use !this.state.mainChecked
                    await this.toggleCheckAllFolders(this.state.mainChecked);
                    await this.toggleCheckAllFiles(this.state.mainChecked);
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
          modalClosed={async () => {
            await this.setState((prevState)=>{
              console.log(`%cSETSTATE: createFolderModal: ${false}`, 'background:yellow; color:red');
              return{ createFolderModal: false };
            });
          }}
          continue={async () => {
            console.clear();
            console.log('continue');
            const newRef = this.state.currentFolderRef.child(this.state.createFolderName);
            await this.addFolder(newRef);
            //refresh list of all firebase folders
            await this.getAllFolders();
          }}
        >
          <Input
            value={{ data: this.state.createFolderName }}
            placeholder="Folder name"
            onChange={async (event) => {
              event.preventDefault();
              console.log('typed: ', event.target.value);
              let targetVal = event.target.value;

              await this.setState((prevState) => {
                console.log(`%cSETSTATE: errorModalMessage: ${null}`, 'background:yellow; color:red');
                console.log(`%cSETSTATE: createFolderName: ${targetVal}`, 'background:yellow; color:red');
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
          modalClosed={async () => {
            await this.setState((prevState)=>{
              console.log(`%cSETSTATE:`, 'background:yellow; color:red');  
              console.log(`%ceditBreadcrumbModal: ${false}`, 'background:yellow; color:red');  
              console.log(`%cerrorModalMessage: ${null}`, 'background:yellow; color:red');  
              return{
                editBreadcrumbModal: false,
                errorModalMessage: null,
              }
            });
          }}
          continue={async () => {
            console.log('continue');
            //go through directory list
            //navigate if folders exists..
            //ie. check all paths in directory list
            try {
              this.state.allFolderList.forEach(async (item, index) => {
                console.log(
                  `allFolderList item: index:[${index}]`,
                  item.location.path
                );
                if (item.location.path === this.state.currentFolderPath) {
                  //found in drilldown...so it exists, navigate to it
                  await this.changeFolderPath(item);
                  //on continue, navigate to new ref
                  await this.setState((prevState)=>{
                    console.log(`%cSETSTATE:`, 'background:yellow; color:red');  
                    console.log(`%ceditBreadcrumbModal: ${false}`, 'background:yellow; color:red');
                    console.log(`%cerrorModalMessage: ${null}`, 'background:yellow; color:red');    
                    return{
                      editBreadcrumbModal: false,
                      errorModalMessage: null,
                    }
                  }); 
                } else if (
                  this.state.currentFolderPath[
                    this.state.currentFolderPath.length - 1
                  ] === '/'
                ) {
                  console.error('path does not exist');
                  await this.setState((prevState)=>{
                    console.log(`%cSETSTATE: errorModalMessage: ${'Remove trailing "/" character from path'}`, 'background:yellow; color:red');    
                    return{
                      errorModalMessage:'Remove trailing "/" character from path',
                    }
                  });
                } else {
                  console.error('path does not exist');
                  await this.setState((prevState)=>{
                    console.log(`%cSETSTATE: errorModalMessage: ${'Path does not exist'}`, 'background:yellow; color:red');    
                    return {
                      errorModalMessage: 'Path does not exist',
                    }
                  });
                }
              });
            } catch {
              //go thru drilldown,
              this.state.currentFolderDrilldownRefs.forEach(async (item) => {
                //compare to drilldown ref.location.path, if found, that is the new ref

                if (item.location.path === this.state.currentFolderPath) {
                  //found in drilldown...so it exists, navigate to it
                  this.changeFolderPath(item);
                  //on continue, navigate to new ref
                  await this.setState((prevState)=>{
                    console.log(`%cSETSTATE:`, 'background:yellow; color:red');  
                    console.log(`%ceditBreadcrumbModal: ${false}`, 'background:yellow; color:red');
                    console.log(`%cerrorModalMessage: ${null}`, 'background:yellow; color:red');    
                    return{
                      editBreadcrumbModal: false,
                      errorModalMessage: null,
                    }
                  }); 
                } else if (
                  this.state.currentFolderPath[
                    this.state.currentFolderPath.length - 1
                  ] === '/'
                ) {
                  console.error('path does not exist');
                  await this.setState((prevState)=>{
                    console.log(`%cSETSTATE: errorModalMessage: ${'Remove trailing "/" character from path'}`, 'background:yellow; color:red');    
                    return{
                      errorModalMessage:'Remove trailing "/" character from path',
                    }
                  });

                } else {
                  console.error('path does not exist');
                  await this.setState((prevState)=>{
                    console.log(`%cSETSTATE: errorModalMessage: ${'Path does not exist'}`, 'background:yellow; color:red');    
                    return{
                      errorModalMessage:'Path does not exist',
                    }
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
              event.persist();
              event.preventDefault();
              console.log('typed: ', event.target.value);
              this.setState((prevState)=>{
                console.log(`%cSETSTATE: currentFolderPath: ${event.target.value}`, 'background:yellow; color:red');    
                return{ currentFolderPath: event.target.value }
              });
            }}
          />
          <div className={classes.Errors}>{this.state.errorModalMessage}</div>
        </Modal>
      </div>
    );
    
  }
}
export default withRouter(Upload);
