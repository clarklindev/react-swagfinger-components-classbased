import React, { Component } from 'react';
import classes from './Breadcrumb.module.scss';
import Icon from '../Icon/Icon';

class Breadcrumb extends Component {
  render() {
    let currentNavPathName = null;
    let prevPaths = null;
    let founditem = null;

    //if there is more than one Breadcrumb, the first becomes a '.../' navigation
    if (this.props.path.length === 1) {
      currentNavPathName = this.props.path[0].location.path;
      //console.log('CURRENTNAVPATHNAME: ', currentNavPathName);
      return (
        <div className={classes.Breadcrumb}>
          <div
            className={classes.BreadcrumbLink}
            onClick={(event) => this.props.onClick(this.props.path[0])}
            title={currentNavPathName}
          >
            {currentNavPathName}
          </div>
        </div>
      );
    } else {
      founditem = this.props.path.find((item, index) => {
        return index === this.props.path.length - 1;
      });
      if (founditem) {
        const fullPath = founditem.location.path;
        let lastFolderInPathIndex = fullPath.lastIndexOf('/');
        prevPaths = fullPath.substring(0, lastFolderInPathIndex);
        currentNavPathName = fullPath.substring(lastFolderInPathIndex + 1);
      }
      return (
        <React.Fragment>
          <div className={classes.Breadcrumb}>
            <div
              className={classes.BreadcrumbLink}
              onClick={(event) => this.props.onEdit()}
              title={prevPaths}
            >
              <Icon iconstyle="fas" code="ellipsis-h" size="sm" />
            </div>
            <div className={classes.Divider}>
              <Icon iconstyle="fas" code="chevron-right" size="sm"></Icon>
            </div>
            <div
              className={classes.BreadcrumbLink}
              onClick={() => this.props.onClick(founditem)}
              title={currentNavPathName}
            >
              {currentNavPathName}
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Breadcrumb;
