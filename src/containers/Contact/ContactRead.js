import React, { Component } from 'react';
import classes from './ContactRead.module.scss';
import Utils from '../../Utils';
import * as actions from '../../store/actions/index';

import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import ListItem from '../../components/UI/InputComponents/ListItem';
import Spinner from '../../components/UI/Spinner/Spinner';
import { connect } from 'react-redux';

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
    id: null
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');
    if (id) {
      this.props.onFetchContact(id);
    }
  }
  render() {
    /* full contact details */
    let contact = '';
    if (this.props.activeContact) {
      let contactnumbers = this.props.activeContact['contactnumbers'].map(
        (each, index) => {
          return each !== '' ? (
            <ListItem displayText={each}></ListItem>
          ) : (
            undefined
          );
        }
      );
      let emails = this.props.activeContact['emails'].map((each, index) => {
        return each !== '' ? (
          <ListItem displayText={each}></ListItem>
        ) : (
          undefined
        );
      });

      // note the order of the render is important hence why manually setting the content order
      contact = (
        <React.Fragment>
          <ComponentFactory
            data={{
              label: 'Name',
              elementtype: 'input',
              value: { data: this.props.activeContact['name'] },
              readOnly: true
            }}
          />
          <ComponentFactory
            data={{
              label: 'Last name',
              elementtype: 'input',
              value: { data: this.props.activeContact['lastname'] },
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
              value: { data: this.props.activeContact['contactpreference'] },
              readOnly: true
            }}
          />

          <ComponentFactory
            data={{
              label: 'Notes',
              elementtype: 'input',
              value: { data: this.props.activeContact['notes'] },
              readOnly: true
            }}
          />
        </React.Fragment>
      );
    }

    return (
      <div className={this.className}>
        {this.props.activeContact ? (
          <DefaultPageLayout label='Contact Read'>{contact}</DefaultPageLayout>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    storedPhonebook: state.contact.phoneBook,
    isLoading: state.contact.loading,
    activeContact: state.contact.activeContact
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchContact: (id) => {
      dispatch(actions.processFetchSingleContact(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactRead);
