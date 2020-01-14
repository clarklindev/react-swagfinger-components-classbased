import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
import classes from './ContactCreate.module.scss';
import Utils from '../../Utils';
import axios from '../../axios-contacts';
import Modal from '../../components/UI/Modal/Modal';

import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';

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
        value: { data: '', valid: false, touched: false, pristine: true }
      },

      lastname: {
        elementtype: 'input',
        elementconfig: { type: 'text', placeholder: 'your lastname' },
        label: 'Last name',
        validation: {
          required: true
        },
        value: { data: '', valid: false, touched: false, pristine: true }
      },

      contactnumbers: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your number' },
        label: 'Contact',
        validation: {
          required: true
        },
        value: [{ data: '', valid: false, touched: false, pristine: true }]
      },
      emails: {
        elementtype: 'multiinput',
        elementconfig: { type: 'text', placeholder: 'your email' },
        label: 'Email',
        validation: {
          required: true
        },
        value: [{ data: '', valid: false, touched: false, pristine: true }]
      },

      contactpreference: {
        elementtype: 'select',
        elementconfig: {
          options: [
            { value: 'email', displayValue: 'Email' },
            { value: 'phone', displayValue: 'Phone' }
          ]
        },
        label: 'Contact preference',
        validation: {
          required: false
        },
        value: {
          data: 'email',
          valid: true,
          touched: false,
          pristine: true
        }
      },
      newsletter: {
        elementtype: ''
      },
      socialmedia: {
        elementtype: ''
      },
      notes: {
        elementtype: 'textarea',
        elementconfig: { type: 'text', placeholder: 'your notes' },
        label: 'Notes',
        validation: {
          required: true
        },
        value: { data: '', valid: false, touched: false, pristine: true }
      }
    },
    id: null,
    saving: false,
    submitTest: false,
    formIsValid: null
  };

  //WHEN INPUT CHANGES...
  // STARTS OFF AS TRUE, THE RULES "TRY" FALSIFY THE FUNCTION CALL
  // RETURN TRUE if isValid / FALSE if NOT isValid
  validationCheck(value, rules) {
    let isValid = true;

    //add validation rules below
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    //---------------------------------
    return isValid;
  }

  contactCreateHandler = (event) => {
    event.preventDefault();

    //updated submitTest
    this.setState({ submitTest: true });

    //checks valid property of each input of form, if returns true, it means it is a valid contact
    if (this.checkInputValidProperty(this.state.contact)) {
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
        this.props.history.push('/phonebookadmin');
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
            touched: false,
            pristine: true
          })
        }
      }
    }));
    this.setState((prevState) => {
      let isValid = this.checkInputValidProperty(prevState.contact);

      return {
        formIsValid: isValid
      };
    });
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
    this.setState((prevState) => {
      let isValid = this.checkInputValidProperty(prevState.contact);

      return {
        formIsValid: isValid
      };
    });
  };

  //checks the .valid property of each input in array or individual input
  //returns true/false if contact object is valid/invalid
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
      updatedFormElement.value[index].pristine = false;
    } else {
      //if single value
      updatedFormElement.value.data = event.target.value;
      updatedFormElement.value.valid = this.validationCheck(
        updatedFormElement.value.data,
        updatedFormElement.validation
      );
      updatedFormElement.value.touched = true;
      updatedFormElement.value.pristine = false;
    }

    updatedForm[inputIdentifier] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const contactValidCheck = this.checkInputValidProperty(updatedForm);
    console.log('FORM VALIDITY: ', contactValidCheck);
    this.setState({ contact: updatedForm, formIsValid: contactValidCheck });
  };

  //mutate .pristine prop of inputs to false
  //used to test inputs validity
  onSubmitTest = (bool) => {
    this.setState({ submitTest: bool });

    //make all inputs pristine:false
    //each prop in contact
    for (let inputIdentifier in this.state.contact) {
      let obj;
      if (this.state.contact[inputIdentifier].elementtype === 'multiinput') {
        obj = this.state.contact[inputIdentifier].value.map((each) => {
          console.log('EACH: ', each);
          let val = { ...each };
          val.pristine = false;
          return val;
        });
      } else {
        obj = { ...this.state.contact[inputIdentifier].value };
        obj.pristine = false;
      }

      this.setState((prevState) => ({
        contact: {
          ...prevState.contact,
          [inputIdentifier]: {
            ...prevState.contact[inputIdentifier],
            value: obj
          }
        }
      }));
    }
  };

  render() {
    let formElementsArray = [];

    for (let key in this.state.contact) {
      formElementsArray.push({
        id: key,
        data: this.state.contact[key] //refers to the object associated with the contact property
      });
    }

    let formInputs = formElementsArray.map(({ id, data }) => {
      return (
        <ComponentFactory
          key={id}
          name={id}
          elementtype={data.elementtype}
          elementconfig={data.elementconfig}
          label={data.label}
          value={data.value} //{data, valid, touched, pristine}
          submitTest={this.state.submitTest}
          shouldValidate={data.validation}
          changed={this.inputChangedHandler}
          addInput={this.addInputHandler}
          removeInput={this.removeInputHandler}
        />
      );
    });

    return (
      <div className={this.className}>
        {/* add modal just in-case needed, show binds to state of true/false */}
        <Modal show={this.state.saving}>
          <p>Saving</p>
        </Modal>
        <DefaultPageLayout label='Contact Create'>
          <form onSubmit={this.contactCreateHandler}>
            {formInputs}
            <input
              type='submit'
              value='Submit'
              onMouseOver={() => {
                this.onSubmitTest(true);
              }}
              onMouseOut={() => {
                this.onSubmitTest(false);
              }}
              //disabled={!this.state.formIsValid}//dont disable just handle with valid
            />
          </form>
        </DefaultPageLayout>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onContactCreated: (contact, callback) => {
      dispatch(actions.processContactCreate(contact, callback));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withErrorHandler(ContactCreate, axios));
