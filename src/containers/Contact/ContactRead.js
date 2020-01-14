import React, { Component } from 'react';
import classes from './ContactRead.module.scss';
import Utils from '../../Utils';
import axios from '../../axios-contacts';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
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
    let contact = '';
    if (this.state.loadedContact) {
      let contactnumbers = this.state.loadedContact['contactnumbers'].map(
        (each, index) => {
          return each !== '' ? each : undefined;
        }
      );
      let emails = this.state.loadedContact['emails'].map((each, index) => {
        return each !== '' ? each : undefined;
      });

      // note the order of the render is important hence why manually setting the content order
      contact = (
        <React.Fragment>
          <ComponentFactory
            data={{
              label: 'Name',
              elementtype: 'input',
              value: { data: this.state.loadedContact['name'] },
              readOnly: true
            }}
          />
          <ComponentFactory
            data={{
              label: 'Last name',
              elementtype: 'input',
              value: { data: this.state.loadedContact['lastname'] },
              readOnly: true
            }}
          />
          <ComponentFactory
            data={{
              label: 'Contact number',
              elementtype: 'list',
              value: { data: contactnumbers }
            }}
          />

          <ComponentFactory
            data={{
              label: 'Email',
              elementtype: 'list',
              value: { data: emails }
            }}
          />

          <ComponentFactory
            data={{
              label: 'Contact Preference',
              elementtype: 'input',
              value: { data: this.state.loadedContact['contactpreference'] },
              readOnly: true
            }}
          />

          <ComponentFactory
            data={{
              label: 'Notes',
              elementtype: 'input',
              value: { data: this.state.loadedContact['notes'] },
              readOnly: true
            }}
          />
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
