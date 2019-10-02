import React, { Component } from 'react';
import Contact from './Contact/Contact';
import classes from './Phonebook.module.scss';
import Utils from '../../Utils';
import { Link } from 'react-router-dom';
import SearchFilter from '../../containers/SearchFilter/SearchFilter';

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
  output = (str, regex) => {
    return str.replace(regex, str => `<span>${str}</span>`);
  };

  render() {
    let filtered = this.props.storedPhonebook
      .filter(item => {
        let combinedString = `${item.name} ${item.lastname}`;
        return combinedString.includes(this.state.filterText);
      })
      .map(phonebookEntry => {
        let regex = new RegExp(this.state.filterText, 'gi');

        let entry =
          this.state.filterText.length > 0
            ? this.output(
                `${phonebookEntry.name} ${phonebookEntry.lastname}`,
                regex
              )
            : `${phonebookEntry.name} ${phonebookEntry.lastname}`;

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
        <h1>Phonebook</h1>

        <SearchFilter changed={this.searchChangedHandler} />

        <div>
          <ul>{filtered}</ul>
        </div>
      </div>
    );
  }
}

export default Phonebook;
