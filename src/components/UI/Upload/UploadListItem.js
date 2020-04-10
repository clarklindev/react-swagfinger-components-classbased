import React, { Component } from 'react';
import classes from './UploadListItem.module.scss';
import Icon from '../InputComponents/Icon';
import Button from '../Button/Button';
import CircularLoader from '../Loaders/CircularLoader';
class UploadListItem extends Component {
  render() {
    return (
      <div className={classes.UploadListItem}>
        {/* row */}
        <div className={classes.UploadDetails}>
          <div className={classes.Label} title={this.props.filename}>
            {this.props.filename}
          </div>
          <div className={classes.FileSize}>
            {Number(this.props.size / 1024).toFixed(2)}KB
          </div>
        </div>
        <div className={classes.UploadInteraction}>
          <div className={classes.UploadProgress}>
            <CircularLoader
              progress={this.props.progress}
              width="17px"
              height="17px"
            />
          </div>
          {this.props.progress >= 100 ? (
            <React.Fragment>
              <div className={classes.Divider} />
              <div className={classes.UploadDelete}>
                <Button>
                  <Icon iconstyle="far" code="trash-alt" size="sm" />
                </Button>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}

export default UploadListItem;
