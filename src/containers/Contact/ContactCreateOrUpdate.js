import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './ContactCreateOrUpdate.module.scss';
import Utils from '../../Utils';
import axios from '../../axios-contacts';
import Modal from '../../components/UI/Modal/Modal';
import * as actions from '../../store/actions/contact';

import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import InputContext from '../../context/InputContext';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import { CheckValidity as validationCheck } from '../../shared/validation';
class ContactCreateOrUpdate extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ContactCreateOrUpdate, //css module
      ContactCreateOrUpdate.name
    ]);

    this.submitInputRef = React.createRef();
  }

  state = {
    form: {
      name: {
        elementtype: 'input',
        name: 'name',
        label: 'Name',
        validation: { required: true },
        elementconfig: { type: 'text', placeholder: 'your name' },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      lastname: {
        elementtype: 'input',
        name: 'lastname',
        label: 'Last name',
        validation: { required: true },
        elementconfig: { type: 'text', placeholder: 'your lastname' },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      upload: {
        elementtype: 'upload',
        name: 'upload',
        label: 'Upload',
        validation: {},
        elementconfig: {
          iconsize: 'lg'
        },
        value: {
          data: '',
          valid: true,
          touced: false,
          pristine: true,
          errors: null
        }
      },

      gender: {
        elementtype: 'radio',
        name: 'gender',
        label: 'Gender',
        validation: { required: true },
        elementconfig: {
          type: 'text',
          options: [
            { value: 'male', displaytext: 'Male' },
            { value: 'female', displaytext: 'Female' }
          ]
        },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      height: {
        elementtype: 'counter',
        name: 'height',
        label: 'Height',
        validation: {},
        elementconfig: {
          step: 0.01,
          min: 1.4,
          max: 1.7
        },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      weight: {
        elementtype: 'rangeslider',
        name: 'weight',
        label: 'Weight',
        validation: {},
        elementconfig: {
          increments: 10,
          min: 40,
          max: 150
        },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      salary: {
        elementtype: 'multirangeslider',
        name: 'salary',
        label: 'Salary',
        validation: {},
        elementconfig: { min: 0, max: 15000 },
        value: [
          {
            data: null,
            valid: true,
            touched: false,
            pristine: true,
            errors: null
          },
          {
            data: null,
            valid: true,
            touched: false,
            pristine: true,
            errors: null
          }
        ]
      },

      dateofbirth: {
        elementtype: 'datepicker',
        name: 'dateofbirth',
        label: 'Date of birth',
        validation: { required: true },
        elementconfig: { type: 'text', placeholder: 'Enter date of birth' },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      contactnumbers: {
        elementtype: 'multiinput',
        name: 'contactnumbers',
        label: 'Contact',
        validation: { required: true },
        elementconfig: { type: 'text', placeholder: 'your number' },
        value: [
          {
            data: '',
            valid: false,
            touched: false,
            pristine: true,
            errors: null
          }
        ]
      },

      emails: {
        elementtype: 'multiinput',
        name: 'emails',
        label: 'Email',
        validation: { required: true },
        elementconfig: { type: 'text', placeholder: 'your email' },
        value: [
          {
            data: '',
            valid: false,
            touched: false,
            pristine: true,
            errors: null
          }
        ]
      },

      contactpreference: {
        elementtype: 'select',
        name: 'contactpreference',
        label: 'Contact preference',
        validation: {},
        elementconfig: {
          placeholder: 'Choose contact preference',
          options: [
            { value: '', displaytext: 'Select an option' },
            { value: 'email', displaytext: 'Email' },
            { value: 'phone', displaytext: 'Phone' }
          ]
        },
        value: {
          data: '',
          valid: true,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      newsletter: {
        elementtype: 'checkbox',
        name: 'newsletter',
        label: 'Subscribe to newsletter',
        validation: { required: false },
        elementconfig: {
          options: [
            { value: 'weekly', displaytext: 'Weekly' },
            { value: 'monthly', displaytext: 'Monthly' }
          ]
        },
        value: [
          {
            data: 'weekly',
            valid: true,
            touched: false,
            pristine: true,
            errors: null
          },
          {
            data: 'monthly',
            valid: true,
            touched: false,
            pristine: true,
            errors: null
          }
        ]
      },

      socialmedia: {
        elementtype: 'selectwithinput',
        name: 'socialmedia',
        label: 'Social media',
        validation: { required: true },
        elementconfig: {
          options: [
            { value: '', displaytext: '' },
            { value: 'facebook', displaytext: 'Facebook' },
            { value: 'instagram', displaytext: 'Instagram' },
            { value: 'twitter', displaytext: 'Twitter' },
            { value: 'youtube', displaytext: 'Youtube' },
            { value: 'snapchat', displaytext: 'Snapchat' },
            { value: 'linkedin', displaytext: 'LinkedIn' },
            { value: 'tiktok', displaytext: 'TikTok' },
            { value: 'pinterest', displaytext: 'Pinterest' }
          ]
        },
        value: [
          {
            data: null,
            valid: true,
            touched: false,
            pristine: true,
            errors: null
          }
        ]
      },

      notes: {
        elementtype: 'textarea',
        name: 'notes',
        label: 'Notes',
        validation: { required: false },
        elementconfig: { type: 'text', placeholder: 'your notes' },
        value: {
          data: '',
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      },

      privateprofile: {
        elementtype: 'toggle',
        name: 'privateprofile',
        label: 'Hide profile',
        validation: {},
        elementconfig: {},
        value: {
          data: null,
          valid: false,
          touched: false,
          pristine: true,
          errors: null
        }
      }
    },

    id: null, //id of current item being updated
    loadedContact: null, //when axios call gives response
    saving: false,
    formIsValid: null //for form validation
  };
  //------------------------------------------------------
  //------------------------------------------------------
  //pull data from firebase, generated form is dependant on whats inside the database in firebase
  //key in database needs to exist to be associated with state,
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');

    if (id) {
      axios.get(`/contacts/${id}.json`).then((response) => {
        //console.log('response: ', response.data); //returns a single contact

        this.setState({
          loadedContact: true,
          id: id
        });

        //map each key of contact (there are inputs/ input sets)
        Object.keys(response.data).map((item) => {
          let val = null;
          //check if whats coming back from firebase is an array...
          if (Array.isArray(response.data[item])) {
            val = response.data[item].map((each) => {
              let validation = validationCheck(
                each,
                this.state.form[item].validation
              );
              return {
                data: each,
                valid: validation.isValid,
                errors: validation.errors,
                touched: false,
                pristine: true
              };
            }); //return array of values
          } else {
            let validation = validationCheck(
              response.data[item],
              this.state.form[item].validation
            );
            val = {
              data: response.data[item], //value at the key
              valid: validation.isValid,
              errors: validation.errors,
              touched: false,
              pristine: true
            }; //return single value
          }
          //console.log('key:', item, ' | val: ', val);

          //update the current key with its value from firebase
          return this.setState((prevState) => {
            const updatedState = {
              form: {
                ...prevState.form,
                [item]: {
                  ...prevState.form[item],
                  //update just the value
                  value: val
                }
              },
              formIsValid: true //set formIsValid to true as default response from axios
            };
            return updatedState;
          });
        });
      });
    }
  }
  //------------------------------------------------------
  //------------------------------------------------------

  redirect = () => {
    this.props.history.push('/phonebookadmin');
  };

  //------------------------------------------------------
  //------------------------------------------------------

  //function gets called when submit button is clicked
  onSubmitHandler = (event) => {
    event.preventDefault();

    //checks valid property of each input of form, if returns true, it means it is a valid form
    if (this.checkInputValidProperty(this.state.form)) {
      console.log('submit');

      this.setState({ saving: true }); //if form inputs are valid, then set saving to true
      const formData = {};
      //build formData object and save only the value of each key...
      for (let formElementIdentifier in this.state.form) {
        //array value, store just the value.data in formData
        if (
          this.state.form[formElementIdentifier].elementtype === 'multiinput'
        ) {
          formData[formElementIdentifier] = this.state.form[
            formElementIdentifier
          ].value.map((each) => {
            return each.data;
          });
        }
        //single value, store just the value.data in formData
        else {
          formData[formElementIdentifier] = this.state.form[
            formElementIdentifier
          ].value.data;
        }
      }
      if (this.state.id !== null) {
        return this.props.onContactChanged(formData, this.state.id, () => {
          console.log('CONTACT UPDATED: ', formData);
          this.setState({ saving: false });
          this.redirect();
        });
      }
      //id is null...create mode
      else {
        return this.props.onContactCreated(formData, () => {
          console.log('CONTACT CREATED', formData);
          this.setState({ saving: false });
          this.props.history.push('/phonebookadmin');
        });
      }
    }
  };

  //contact

  //addInputHandler is only called on a multiinput type...
  //assumption is working with array hence .concat({})
  addInputHandler = (event, key) => {
    event.preventDefault();
    console.log('KEY:', key);

    this.setState((prevState) => {
      return {
        form: {
          ...prevState.form,
          [key]: {
            ...prevState.form[key],
            value: prevState.form[key].value.concat({
              data: '',
              valid: false,
              touched: false,
              pristine: true,
              errors: null
            })
          }
        }
      };
    });
    this.setState((prevState) => {
      let isValid = this.checkInputValidProperty(prevState.form);

      return {
        formIsValid: isValid
      };
    });
  };

  //remove checks the index of the input and removes it from the inputs array by index
  removeInputHandler = (event, key, index) => {
    event.preventDefault();

    let updatedInputs = this.state.form[key].value.filter(
      (_, i) => index !== i
    );
    console.log('updatedInputs: ', updatedInputs);

    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [key]: {
          ...prevState.form[key],
          value: updatedInputs
        }
      }
    }));

    this.setState((prevState) => {
      let isValid = this.checkInputValidProperty(prevState.form);

      return {
        formIsValid: isValid
      };
    });
  };

  //checks the .valid property of each input in array or individual input
  //returns true/false if form object is valid/invalid
  checkInputValidProperty = (form) => {
    // console.log('IS FORM VALID CHECK');
    let formIsValid = true;

    //each prop in contact
    for (let inputIdentifier in form) {
      //if the prop of contact has an element type of...
      if (form[inputIdentifier].elementtype === 'multiinput') {
        for (let each of form[inputIdentifier].value) {
          formIsValid = each.valid && formIsValid;
        }
      } else {
        formIsValid = form[inputIdentifier].value.valid && formIsValid;
      }
    }

    return formIsValid;
  };

  // ------------------------------------
  inputChangedHandler = (newval, inputIdentifier, index = null) => {
    // console.log('inputChangedHandler: ', inputIdentifier);
    //single contact
    const updatedForm = {
      ...this.state.form
    };

    //single prop of form
    const updatedFormElement = {
      ...updatedForm[inputIdentifier]
    };

    let validation = validationCheck(newval, updatedFormElement.validation);
    //if array
    if (index !== null) {
      updatedFormElement.value[index].data = newval;
      updatedFormElement.value[index].touched = true;
      updatedFormElement.value[index].pristine = false;
      updatedFormElement.value[index].valid = validation.isValid;
      updatedFormElement.value[index].errors = validation.errors;
    } else {
      //if single value
      updatedFormElement.value.data = newval;
      updatedFormElement.value.touched = true;
      updatedFormElement.value.pristine = false;
      updatedFormElement.value.valid = validation.isValid;
      updatedFormElement.value.errors = validation.errors;
    }

    updatedForm[inputIdentifier] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const formValidCheck = this.checkInputValidProperty(updatedForm);
    // console.log('FORM VALIDITY: ', formValidCheck);
    this.setState({ form: updatedForm, formIsValid: formValidCheck });
  };

  //mutate .pristine prop of inputs to false
  //used to test inputs validity when mouse is over submit button
  onSubmitTest = (event) => {
    //make all inputs pristine:false
    //each prop in contact
    for (let inputIdentifier in this.state.form) {
      let obj;
      if (
        this.state.form[inputIdentifier].elementtype === 'multiinput' ||
        this.state.form[inputIdentifier].elementtype === 'selectwithinput'
      ) {
        obj = this.state.form[inputIdentifier].value.map((each) => {
          console.log('EACH: ', each);
          let val = { ...each };
          val.pristine = false;
          return val;
        });
      } else {
        obj = { ...this.state.form[inputIdentifier].value };
        obj.pristine = false;
      }

      this.setState((prevState) => ({
        form: {
          ...prevState.form,
          [inputIdentifier]: {
            ...prevState.form[inputIdentifier],
            value: obj
          }
        }
      }));
    }
  };

  render() {
    let formElementsArray = [];
    for (let key in this.state.form) {
      formElementsArray.push({
        id: key,
        data: this.state.form[key] //refers to the object associated with the contact property
      });
    }

    let formInputs = formElementsArray.map((each) => {
      return <ComponentFactory key={each.id} id={each.id} data={each.data} />;
    });
    let query = new URLSearchParams(this.props.location.search).get('id');
    return (
      <React.Fragment>
        {/* add modal just in-case needed, show binds to state of true/false */}
        <Modal show={this.state.saving}>
          <p>Saving</p>
        </Modal>

        <div className={this.className}>
          {(this.state.loadedContact && this.state.id !== null) ||
          //if id does not exist
          query === null ? (
            <DefaultPageLayout
              label={this.state.id ? 'Update Contact' : 'Create Contact'}>
              <form onSubmit={this.onSubmitHandler} autoComplete='off'>
                {/* input context provides context state/functions to formInputs */}
                <InputContext.Provider
                  value={{
                    addinput: this.addInputHandler,
                    removeinput: this.removeInputHandler,
                    changed: this.inputChangedHandler
                  }}>
                  {formInputs}
                </InputContext.Provider>
                <input
                  ref={this.submitInputRef}
                  type='submit'
                  value='Submit'
                  onMouseOver={(event) => this.onSubmitTest(event)}
                  // disabled={!this.state.formIsValid} //dont disable just handle with validation
                />
                <Button
                  type='WithBorder'
                  onClick={() => this.submitInputRef.current.click()}>
                  Submit
                </Button>
              </form>
            </DefaultPageLayout>
          ) : (
            <Spinner />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onContactCreated: (form, callback) => {
      dispatch(actions.processContactCreate(form, callback));
    },
    onContactChanged: (form, id, callback) => {
      dispatch(actions.processContactUpdate(form, id, callback));
    }
  };
};
export default connect(
  null,
  mapDispatchToProps
)(withErrorHandler(ContactCreateOrUpdate, axios));
