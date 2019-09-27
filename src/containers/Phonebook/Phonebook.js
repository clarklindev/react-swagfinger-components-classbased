import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Contact from '../../components/Contact/Contact';
import classes from './Phonebook.module.scss';
import Utils from '../../Utils';

class Phonebook extends Component {
  componentDidMount() {
    this.props.onFetchContacts();
  }

  render() {
    const className = Utils.getClassNameString([
      classes.Phonebook,
      Phonebook.name,
      this.props.className
    ]);

    return (
      <div className={className}>
        <h1>Phonebook</h1>

        {/* add search contacts component */}

        <div>
          <ul>
            {this.props.storedPhonebook.map(phonebookEntry => {
              return (
                <li key={phonebookEntry.id}>
                  <Contact
                    id={phonebookEntry.id}
                    name={phonebookEntry.name}
                    lastname={phonebookEntry.lastname}
                    contact={phonebookEntry.contact}
                    onUpdated={this.props.onContactUpdated}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { storedPhonebook: state.phoneBook };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchContacts: () => {
      dispatch(actions.fetchContacts());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Phonebook);
