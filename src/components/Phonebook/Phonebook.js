import React, { Component } from 'react';
import Contact from './Contact/Contact';
import classes from './Phonebook.module.scss';
import Utils from '../../Utils';
import { Link } from 'react-router-dom';

class Phonebook extends Component {
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
        <p>TODO: search component</p>
        <div>
          <ul>
            {this.props.storedPhonebook.map(phonebookEntry => {
              return (
                <li key={phonebookEntry.id}>
                  <Link
                    to={{
                      pathname: '/viewcontact',
                      search: `?id=${phonebookEntry.id}`
                    }}>
                    <Contact
                      id={phonebookEntry.id}
                      name={phonebookEntry.name}
                      lastname={phonebookEntry.lastname}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Phonebook;
