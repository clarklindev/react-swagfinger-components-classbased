import React, { Component } from 'react';
import classes from './Contact.module.scss';
import Utils from '../../../Utils';
class Contact extends Component {
  render() {
    let className = Utils.getClassNameString([
      classes.Contact,
      Contact.name,
      this.props.className
    ]);

    return (
      <React.Fragment>
        <div className={className}>
          <h3>{this.props.name}</h3>
          <p>{this.props.lastname}</p>
        </div>
      </React.Fragment>
    );
  }
}
export default Contact;
