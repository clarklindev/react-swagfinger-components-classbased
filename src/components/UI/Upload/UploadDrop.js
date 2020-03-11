import React, { Component } from 'react';
import classes from './UploadDrop.module.scss';
import Utils from '../../../Utils';
import Icon from '../InputComponents/Icon';
import List from '../../UI/InputComponents/List';
import UploadListItem from './UploadListItem';
import Button from '../Button/Button';
import InputContext from '../../../context/InputContext';
import { withRouter } from 'react-router-dom';

class UploadDrop extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.UploadDrop,
      UploadDrop.name
    ]);

    this.dropRef = React.createRef();
    this.uploadRef = React.createRef();
  }

  state = {
    selectedFiles: [],
    dragging: false,
    uploadProgress: []
  };

  componentDidMount() {
    //check if there is 'id' in querystring
    console.log('COMPONENT DID MOUNT:');

    this.dragCounter = 0;

    let div = this.dropRef.current;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop);
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
  }

  handleDrag = event => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy'; //show this is a copy by using drag-copy cursor
  };

  handleDragIn = event => {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };

  handleDragOut = event => {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({ dragging: false });
  };

  handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ dragging: false });
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      //callback handleDrop
      // this.props.handleDrop(e.dataTransfer.files);
      let existingFiles = [];

      Array.from(event.dataTransfer.files).forEach(file => {
        const existingFile = this.findDuplicateFile(file);
        if (existingFile) {
          console.error('Existing file:', existingFile);
          return;
        }
        existingFiles.push(file);
        console.warn('Added file:', file);
      });
      this.setState(
        prevState => {
          return {
            selectedFiles: [...prevState.selectedFiles, ...existingFiles]
          };
        },
        () => {
          this.uploadHandler(event);
        }
      );

      event.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  findDuplicateFile = file => {
    return this.state.selectedFiles.find(existingFile => {
      const isDuplicate =
        existingFile.name === file.name &&
        existingFile.lastModified === file.lastModified &&
        existingFile.size === file.size &&
        existingFile.type === file.type;
      console.log('IS DUPLICATE? ', isDuplicate);
      return isDuplicate;
    });
  };

  //function called when input button clicked
  fileChangedHandler = event => {
    event.preventDefault();
    event.persist();
    const files = event.target.files;

    let existingFiles = [];

    Array.from(files).forEach(file => {
      const existingFile = this.findDuplicateFile(file);
      if (existingFile) {
        console.error('Existing file:', existingFile);
        return;
      }
      existingFiles.push(file);
      console.warn('Added file:', file);
    });
    console.log('EXISTING: ', existingFiles);
    this.setState(
      prevState => {
        console.log('waypoint1!!!!');
        return {
          selectedFiles: [...prevState.selectedFiles, ...existingFiles]
        };
      },
      () => {
        console.log('waypoint2!!!!');
        console.log('this.state.selectedFiles: ', this.state.selectedFiles);
        this.uploadHandler(event);
      }
    );
  };

  removeFromList = (event, index) => {
    let updatedFiles = [
      ...this.state.selectedFiles.filter((item, i) => {
        return index !== i ? item : null;
      })
    ];
    this.setState({ selectedFiles: updatedFiles });
    this.context.removeinput(event, this.props.name, index);
  };

  uploadHandler = event => {
    event.persist();
    this.state.selectedFiles.forEach((item, index) => {
      this.context.addinput(event, this.props.name, item);
    });
  };

  render() {
    let tempClasses = [];

    if (this.state.dragging) {
      tempClasses.push(classes.Dragging);
    }

    let fileList = [];
    if (this.state.selectedFiles) {
      fileList = this.state.selectedFiles.map((item, index) => {
        if (!this.state.selectedFiles[index].name) {
          return null;
        }
        const formData = new FormData();
        formData.append(
          'image',
          this.state.selectedFiles[index],
          this.state.selectedFiles[index].name
        );

        console.log(
          'this.state.selectedFiles[index]:',
          this.state.selectedFiles[index]
        );

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
        - onprogress 
        - onload 
        - onabort 
        - onerror 
        - onloadend 
        */

        // let reader = new FileReader();

        // reader.readAsDataURL(this.state.selectedFiles[i]);
        // let file = this.state.selectedFiles[index];
        // let fileName = this.state.selectedFiles[index].name;
        // console.log('FILE: ', file, '| filename: ', fileName);
        // let fileRef = this.imagesRef.child(fileName);

        //using .fullPath
        // let path = fileRef.fullPath; //path is images/{filename}
        // //put() takes files via javascript File and Blob api and uploads them to cloud storage
        // fileRef.put(file).then(function(snapshot) {
        //   console.log('uploaded file.');
        // });

        return (
          <UploadListItem
            key={index}
            filename={this.state.selectedFiles[index].name}
            size={this.state.selectedFiles[index].size}
            progress={this.state.uploadProgress[index]}
          >
            <div className={classes.UploadInteraction}>
              <React.Fragment>
                <div className={classes.Divider} />
                <div className={classes.UploadDelete}>
                  <Button
                    onClick={event => {
                      event.preventDefault();
                      this.removeFromList(event, index);
                    }}
                  >
                    <Icon iconstyle='far' code='trash-alt' size='sm' />
                  </Button>
                </div>
              </React.Fragment>
            </div>
          </UploadListItem>
        );
      });
    }

    return (
      <div className={this.className}>
        <div
          ref={this.dropRef}
          className={[classes.DropWrapper, ...tempClasses].join(' ')}
        >
          <input
            ref={this.uploadRef}
            type='file'
            accept='image/*'
            multiple
            onChange={this.fileChangedHandler}
          />
          <div className={classes.UploadLabel}>
            <Icon
              className={classes.Icon}
              iconstyle='fas'
              code='arrow-circle-up'
              size='lg'
            />
            <p>Drag and drop files here</p>
          </div>
          <Button
            type='WithBorder'
            onClick={event => {
              event.preventDefault();
              this.uploadRef.current.click();
            }}
          >
            Browse files
          </Button>
        </div>
        <output>
          {this.state.selectedFiles.length ? (
            <List
              className={classes.UploadList}
              value={{ data: fileList }}
            ></List>
          ) : null}
        </output>
      </div>
    );
  }
}

export default withRouter(UploadDrop);
