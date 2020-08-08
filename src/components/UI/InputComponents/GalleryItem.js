import React, { Component } from 'react';
import classes from './GalleryItem.module.scss';
import Button from '../Button/Button';
import Icon from './Icon';
import DraggableItem from './DraggableItem';
import FlexRow from '../../../hoc/Layout/FlexRow';

class GalleryItem extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.addEventListener('dragstart', this.dragStart, false);
    // this.addEventListener('dragenter', this.dragEnter, false);
    // this.addEventListener('dragover', this.dragOver, false);
    // this.addEventListener('dragleave', this.dragLeave, false);
    // this.addEventListener('drop', this.dragDrop, false);
    // this.addEventListener('dragend', this.dragEnd, false);
  }
  componentWillUnmount() {
    // this.removeEventListener('dragstart', this.dragStart, false);
    // this.removeEventListener('dragenter', this.dragEnter, false);
    // this.removeEventListener('dragover', this.dragOver, false);
    // this.removeEventListener('dragleave', this.dragLeave, false);
    // this.removeEventListener('drop', this.dragDrop, false);
    // this.removeEventListener('dragend', this.dragEnd, false);
  }

  // dragStart = function (e) {
  //   this.style.opacity = '0.4';
  //   // dragSrcEl = this;
  //   // e.dataTransfer.effectAllowed = 'move';
  //   // e.dataTransfer.setData('text/html', this.innerHTML);
  // };

  // dragEnter = (e) => {
  //   this.classList.add('over');
  // };

  // dragLeave = (e) => {
  //   e.stopPropagation();
  //   this.classList.remove('over');
  // };

  // dragOver = function (e) {
  //   e.preventDefault();
  //   e.dataTransfer.dropEffect = 'move';
  //   return false;
  // };

  // dragDrop = function (e) {
  //   // if (dragSrcEl != this) {
  //   //   dragSrcEl.innerHTML = this.innerHTML;
  //   //   this.innerHTML = e.dataTransfer.getData('text/html');
  //   // }
  //   return false;
  // };

  // dragEnd = function (e) {
  //   //var listItens = document.querySelectorAll('.draggable');
  //   // [].forEach.call(listItens, function (item) {
  //   //   item.classList.remove('over');
  //   // });
  //   //this.style.opacity = '1';
  // };

  render() {
    const removeButton = (
      <Button
        title='Delete'
        type='WithBorder'
        className={classes.RemoveButton}
        onClick={(event) => this.props.onRemove(event)}>
        <Icon iconstyle='far' code='trash-alt' size='sm' />
      </Button>
    );
    return (
      <React.Fragment>
        <div className={classes.GalleryItem}>
          <DraggableItem>
            <FlexRow justifyContent='space-between' flexgrow={true}>
              <div className={classes.DragContent}>{this.props.children}</div>
            </FlexRow>
          </DraggableItem>

          {removeButton}
        </div>
      </React.Fragment>
    );
  }
}

export default GalleryItem;
