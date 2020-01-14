import React, { Component } from 'react';
import classes from './ContactRead.module.scss';
import Utils from '../../Utils';
import axios from '../../axios-contacts';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';

class ContactRead extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ContactRead,
      'ContactRead',
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
      axios.get(`/contacts/${id}.json`).then((response) => {
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
          return each !== '' ? (
            <li key={'contactnumbers' + index}>{each}</li>
          ) : (
            undefined
          );
        }
      );
      let emails = this.state.loadedContact['emails'].map((each, index) => {
        return each !== '' ? <li key={'emails' + index}>{each}</li> : undefined;
      });

      // note the order of the render is important hence why manually setting the content order
      contact = (
        <React.Fragment>
          <div className={classes.LabelGroup}>
            <label>Name</label>
            <p>{this.state.loadedContact['name']}</p>
          </div>
          <div className={classes.LabelGroup}>
            <label>Last name</label>
            <p>{this.state.loadedContact['lastname']}</p>
          </div>

          <div className={classes.LabelGroup}>
            <label>Contact number</label>
            <ul>{contactnumbers}</ul>
          </div>

          <div className={classes.LabelGroup}>
            <label>Email</label>
            <ul>{emails}</ul>
          </div>

          <div className={classes.LabelGroup}>
            <label>Contact Preference</label>
            <p>{this.state.loadedContact['contactpreference']}</p>
          </div>

          <div className={classes.LabelGroup}>
            <label>Notes</label>
            <p>{this.state.loadedContact['notes']}</p>
          </div>
        </React.Fragment>
      );
    }

    return (
      <div className={this.className}>
        <DefaultPageLayout label='Contact Read'>{contact}</DefaultPageLayout>
      </div>
    );
  }
}

export default ContactRead;
