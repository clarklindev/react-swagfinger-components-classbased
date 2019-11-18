import React, { Component } from 'react';

import SectionHeader from '../../components/UI/Headers/SectionHeader';
import classes from './ContactCreate.module.scss';
import Utils from '../../Utils';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-contacts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        elementType: 'input',
        elementConfig: { type: 'text', placeholder: 'your name' },
        label: 'Name',
        value: ''
      },

      lastname: {
        elementType: 'input',
        elementConfig: { type: 'text', placeholder: 'your lastname' },
        label: 'Last name',
        value: ''
      },

      contactnumbers: {
        elementType: 'multiinput',
        elementConfig: { type: 'text', placeholder: 'your number' },
        label: 'Contact',
        value: ['']
      },
      emails: {
        elementType: 'multiinput',
        elementConfig: { type: 'text', placeholder: 'your email' },
        label: 'Email',
        value: ['']
      }
    },
    saving: false
  };

  redirect = () => {
    this.props.history.push('/phonebookadmin');
  };

  contactCreateHandler = () => {
    //validate
    if (
      this.state.contact.name.trim() !== '' &&
      this.state.contact.lastname.trim() !== '' &&
      (this.state.contact.contactnumbers.value.length ||
        this.state.contact.emails.value.length)
    ) {
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
    console.log('STATE: ', this.state);
    let formElementsArray = [];

    for (let key in this.state.contact) {
      formElementsArray.push({
        id: key,
        data: this.state.contact[key] //refers to the object associated with the contact property
      });
    }

    let output = null;

    let formInputs = formElementsArray.map((formElement) => {
      output = (
        <Input
          key={formElement.id}
          elementType={formElement.data.elementType}
          elementConfig={formElement.data.elementConfig}
          label={formElement.data.label}
          value={formElement.data.value}
          changed={(event) => this.inputChangedHandler(event, formElement.id)}
        />
      );

      if (Array.isArray(formElement.data.value)) {
        output = (
          <div key={formElement.id}>
            <label className={classes.Label}>{formElement.data.label}</label>
            <button
              title='Add'
              className={classes.AddButton}
              onClick={(event) => this.addInputHandler(event, formElement.id)}>
              <FontAwesomeIcon icon={['fas', 'plus']} /> Add
            </button>
            {formElement.data.value.map((data, index) => {
              return (
                <div
                  className={classes.ContactGroup}
                  key={formElement.id + index}>
                  <Input
                    elementType={formElement.data.elementType}
                    elementConfig={formElement.data.elementConfig}
                    value={data}
                    changed={(event) =>
                      this.inputChangedHandler(event, formElement.id, index)
                    }
                  />
                  <button
                    title='Delete'
                    type='button'
                    className={classes.RemoveButton}
                    onClick={(event) =>
                      this.removeInputHandler(event, formElement.id, index)
                    }>
                    <FontAwesomeIcon icon={['far', 'trash-alt']} />
                  </button>
                </div>
              );
            })}
          </div>
        );
      }
      return output;
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
              <form>
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
                    <button onClick={this.contactCreateHandler}>save</button>
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
