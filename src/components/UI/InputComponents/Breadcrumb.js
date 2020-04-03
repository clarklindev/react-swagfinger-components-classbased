import React, { Component } from 'react';
class Breadcrumb extends Component {
  render() {
    let paths = this.props.path.map(item => {
      return item.location.path;
    });
    return paths;
  }
}

export default Breadcrumb;
