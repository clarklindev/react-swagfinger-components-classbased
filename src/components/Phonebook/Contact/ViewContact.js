import React, { Component } from 'react';
import classes from './ViewContact.module.scss';
import Utils from '../../../Utils';
import axios from '../../../axios-contacts';
import SectionHeader from '../../UI/Headers/SectionHeader';

class ViewContact extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ViewContact,
      'ViewContact',
      props.className
    ]);
  }

  state = {
    loadedContact: null
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');
    if (id) {
      axios.get(`/contacts/${id}.json`).then(response => {
        console.log(response);
        this.setState({ loadedContact: response.data });
      });
    }
  }
  render() {
    /* full contact details */
    let contact;
    if (this.state.loadedContact) {
      let contactnumbers = this.state.loadedContact['contactnumbers'].map(
        (each, index) => {
          return <li key={index}>{each.number}</li>;
        }
      );
      let emails = this.state.loadedContact['emails'].map((each, index) => {
        return <li key={index}>{each.email}</li>;
      });

      contact = (
        <React.Fragment>
          <div className={classes.LabelButtonGroup}>
            <h3>Name</h3>
            <p>{this.state.loadedContact['name']}</p>
          </div>
          <div className={classes.LabelButtonGroup}>
            <h3>last name</h3>
            <p>{this.state.loadedContact['lastname']}</p>
          </div>

          <div className={classes.LabelButtonGroup}>
            <h3>contacts</h3>
            <ul>{contactnumbers}</ul>
          </div>

          <div className={classes.LabelButtonGroup}>
            <h3>emails</h3>
            <ul>{emails}</ul>
          </div>
        </React.Fragment>
      );
    }

    return (
      <div className={this.className}>
        <SectionHeader>View Contact</SectionHeader>
        <div>{contact}</div>
      </div>
    );
  }
}

export default ViewContact;
