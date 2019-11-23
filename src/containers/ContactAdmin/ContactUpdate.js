import React, { Component } from 'react';
import classes from './ContactUpdate.module.scss';
import Utils from '../../Utils';
import axios from '../../axios-contacts';
import Modal from '../../components/UI/Modal/Modal';

import SectionHeader from '../../components/UI/Headers/SectionHeader';
import Input from '../../components/UI/Input/Input';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class ContactUpdate extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ContactUpdate,
      ContactUpdate.name,
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
        value: '',
        valid: false,
        touched: false
      },

      lastname: {
        elementtype: 'input',
        elementconfig: { type: 'text', placeholder: 'your lastname' },
        label: 'Last name',
        validation: {
          required: true
        },
        value: '',
        valid: false,
        touched: false
      },

      contactnumbers: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your number' },
        label: 'Contact',
        validation: {
          required: true
        },
        value: [{ value: '', valid: false, touched: false }]
      },
      emails: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your email' },
        label: 'Email',
        validation: {
          required: true
        },
        value: [{ value: '', valid: false, touched: false }]
      }
    },
    id: null,
    saving: false,
    formIsValid: true
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');

    if (id) {
      axios.get(`/contacts/${id}.json`).then((response) => {
        console.log('response: ', response.data);

        this.setState((prevState) => ({
          loadedContact: true,
          contact: {
            ...prevState.contact
          },
          id: id
        }));

        Object.keys(response.data).map((item) => {
          console.log('item: ', item);

          let val = Array.isArray(response.data[item])
            ? response.data[item].map((each) => {
                return { value: each, valid: true, touched: false };
              })
            : response.data[item];

          return this.setState((prevState) => {
            const updatedState = {
              contact: {
                ...prevState.contact,
                [item]: {
                  ...prevState.contact[item],
                  value: val,
                  valid: true //overall validity of input values (collection),
                }
              },
              formIsValid: true
            };
            return updatedState;
          });
        });
      });
    }
  }

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

  contactUpdateHandler = (event) => {
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
      const formData = {};
      for (let formElementIdentifier in this.state.contact) {
        if (
          this.state.contact[formElementIdentifier].elementtype === 'multiinput'
        ) {
          formData[formElementIdentifier] = this.state.contact[
            formElementIdentifier
          ].value.map((each) => {
            console.log('EACH VALUE: ', each.value);
            return each.value;
          });
        } else {
          formData[formElementIdentifier] = this.state.contact[
            formElementIdentifier
          ].value;
        }
      }
      return this.props.onContactUpdated(formData, this.state.id, () => {
        console.log('CONTACT UPDATED: ', formData);
        this.setState({ saving: false });
        this.redirect();
      });
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
          value: prevState.contact[key].value.concat({
            value: '',
            valid: false,
            touched: false
          })
        }
      }
    }));
    this.setState((prevState) => ({
      formIsValid: this.isValidCheck(prevState.contact)
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
    this.setState((prevState) => ({
      formIsValid: this.isValidCheck(prevState.contact)
    }));
  };

  isValidCheck = (contact) => {
    console.log('IS CONTACT VALID CHECK');
    let formIsValid = true;
    for (let inputIdentifier in contact) {
      if (contact[inputIdentifier].elementtype === 'multiinput') {
        for (let each of contact[inputIdentifier].value) {
          formIsValid = each.valid && formIsValid;
        }
        contact[inputIdentifier].valid = formIsValid; //update array group validity
      } else {
        formIsValid = contact[inputIdentifier].valid && formIsValid;
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
      updatedFormElement.value[index].value = event.target.value;
      updatedFormElement.value[index].valid = this.validationCheck(
        updatedFormElement.value[index].value,
        updatedFormElement.validation
      );
      updatedFormElement.value[index].touched = true;
    } else {
      //if single value
      updatedFormElement.value = event.target.value;
      updatedFormElement.valid = this.validationCheck(
        updatedFormElement.value,
        updatedFormElement.validation
      );
      updatedFormElement.touched = true;
    }

    updatedForm[inputIdentifier] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const contactValidCheck = this.isValidCheck(updatedForm);
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

    let formInputs = formElementsArray.map((formElement) => {
      return (
        <Input
          key={formElement.id}
          name={formElement.id}
          elementtype={formElement.data.elementtype}
          elementconfig={formElement.data.elementconfig}
          label={formElement.data.label}
          value={formElement.data.value}
          touched={formElement.data.touched}
          invalid={!formElement.data.valid}
          changed={this.inputChangedHandler}
          addInput={this.addInputHandler}
          shouldValidate={formElement.data.validation}
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
              <form onSubmit={this.contactUpdateHandler}>
                <div className='row'>
                  <div className='col'>
                    <SectionHeader>Contact Update</SectionHeader>
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

export default withErrorHandler(ContactUpdate, axios);
