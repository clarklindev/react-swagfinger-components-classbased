import React, { Component } from 'react';
import classes from './ContactCreate.module.scss';
import Utils from '../../Utils';
import axios from '../../axios-contacts';
import Modal from '../../components/UI/Modal/Modal';

import SectionHeader from '../../components/UI/Headers/SectionHeader';
import Input from '../../components/UI/Input/Input';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

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
        validation: {
          required: true
        },
        value: { data: '', valid: false, touched: false }
      },

      lastname: {
        elementtype: 'input',
        elementconfig: { type: 'text', placeholder: 'your lastname' },
        label: 'Last name',
        validation: {
          required: true
        },
        value: { data: '', valid: false, touched: false }
      },

      contactnumbers: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your number' },
        label: 'Contact',
        validation: {
          required: true
        },
        value: [{ data: '', valid: false, touched: false }]
      },
      emails: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your email' },
        label: 'Email',
        validation: {
          required: true
        },
        value: [{ data: '', valid: false, touched: false }]
      }
    },
    id: null,
    saving: false,
    formIsValid: null
  };

  redirect = () => {
    this.props.history.push('/phonebookadmin');
  };

  // STARTS OFF AS TRUE, THE RULES "TRY" FALSIFY THE FUNCTION CALL
  // RETURN TRUE if isValid / FALSE if NOT isValid
  validationCheck(value, rules) {
    let isValid = true;

    //add validation rules below
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    //has only alphabet
    //has only numbers

    //---------------------------------
    return isValid;
  }

  contactCreateHandler = (event) => {
    event.preventDefault();

    //validate
    if (
      this.state.contact.name.value.data.trim() !== '' &&
      this.state.contact.lastname.value.data.trim() !== '' &&
      (this.state.contact.contactnumbers.value.length ||
        this.state.contact.emails.value.length)
    ) {
      console.log('submit');

      this.setState({ saving: true });
      const formData = {};
      for (let formElementIdentifier in this.state.contact) {
        //array value
        if (
          this.state.contact[formElementIdentifier].elementtype === 'multiinput'
        ) {
          formData[formElementIdentifier] = this.state.contact[
            formElementIdentifier
          ].value.map((each) => {
            console.log('EACH VALUE: ', each.data);
            return each.data;
          });
        }
        //single value
        else {
          formData[formElementIdentifier] = this.state.contact[
            formElementIdentifier
          ].value.data;
        }
      }
      return this.props.onContactCreated(formData, () => {
        console.log('CONTACT CREATED', formData);
        this.setState({ saving: false });
        this.redirect();
      });
    }
  };

  //contact
  //addInputHandler is only called on a multiinput type...
  //assumption is working with array hence .concat({})
  addInputHandler = (event, key) => {
    event.preventDefault();
    console.log('KEY:', key);

    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [key]: {
          ...prevState.contact[key],
          value: prevState.contact[key].value.concat({
            data: '',
            valid: false,
            touched: false
          })
        }
      }
    }));
    this.setState((prevState) => ({
      formIsValid: this.checkInputValidProperty(prevState.contact)
    }));
  };

  //remove checks the index of the input and removes it from the inputs array by index
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
    this.setState((prevState) => ({
      formIsValid: this.checkInputValidProperty(prevState.contact)
    }));
  };

  checkInputValidProperty = (contact) => {
    console.log('IS CONTACT VALID CHECK');
    let formIsValid = true;

    //each prop in contact
    for (let inputIdentifier in contact) {
      //if the prop of contact has an element type of...
      if (contact[inputIdentifier].elementtype === 'multiinput') {
        for (let each of contact[inputIdentifier].value) {
          formIsValid = each.valid && formIsValid;
        }
      } else {
        formIsValid = contact[inputIdentifier].value.valid && formIsValid;
      }
    }
    return formIsValid;
  };

  // ------------------------------------
  inputChangedHandler = (event, inputIdentifier, index = null) => {
    //single contact
    const updatedForm = {
      ...this.state.contact
    };

    //single prop of contact
    const updatedFormElement = {
      ...updatedForm[inputIdentifier]
    };

    //if array
    if (index !== null) {
      updatedFormElement.value[index].data = event.target.value;
      updatedFormElement.value[index].valid = this.validationCheck(
        updatedFormElement.value[index].data,
        updatedFormElement.validation
      );
      updatedFormElement.value[index].touched = true;
    } else {
      //if single value
      updatedFormElement.value.data = event.target.value;
      updatedFormElement.value.valid = this.validationCheck(
        updatedFormElement.value.data,
        updatedFormElement.validation
      );
      updatedFormElement.value.touched = true;
    }

    updatedForm[inputIdentifier] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const contactValidCheck = this.checkInputValidProperty(updatedForm);
    console.log('FORM VALIDITY: ', contactValidCheck);
    this.setState({ contact: updatedForm, formIsValid: contactValidCheck });
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

    let formInputs = formElementsArray.map(({ id, data }) => {
      return (
        <Input
          key={id}
          name={id}
          elementtype={data.elementtype}
          elementconfig={data.elementconfig}
          label={data.label}
          value={data.value} //{data, valid, touched}
          shouldValidate={data.validation}
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
                    <input
                      type='submit'
                      value='Submit'
                      disabled={!this.state.formIsValid}
                    />
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
