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

  render() {
    const removeButton = (
      <Button
        title='Delete'
        type='WithPadding'
        className={classes.RemoveButton}
        onClick={(event) => this.props.onClick(event)}
      >
        <Icon iconstyle='far' code='trash-alt' size='sm' />
      </Button>
    );
    return (
      <div className={classes.GalleryItem}>
        <DraggableItem>
          <FlexRow justifyContent='space-between' flexGrow>
            <div className={classes.DragContent}>{this.props.children}</div>
            {removeButton}
          </FlexRow>
        </DraggableItem>
      </div>
    );
  }
}

export default GalleryItem;
