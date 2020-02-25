import React, { Component } from 'react';
import classes from './Upload.module.scss';
import Utils from '../../../Utils';
import axios from 'axios';
import Icon from '../InputComponents/Icon';
import List from '../../UI/InputComponents/List';
import UploadListItem from './UploadListItem';
import Button from '../Button/Button';
class Upload extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([classes.Upload, Upload.name]);
    this.uploadRef = React.createRef();
    this.dropRef = React.createRef();
  }

  state = {
    selectedFiles: [],
    dragging: false,
    uploadProgress: []
  };

  componentDidMount() {
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

  handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  handleDragIn = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };

  handleDragOut = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({ dragging: false });
  };

  handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ dragging: false });
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      //callback handleDrop
      // this.props.handleDrop(e.dataTransfer.files);
      let existingFiles = [];

      Array.from(event.dataTransfer.files).forEach((file) => {
        const existingFile = this.findDuplicateFile(file);
        if (existingFile) {
          console.error('Existing file:', existingFile);
          return;
        }
        existingFiles.push(file);
        console.warn('Added file:', file);
      });
      this.setState(
        (prevState) => {
          return {
            selectedFiles: [...prevState.selectedFiles, ...existingFiles]
          };
        },
        () => {
          this.uploadHandler();
        }
      );

      event.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  findDuplicateFile = (file) => {
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

  //function called when input button clicked
  fileChangedHandler = (event) => {
    const files = event.target.files;

    let existingFiles = [];

    Array.from(files).forEach((file) => {
      const existingFile = this.findDuplicateFile(file);
      if (existingFile) {
        console.error('Existing file:', existingFile);
        return;
      }
      existingFiles.push(file);
      console.warn('Added file:', file);
    });
    this.setState(
      (prevState) => {
        return {
          selectedFiles: [...prevState.selectedFiles, ...existingFiles]
        };
      },
      () => this.uploadHandler()
    );
  };

  uploadHandler = () => {
    if (this.state.selectedFiles) {
      for (let i = 0; i < this.state.selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append(
          'image',
          this.state.selectedFiles[i],
          this.state.selectedFiles[i].name
        );

        axios
          .post('https://react-crud-1db4b.appspot.com/', formData, {
            onUploadProgress: (progressEvent) => {
              let uploadAll = [...this.state.uploadProgress];
              let uploadCurrent = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              console.log('uploadCurrent: ', uploadCurrent);
              uploadAll[i] = uploadCurrent;
              this.setState({ uploadProgress: uploadAll });
            }
          })
          .then((result) => {
            console.log('RESULT: ', result.data);
          })
          .catch((error) => {
            console.log('ERROR: ', error.message);
          });
      }
    }
  };

  render() {
    let tempClasses = [];
    if (this.state.dragging) {
      tempClasses.push(classes.Dragging);
    }
    let filelist = [];
    if (this.state.selectedFiles) {
      for (let i = 0; i < this.state.selectedFiles.length; i++) {
        if (!this.state.selectedFiles[i].name) {
          return;
        }
        filelist.push(
          <UploadListItem
            key={i}
            name={this.state.selectedFiles[i].name}
            size={this.state.selectedFiles[i].size}
            progress={this.state.uploadProgress[i]}></UploadListItem>
        );
      }
    }
    return (
      <div className={this.className}>
        <div
          ref={this.dropRef}
          className={[classes.DropWrapper, ...tempClasses].join(' ')}>
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
              code='cloud-upload-alt'
              size='sm'
            />
            <p>Drag and drop files here</p>
          </div>
          <Button
            type='WithBorder'
            onClick={() => this.uploadRef.current.click()}>
            Browse files
          </Button>
        </div>
        <List className={classes.UploadList} value={{ data: filelist }}></List>
      </div>
    );
  }
}
export default Upload;
