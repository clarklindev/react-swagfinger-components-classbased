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
      }
    },
    id: null,
    saving: false,
    loadedContact: null,
    submitTest: false,
    formIsValid: null
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');

    if (id) {
      axios.get(`/contacts/${id}.json`).then((response) => {
        console.log('response: ', response.data); //returns a single contact

        this.setState({
          loadedContact: true,
          id: id
        });

        //map each key of contact (there are inputs/ input sets)
        Object.keys(response.data).map((item) => {
          //check if whats coming back from firebase is an array...
          let val = Array.isArray(response.data[item])
            ? response.data[item].map((each) => {
                return {
                  data: each,
                  valid: true,
                  touched: false,
                  pristine: true
                };
              })
            : {
                data: response.data[item],
                valid: true,
                touched: false,
                pristine: true
              }; //return just the value

          return this.setState((prevState) => {
            const updatedState = {
              contact: {
                ...prevState.contact,
                [item]: {
                  ...prevState.contact[item],
                  //update just the value
                  value: val
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

  contactUpdateHandler = (event) => {
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
      return this.props.onContactUpdated(formData, this.state.id, () => {
        console.log('CONTACT UPDATED: ', formData);
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
        <Input
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
                      onMouseOver={() => {
                        this.onSubmitTest(true);
                      }}
                      onMouseOut={() => {
                        this.onSubmitTest(false);
                      }}
                      // disabled={!this.state.formIsValid} //dont disable just handle with validation
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
