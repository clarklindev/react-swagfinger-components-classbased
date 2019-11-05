import React, { Component } from 'react';
import Contact from './Contact/Contact';
import classes from './Phonebook.module.scss';
import Utils from '../../Utils';
import { Link } from 'react-router-dom';
import SearchFilter from '../../containers/SearchFilter/SearchFilter';
import SectionHeader from '../UI/Headers/SectionHeader';
import PropTypes from 'prop-types';

class Phonebook extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Phonebook,
      Phonebook.name,
      this.props.className
    ]);
  }

  state = {
    filterText: ''
  };

  searchChangedHandler = event => {
    //match string
    console.log('input:', event.target.value);
    this.setState({ filterText: event.target.value });
  };

  //highlighting - matching regular expression (useful for search matching)
  //wraps <span> around reg expression matched string
  regMatch = (str, regex) => {
    return str.replace(regex, str => `<span>${str}</span>`);
  };

  render() {
    let filtered = this.props.storedPhonebook
      .filter(({ name, lastname }) => {
        let combinedString = `${name} ${lastname}`;
        return combinedString
          .toLowerCase()
          .includes(this.state.filterText.toLowerCase());
      })
      .map(phonebookEntry => {
        let regex = new RegExp(this.state.filterText, 'gi');

        // if filterText is not empty
        let entry =
          this.state.filterText.length > 0
            ? this.regMatch(
                `${phonebookEntry.name} ${phonebookEntry.lastname}`,
                regex
              )
            : `${phonebookEntry.name} ${phonebookEntry.lastname}`; //else just show normal name+lastname string

        return (
          <li key={phonebookEntry.id}>
            <Link
              to={{
                pathname: '/viewcontact',
                search: `?id=${phonebookEntry.id}`
              }}>
              <Contact id={phonebookEntry.id} displayText={entry} />
            </Link>
          </li>
        );
      });

    return (
      <div className={this.className}>
        <div className="container">
          <div className={[classes.Wrapper, 'container'].join(' ')}>
            <div className="row">
              <div className="col">
                <SectionHeader>Phonebook</SectionHeader>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SearchFilter changed={this.searchChangedHandler} />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className={classes.Labeledgroup}>
                  <label>Contacts</label>
                  <ul>{filtered}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Phonebook.propTypes = {
  storedPhonebook: PropTypes.array
};

export default Phonebook;
