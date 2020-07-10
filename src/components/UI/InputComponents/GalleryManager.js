import React, { PureComponent } from 'react';
import classes from './GalleryManager.module.scss';

import InputContext from '../../../context/InputContext';
import GalleryItem from './GalleryItem';

import Input from './Input';
import Button from '../Button/Button';
import Icon from './Icon';
import { ReactSortable } from 'react-sortablejs';
import * as ArrayHelper from '../../../shared/arrayHelper';

// Class allows us to move items of the gallery
// Add and Remove items from gallery

class GalleryManager extends PureComponent {
  static contextType = InputContext;
  constructor(props) {
    super(props);
    this.cloneRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ list: this.props.value });
    console.log('value: ', this.props.value);
  }

  componentDidUpdate() {
    console.log('ComponentDidUpdate GalleryManager');
    if (this.state.list !== this.props.value) {
      console.log('props.value update: ', this.props.value);
      this.setState({
        list: this.props.value,
      });
    }
  }

  state = {
    list: [],
    clickIndex: null,
    toIndex: null,
  };

  dragStartHandler = function (e, index) {
    console.log('FUNCTION dragStartHandler');
    e.target.style.opacity = 0.3;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
    this.setState({ clickIndex: index });
  };

  dragEnterHandler = function (e, index) {
    console.log('FUNCTION dragEnterHandler');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    //set index if not same as current state
    if (this.state.toIndex !== index) {
      console.log('set index:', index);
      this.setState((prevState) => {
        return { toIndex: index };
      });
    }
  };
  dragOverhandler = function (e, index) {
    e.preventDefault();
    //console.log('FUNCTION dragOverhandler');
  };
  dragLeaveHandler = function (e, index) {
    console.log('FUNCTION dragLeaveHandler');
  };

  dragEndHandler = function (e) {
    console.log('FUNCTION dragEndHandler');
    e.target.style.opacity = '';
  };

  //this requires dragOverhandler() to have e.preventDefault() for it to work
  dropHandler = function (e) {
    e.preventDefault();

    //console.log('dropHandler: ', e.currentTarget);
    // let updateArray = ArrayHelper.moveItemInArray(
    //   this.state.list,
    //   this.state.clickIndex,
    //   this.state.toIndex
    // );
    // console.log('updated array:', updateArray);
    //this.setState({ list: updateArray });
    this.context.moveiteminarray(
      this.props.field,
      this.state.clickIndex,
      this.state.toIndex
    );
  };

  removeClickHandler = (event, field, index) => {
    event.stopPropagation();
    event.preventDefault();
    this.context.removeinput(field, index);
  };

  render() {
    console.log('render...', this.state.list);
    const addButton = (
      <Button
        title='Add'
        type='WithBorder'
        className={classes.AddButton}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log('AddButton clicked');
          this.context.addinput(
            event,
            this.props.field,

            //this.is what is stored..to access value, value.data.value
            {
              key: '',
              value: '',
            }
          );
        }}>
        <Icon iconstyle='fas' code='plus' size='sm' />
        <p>Add</p>
      </Button>
    );

    const listHTML = this.state.list.map((val, index) => (
      <li
        key={this.props.field + index}
        draggable
        onDragStart={(event) => this.dragStartHandler(event, index)}
        onDragEnter={(event) => this.dragEnterHandler(event, index)} //event triggers once
        onDragOver={(event) => this.dragOverhandler(event, index)} //event triggers all the time
        onDragLeave={(event) => this.dragLeaveHandler(event, index)}
        onDrop={(event) => {
          this.dropHandler(event);
        }}
        onDragEnd={(event) => this.dragEndHandler(event, index)}>
        <GalleryItem
          onRemove={(event) => {
            this.removeClickHandler(event, this.props.field, index);
          }}>
          {/* insert code here */}
          <input
            className={classes.InputElement}
            placeholder={this.props.placeholder}
            onChange={(event) =>
              //pass in the name of the prop, and the index (if array item)
              this.context.changed(
                { value: event.target.value },
                this.props.field,
                index
              )
            }
            title={val.data.value}
            value={val.data.value}
            field={this.props.field}
          />
        </GalleryItem>
      </li>
    ));

    return (
      <div className={classes.GalleryManager}>
        {this.state.list.length ? (
          <div className={classes.GalleryItemsWrapper}>
            <ul>{listHTML}</ul>
          </div>
        ) : null}

        {addButton}
      </div>
    );
  }
}

export default GalleryManager;
