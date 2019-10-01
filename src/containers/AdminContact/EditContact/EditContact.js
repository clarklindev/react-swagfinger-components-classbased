import React, { Component } from 'react';
import classes from './EditContact.module.scss';
import Utils from '../../../Utils';

class EditContact extends Component {
  constructor(props) {
    super(props);
    this.classes = Utils.getClassNameString([classes.EditContact]);
  }
  render() {
    return (
      <div className={this.classes}>
        <h2>Edit contact</h2>
      </div>
    );
  }
}
export default EditContact;
