import React, { Component } from 'react';
import classes from './Contact.module.scss';
import Utils from '../../Utils';
class Contact extends Component {
  state = {
    editmode: false,
    id: this.props.id,
    name: this.props.name,
    contact: this.props.contact
  };

  nameChangeHandler = event => {
    this.setState({ name: event.target.value });
  };

  contactChangeHandler = event => {
    this.setState({ contact: event.target.value });
  };

  toggleEditingHandler = () => {
    this.setState(state => {
      return { editmode: !state.editmode };
    });
  };

  render() {
    let className = Utils.getClassNameString([
      classes.Contact,
      Contact.name,
      this.props.className
    ]);

    let normalstate = (
      <React.Fragment>
        <h3>{this.props.name}</h3>
        <p>{this.props.contact}</p>
        <button onClick={this.toggleEditingHandler}>edit</button>
      </React.Fragment>
    );

    let editstate = (
      <React.Fragment>
        <input
          type="text"
          placeholder="name"
          onChange={this.nameChangeHandler}
          value={this.state.name}
        />
        <input
          type="text"
          placeholder="contact"
          onChange={this.contactChangeHandler}
          value={this.state.contact}
        />
        <button
          onClick={() => {
            if (
              this.state.name.trim() !== '' &&
              this.state.contact.trim() !== ''
            ) {
              return this.props.onUpdated(
                {
                  id: this.state.id,
                  name: this.state.name,
                  contact: this.state.contact
                },
                this.toggleEditingHandler
              );
            }
          }}>
          update
        </button>
        <button onClick={this.toggleEditingHandler}>cancel</button>
      </React.Fragment>
    );

    let mode = this.state.editmode ? editstate : normalstate;

    return <div className={className}>{mode}</div>;
  }
}
export default Contact;
