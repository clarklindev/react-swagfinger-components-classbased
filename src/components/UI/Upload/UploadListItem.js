import React, { Component } from 'react';
import classes from './UploadListItem.module.scss';
import Icon from '../InputComponents/Icon';
import Button from '../Button/Button';
class UploadListItem extends Component {
  render() {
    return (
      <div className={classes.UploadListItem}>
        {/* row */}
        <div className={classes.UploadDetails}>
          <div className={classes.Label}>{this.props.name}</div>
          <div className={classes.FileSize}>
            {Number(this.props.size / 1024).toFixed(2)}KB
          </div>
        </div>
        <div className={classes.UploadProgress}>progress</div>
        <div className={classes.Divider} />
        <div className={classes.UploadDelete}>
          <Button type='NoStyle'>
            <Icon iconstyle='far' code='trash-alt' size='sm' />
          </Button>
        </div>
      </div>
    );
  }
}

export default UploadListItem;
