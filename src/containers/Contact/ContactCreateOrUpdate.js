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
import Spinner from '../../components/UI/Loaders/Spinner';
import Button from '../../components/UI/Button/Button';
import { CheckValidity as validationCheck } from '../../shared/validation';
import Card from '../../components/UI/Card/Card';

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
    id: null, //id of current item being updated
    loadedContact: null, //when axios call gives response
    saving: false,
    formIsValid: null, //for form validation
    form: null
  };
  //------------------------------------------------------
  //------------------------------------------------------
  //pull data from firebase, generated form is dependant on whats inside the database in firebase
  //key in database needs to exist to be associated with state,
  async componentDidMount() {
    //generate form from firebase 'form'
    try {
      //get the structure of the form from firebase
      let formstructure = await axios.get(`/form.json`);
      console.log('formstructure:', formstructure.data);

      let clone = [...formstructure.data];
      let formatted = {};

      const dataObject = {
        data: '',
        valid: false,
        errors: null,
        touched: false,
        pristine: true
      };

      for (let i = 0; i < clone.length; i++) {
        let tempObj = { ...clone[i] };

        let inputCount =
          tempObj.elementconfig.defaultinputs === 'options'
            ? tempObj.elementconfig.options.length
            : tempObj.elementconfig.defaultinputs;

        console.log(
          'tempObj: ',
          tempObj.name,
          ' | ',
          tempObj.elementconfig.defaultinputs === 'options', //use options count to create dataObject
          ' | inputCount: ',
          inputCount
        );

        let arrayValues = [];
        if (tempObj.elementconfig.valuetype === 'array') {
          for (let j = 0; j < inputCount; j++) {
            arrayValues.push(dataObject);
          }
        }

        tempObj.value =
          tempObj.elementconfig.valuetype === 'array'
            ? arrayValues
            : dataObject;

        formatted[tempObj.name] = tempObj;
      }

      //check if there is 'id' in querystring
      const query = new URLSearchParams(this.props.location.search);
      const id = query.get('id'); //get id in url query params
      if (id) {
        let response = await axios.get(`/contacts/${id}.json`);

        //console.log('response: ', response.data); //returns a single contact
        //map each key of contact (there are inputs/ input sets)
        Object.keys(response.data).map((item) => {
          let val = null;
          if (this.state.form[item]) {
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

            let updatedObj = { ...formatted[item] };
            updatedObj.value = val;
            formatted[item] = updatedObj;
          }
          return val;
        });
      }

      //upate state
      this.setState({ form: formatted });
    } catch (error) {
      console.log(error);
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
    console.log('onSubmitHandler..');
    event.preventDefault();

    //checks valid property of each input of form, if returns true, it means it is a valid form
    if (this.checkInputValidProperty(this.state.form)) {
      console.log('submit');

      this.setState({ saving: true }); //if form inputs are valid, then set saving to true
      const formData = {};
      //build formData object and save only the value of each key...
      for (let key in this.state.form) {
        //array value, store just the value.data in formData
        if (this.state.form[key].component === 'multiinput') {
          formData[key] = this.state.form[key].value.map((each) => {
            return each.data;
          });
        }
        //single value, store just the value.data in formData
        else {
          formData[key] = this.state.form[key].value.data;
        }
      }
      if (this.state.id !== null) {
        return this.props.onContactChanged(
          this.props.token,
          formData,
          this.state.id,
          () => {
            console.log('CONTACT UPDATED: ', formData);
            this.setState({ saving: false });
            this.redirect();
          }
        );
      }
      //id is null...create mode
      else {
        return this.props.onContactCreated(this.props.token, formData, () => {
          console.log('CONTACT CREATED', formData);
          this.setState({ saving: false });
          this.props.history.push('/phonebookadmin');
        });
      }
    } else {
      console.log('Form contains invalid input');
    }
  };

  //contact

  //addInputHandler is only called on a multiinput type...
  //assumption is working with array hence .concat({})
  addInputHandler = (event, key, data = '') => {
    event.preventDefault();
    console.log('KEY:', key);

    this.setState((prevState) => {
      return {
        form: {
          ...prevState.form,
          [key]: {
            ...prevState.form[key],
            value: prevState.form[key].value.concat({
              data: data,
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

    let updatedInputs = this.state.form[key].value.filter((item, i) => {
      if (index === i) {
        console.log('WHAT TO REMOVE:', item);
        item.key = '';
        item.value = '';
      }
      return index !== i;
    });
    console.log('updatedInputs: ', updatedInputs);

    this.setState((prevState) => {
      console.log('...prevState.form[key]: ', { ...prevState.form[key] });
      console.log('...updatedInputs', [...updatedInputs]);
      return {
        form: {
          ...prevState.form,
          [key]: {
            ...prevState.form[key],
            value: [...updatedInputs]
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

  //checks the .valid property of each input in array or individual input
  //returns true/false if form object is valid/invalid
  checkInputValidProperty = (form) => {
    // console.log('IS FORM VALID CHECK');
    let formIsValid = true;

    //each prop in contact
    for (let key in form) {
      //if the prop of contact has an element type of...
      if (form[key].validation === true) {
        if (form[key].elementconfig.valuetype === 'array') {
          for (let each of form[key].value) {
            formIsValid = each.valid && formIsValid;
          }
        } else {
          formIsValid = form[key].value.valid && formIsValid;
        }
      }
    }

    return formIsValid;
  };

  // ------------------------------------
  inputChangedHandler = (newval, key, index = null) => {
    console.log('inputChangedHandler key: ', key, ':', newval);
    //single contact
    const updatedForm = {
      ...this.state.form
    };

    //single prop of form
    const updatedFormElement = {
      ...updatedForm[key]
    };

    let validation = validationCheck(newval, updatedFormElement.validation);
    console.log('key: ', key);
    console.log('validation: ', validation);
    //if array
    if (index !== null) {
      updatedFormElement.value[index] = {
        data: newval,
        touched: true,
        pristine: false,
        valid: validation.isValid,
        errors: validation.errors
      };
    } else {
      //if single value
      updatedFormElement.value = {
        data: newval,
        touched: true,
        pristine: false,
        valid: validation.isValid,
        errors: validation.errors
      };
    }

    updatedForm[key] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const formValidCheck = this.checkInputValidProperty(updatedForm);
    // console.log('FORM VALIDITY: ', formValidCheck);
    this.setState({ form: updatedForm, formIsValid: formValidCheck });
  };

  //mutate .pristine prop of inputs to false
  //used to test inputs validity when mouse is over submit button
  onSubmitTest = (event) => {
    console.log('onSubmitTest');
    //make all inputs pristine:false
    //each prop in contact
    for (let key in this.state.form) {
      let obj;
      if (this.state.form[key].elementconfig.valuetype === 'array') {
        obj = this.state.form[key].value.map((each) => {
          let validation = validationCheck(
            each.data,
            this.state.form[key].validation
          );
          //console.log('EACH: ', each);
          let val = { ...each };
          val.touched = true;
          val.pristine = false;
          val.errors = validation.errors;
          val.valid = validation.isValid;
          return val;
        });
      } else {
        let validation = validationCheck(
          this.state.form[key].value.data,
          this.state.form[key].validation
        );
        obj = { ...this.state.form[key].value };
        obj.touched = true;
        obj.pristine = false;
        obj.errors = validation.errors;
        obj.valid = validation.isValid;
      }

      this.setState((prevState) => ({
        form: {
          ...prevState.form,
          [key]: {
            ...prevState.form[key],
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
      //key is unique because it uses the property 'name'
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
              <Card>
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
                    onClick={(event) => {
                      console.log('Submit...');
                      event.preventDefault();
                      this.submitInputRef.current.click();
                    }}
                    onMouseOver={() => {
                      const event = new MouseEvent('mouseover', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                      });
                      this.submitInputRef.current.dispatchEvent(event);
                    }}>
                    Submit
                  </Button>
                </form>
              </Card>
            </DefaultPageLayout>
          ) : (
            <Spinner />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onContactCreated: (token, form, callback) => {
      dispatch(actions.processContactCreate(token, form, callback));
    },
    onContactChanged: (token, form, id, callback) => {
      dispatch(actions.processContactUpdate(token, form, id, callback));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactCreateOrUpdate, axios));
