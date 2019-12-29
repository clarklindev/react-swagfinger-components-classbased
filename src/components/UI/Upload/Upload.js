import React, { Component } from 'react';
import classes from './Upload.module.scss';
import Utils from '../../../Utils';
import axios from 'axios';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([classes.Upload, Upload.name]);
    this.uploadRef = React.createRef();
    this.dropRef = React.createRef();
  }

  state = {
    selectedFiles: [],
    dragging: false
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
      this.setState(
        (prevState) => {
          return {
            selectedFiles: [
              ...prevState.selectedFiles,
              ...event.dataTransfer.files
            ]
          };
        },
        () => this.uploadHandler()
      );
      event.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  //function called when input button clicked
  fileChangedHandler = (event) => {
    const files = event.target.files;
    this.setState(
      (prevState) => {
        return {
          selectedFiles: [...prevState.selectedFiles, ...files]
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
          .post('react-crud-1db4b.appspot.com', formData, {
            onUploadProgress: (progressEvent) => {
              console.log(
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                  '%'
              );
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
        filelist.push(<li key={i}>{this.state.selectedFiles[i].name}</li>);
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
          <button onClick={() => this.uploadRef.current.click()}>
            Choose a file
          </button>
          &nbsp; or drag it here...
        </div>
        <ul className={classes.UploadList}>{filelist}</ul>
      </div>
    );
  }
}
export default Upload;
