import React, { Component } from 'react';
class Breadcrumb extends Component {
  render() {
    let paths = this.props.path.map(item => {
      return item.location.path;
    });

    let currentFolders = paths.map((item, index) => {
      console.log('xxx: ', item);
      let isFound = item.lastIndexOf('/');
      return isFound > 0 ? item.substring(isFound) : item;
    });

    return currentFolders;
  }
}

export default Breadcrumb;
