import React, { Component } from 'react';

import SectionHeader from '../../components/UI/Headers/SectionHeader';
import classes from './ContactCreate.module.scss';
import Utils from '../../Utils';
import Input from '../../components/UI/Input/Input';

import Modal from '../../components/UI/Modal/Modal';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-contacts';

class ContactCreate extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ContactCreate,
      ContactCreate.name,
      this.props.className
    ]);
  }

  state = {
    contact: {
      name: {
        elementtype: 'input',
        elementconfig: { type: 'text', placeholder: 'your name' },
        label: 'Name',
        value: ''
      },

      lastname: {
        elementtype: 'input',
        elementconfig: { type: 'text', placeholder: 'your lastname' },
        label: 'Last name',
        value: ''
      },

      contactnumbers: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your number' },
        label: 'Contact',
        value: ['']
      },
      emails: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your email' },
        label: 'Email',
        value: ['']
      }
    },
    saving: false
  };

  redirect = () => {
    this.props.history.push('/phonebookadmin');
  };

  contactCreateHandler = (event) => {
    event.preventDefault();

    //validate
    if (
      this.state.contact.name.value.trim() !== '' &&
      this.state.contact.lastname.value.trim() !== '' &&
      (this.state.contact.contactnumbers.value.length ||
        this.state.contact.emails.value.length)
    ) {
      console.log('submit');

      this.setState({ saving: true });
      return this.props.onContactCreated(
        {
          name: this.state.contact.name.value,
          lastname: this.state.contact.lastname.value,
          contactnumbers: this.state.contact.contactnumbers.value,
          emails: this.state.contact.emails.value
        },
        () => {
          console.log('CALLBACK');
          this.setState({ saving: false });
          this.redirect();
        }
      );
    }
  };

  //contact
  addInputHandler = (event, key) => {
    event.preventDefault();
    console.log('KEY:', key);

    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [key]: {
          ...prevState.contact[key],
          value: prevState.contact[key].value.concat('')
        }
      }
    }));
  };

  removeInputHandler = (event, key, index) => {
    event.preventDefault();

    let updatedInputs = this.state.contact[key].value.filter(
      (_, i) => index !== i
    );
    console.log('updatedInputs: ', updatedInputs);

    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [key]: {
          ...prevState.contact[key],
          value: updatedInputs
        }
      }
    }));
  };

  // ------------------------------------
  inputChangedHandler = (event, inputIdentifier, index = null) => {
    const updatedForm = {
      ...this.state.contact
    };
    const updatedFormElement = {
      ...updatedForm[inputIdentifier]
    };

    //if array
    if (index !== null) {
      updatedFormElement.value[index] = event.target.value;
    } else {
      //if single value
      updatedFormElement.value = event.target.value;
    }
    updatedForm[inputIdentifier] = updatedFormElement;
    this.setState({ contact: updatedForm });
  };

  render() {
    let formElementsArray = [];
    console.log('STATE: ', this.state);
    for (let key in this.state.contact) {
      formElementsArray.push({
        id: key,
        data: this.state.contact[key] //refers to the object associated with the contact property
      });
    }

    let formInputs = formElementsArray.map((formElement) => {
      return (
        <Input
          key={formElement.id}
          name={formElement.id}
          elementtype={formElement.data.elementtype}
          elementconfig={formElement.data.elementconfig}
          label={formElement.data.label}
          value={formElement.data.value}
          changed={this.inputChangedHandler}
          addInput={this.addInputHandler}
          removeInput={this.removeInputHandler}
        />
      );
    });

    return (
      <React.Fragment>
        {/* add modal just in-case needed, show binds to state of true/false */}
        <Modal show={this.state.saving}>
          <p>Saving</p>
        </Modal>

        <div className={this.className}>
          <div className='container'>
            <div className={[classes.Wrapper, 'container'].join(' ')}>
              <form onSubmit={this.contactCreateHandler}>
                <div className='row'>
                  <div className='col'>
                    <SectionHeader>Contact Create</SectionHeader>
                  </div>
                </div>

                <div className='row'>
                  <div className='col'>{formInputs}</div>
                </div>

                <div className='row'>
                  <div className='col'>
                    <input type='submit' value='Submit' />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withErrorHandler(ContactCreate, axios);
