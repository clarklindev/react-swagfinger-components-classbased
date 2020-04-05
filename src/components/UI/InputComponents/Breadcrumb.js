import React, { Component } from 'react';
import classes from './Breadcrumb.module.scss';

class Breadcrumb extends Component {
  render() {
    let links = (this.props.path || []).map((item, index) => {
      //console.log('item: ', item.location.path);
      const fullPath = item.location.path;
      let isFound = fullPath.lastIndexOf('/');
      let currentNavPathName =
        isFound > 0 ? fullPath.substring(isFound) : fullPath;
      return (
        <div
          key={`breadcrumb${index}`}
          className={classes.BreadcrumbLink}
          onClick={(event) => this.props.onClick(item)}
        >
          {currentNavPathName}
        </div>
      );
    });

    return links;
  }
}

export default Breadcrumb;
