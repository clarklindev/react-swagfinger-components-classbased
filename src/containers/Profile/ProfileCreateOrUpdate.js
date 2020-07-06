import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './ProfileCreateOrUpdate.module.scss';

//Helper classes
import Utils from '../../Utils';
import axios from '../../axios-profiles';
import * as arrayHelper from '../../shared/arrayHelper';
import { CheckValidity as validationCheck } from '../../shared/validation';

//redux store
import * as actions from '../../store/actions/profile';
//context
import InputContext from '../../context/InputContext';

//hoc
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';

//components
import Card from '../../components/UI/Card/Card';
import Modal from '../../components/UI/Modal/Modal';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import Spinner from '../../components/UI/Loaders/Spinner';
import Button from '../../components/UI/Button/Button';

class ProfileCreateOrUpdate extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.ProfileCreateOrUpdate, //css module
      ProfileCreateOrUpdate.name,
    ]);

    //reference
    this.submitInputRef = React.createRef();
  }

  state = {
    saving: false,
    formIsValid: null, //for form validation
  };
  //------------------------------------------------------
  //------------------------------------------------------
  //pull data from firebase, generated form is dependant on whats inside the database in firebase
  //key in database needs to exist to be associated with state,
  componentDidMount() {
    console.log('COMPONENT DID MOUNT - ProfileCreateOrUpdate');
    //generate form from firebase 'form'
    //schema is same for all instances
    this.props.onFetchProfileSchema();
  }

  componentDidUpdate(prevProps) {
    //...schema updated from redux
    if (prevProps.schema !== this.props.schema) {
      console.log('COMPONENTDIDUPDATE - props.schema ', this.props.schema);
      this.createPlaceholders([...this.props.schema]);
    }

    if (prevProps.formattedForm !== this.props.formattedForm) {
      console.log('COMPONENTDIDUPDATE -  props.formatted form');
      //   //check if there is 'id' in querystring, if there is get that info
      //id is the query string value we want to look up in firebase
      this.getFormValuesUsingQuerystringProp('id');
    }

    if (prevProps.activeProfile !== this.props.activeProfile) {
      console.log('COMPONENTDIDUPDATE props.activeProfile');
      console.log('props.activeProfile:', this.props.activeProfile);
      this.assignValuesToPlaceholders();
    }

    if (prevProps.formattedFormWithData !== this.props.formattedFormWithData) {
      console.log('formattedFormWithData: ', this.props.formattedFormWithData);
    }
  }

  //-----------------------------------------------
  //step1: CREATE FORM from firebase
  //* creates a value property for each attribute of firebase database reference
  //* the value is the value of dataObject = {}
  //* sets up state.form - form is an object of objects
  //* returns same object as FIREBASE data with ADDITIONAL 'VALUE' property of value dataObject (see below)
  //-----------------------------------------------

  createPlaceholders = (schemacopy) => {
    console.log('\nFUNCTION createPlaceholders\n');
    let formatted = {};

    //form value is a dataObject, and we save the values we want in dataObjects' .data property
    const dataObject = {
      data: '',
      valid: false,
      errors: null,
      touched: false,
      pristine: true,
    };

    schemacopy.map((item, index) => {
      let tempObj = { ...item };
      //   //add value property - only if for property has a valuetype and check how many inputs to add (.defaultinputs)
      //   //if componentconfig.startchildcount === options then use the amount of entries under .options as number of inputs
      //   //adds dataObject as value or an array of dataObjects
      if (
        tempObj.componentconfig.type !== 'none' &&
        tempObj.componentconfig.type !== undefined
      ) {
        let inputCount =
          tempObj.componentconfig.startchildcount === 'options'
            ? tempObj.componentconfig.metadata.length
            : tempObj.componentconfig.startchildcount;
        console.log('inputCount: ', inputCount);

        let arrayValues = [];
        if (tempObj.componentconfig.type === 'array') {
          for (let j = 0; j < inputCount; j++) {
            arrayValues.push(dataObject);
          }
        }

        tempObj.value =
          tempObj.componentconfig.type === 'array'
            ? arrayValues //array of dataObject
            : dataObject; //single dataObject
      }
      console.log('tempObj: ', tempObj);
      console.log('tempObj.field: ', tempObj.field);
      formatted[tempObj.field] = tempObj;
    });

    console.log('schemacopy: ', schemacopy);
    console.log('formatted:', formatted, '\n\n');

    this.props.onFormattedFormCreated(formatted); //formatted is an object of dataObject but has no value prop
  };

  //-----------------------------------------------
  //step2: fetch data from firebase and store in redux .activeProfile prop
  //* return values at eg. https://react-crud-1db4b.firebaseio.com/data/profile/$id
  //* stores returned values in redux accessed via props.activeProfile
  //-----------------------------------------------
  getFormValuesUsingQuerystringProp = (param) => {
    console.log('\nFUNCTION getFormValuesUsingQuerystringProp\n');
    const query = new URLSearchParams(this.props.location.search);
    const paramvalue = query.get(param); //get id in url query params
    console.log('paramvalue: ', paramvalue);
    if (paramvalue !== null) {
      this.props.onFetchProfile(paramvalue);
    }
  };

  //-----------------------------------------------
  //step3: assign values to placeholder object AND validate
  //* Update the dataObject value from step1 with firebase data associated with .activeProfile
  //* sets state formattedFormWithData (not props.formattedForm as updating props.formattedForm would cause componentDidUpdate to call getFormValuesUsingQuerystringProp())
  //-----------------------------------------------
  assignValuesToPlaceholders = () => {
    console.log('\nFUNCTION assignValuesToPlaceholders\n');
    console.log('this.props.activeProfile: ', this.props.activeProfile);
    //go through all the activeProfile prop values...
    let newValues = Object.keys(this.props.activeProfile).map(
      //if the values also exist from forms schema
      (item) => {
        if (this.props.formattedForm[item]) {
          let val = null;
          //check if whats coming back from firebase is an array...
          if (Array.isArray(this.props.activeProfile[item])) {
            //return array of values
            val = this.props.activeProfile[item].map((each) => {
              return this.valueValidationCheck(item, each);
            });
          }
          //not an array
          else {
            val = this.valueValidationCheck(
              item,
              this.props.activeProfile[item]
            );
          }
          return { key: item, value: val };
        }
      }
    );
    console.log('newValues: ', newValues);
    //without 'undefined' values which dont exist in state.form
    let filteredNewValues = newValues.filter((item) => {
      return item !== undefined && item !== null;
    });

    let updated = { ...this.props.formattedForm };
    //update state.form at key with value property from newValues
    filteredNewValues.forEach((each) => {
      updated[each.key].value = each.value;
    });
    console.log('updated: ', updated);
    this.props.onAssignDataToFormattedFormComplete(updated);
  };

  valueValidationCheck = (item, value) => {
    console.log('value: ', value);
    let isMetadataValidObjects = this.props.formattedForm[
      item
    ].componentconfig.metadata.map((meta) => {
      return validationCheck(value, meta.componentconfig.validation);
    });
    let isMetaValid = isMetadataValidObjects
      .map((obj) => {
        return obj.isValid;
      })
      .every((each) => {
        return each === true;
      });

    let metadataErrorList = isMetadataValidObjects.map((obj) => {
      return obj.errors;
    });

    return {
      data: value, //value at the key
      valid: isMetaValid,
      errors: metadataErrorList,
      touched: false,
      pristine: true,
    };
  };

  //------------------------------------------------------
  //------------------------------------------------------

  redirect = () => {
    this.props.history.push('/phonebookadmin');
  };

  //------------------------------------------------------
  //------------------------------------------------------

  //profile

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
              id: undefined,
              data: data,
              valid: false,
              touched: false,
              pristine: true,
              errors: null,
            }),
          },
        },
      };
    });
    this.setState((prevState) => {
      let isValid = this.checkInputValidProperty(prevState.form);

      return {
        formIsValid: isValid,
      };
    });
  };

  //remove checks the index of the input and removes it from the inputs array by index
  removeInputHandler = (key, index) => {
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
            value: [...updatedInputs],
          },
        },
      };
    });

    this.setState((prevState) => {
      let isValid = this.checkInputValidProperty(prevState.form);

      return {
        formIsValid: isValid,
      };
    });
  };

  // ------------------------------------
  inputChangedHandler = (newval, key, index = null) => {
    //console.log('inputChangedHandler key: ', key, '|', newval);

    const updatedForm = {
      ...this.state.form,
    };

    const updatedFormElement = {
      ...updatedForm[key],
    };

    //single profile
    //single prop of form
    let validation = validationCheck(newval, updatedFormElement.validation);
    //console.log('key: ', key);
    //console.log('validation: ', validation);

    //each stored item gets assigned this obj
    let obj = {
      data: newval,
      touched: true,
      pristine: false,
      valid: validation.isValid,
      errors: validation.errors,
    };

    //if array
    if (index !== null) {
      if (!updatedFormElement.value) {
        updatedFormElement.value = [];
      }
      updatedFormElement.value[index] = obj;
    } else {
      //if single value
      updatedFormElement.value = obj;
    }
    // console.log(
    //   '\n\n\n====================\nUPDATED FORM ELEMENT: \n',
    //   updatedFormElement,
    //   '-----------------------------\n'
    // );

    updatedForm[key] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const formValidCheck = this.checkInputValidProperty(updatedForm);
    // console.log('FORM VALIDITY: ', formValidCheck);
    this.setState({ form: updatedForm, formIsValid: formValidCheck });
  };

  //only called by arrays
  moveItemHandler = (key, fromIndex, toIndex) => {
    const updatedForm = {
      ...this.state.form,
    };

    const updatedFormElement = {
      ...updatedForm[key],
    };

    //updatedFormElement.value stores an array
    console.log('UpdateFormElement: ', updatedFormElement);
    let arr = updatedFormElement.value;
    let updatedArray = arrayHelper.moveItemInArray(arr, fromIndex, toIndex);
    console.log('updated array: ', updatedArray);

    updatedFormElement.value = updatedArray;
    updatedForm[key] = updatedFormElement;
    this.setState({ form: updatedForm });
  };

  //mutate .pristine prop of inputs to false
  //used to test inputs validity when mouse is over submit button
  onSubmitTest = (event) => {
    console.log('onSubmitTest');
    //make all inputs pristine:false
    //each prop in profile
    for (let key in this.props.formattedForm) {
      let obj;

      switch (this.props.formattedForm[key].componentconfig.type) {
        case 'array':
          obj = this.props.form[key].value.map((each) => {
            let validation = validationCheck(
              each.data,
              this.props.form[key].validation
            );
            //console.log('EACH: ', each);
            let val = { ...each };
            val.touched = true;
            val.pristine = false;
            val.errors = validation.errors;
            val.valid = validation.isValid;
            return val;
          });
          break;

        case 'string':
        case 'number':
        case 'bool':
          let validation = validationCheck(
            this.props.form[key].value.data,
            this.props.form[key].validation
          );
          obj = { ...this.props.form[key].value };
          obj.touched = true;
          obj.pristine = false;
          obj.errors = validation.errors;
          obj.valid = validation.isValid;
          break;

        default:
          console.log(this.props.form[key], ': not validating');
          break;
      }

      this.setState((prevState) => ({
        form: {
          ...prevState.form,
          [key]: {
            ...prevState.form[key],
            value: obj,
          },
        },
      }));
    }
    console.log(
      '\n\nON SUBMIT FORM STATE:\n====================================',
      this.state.form,
      '\n\n====================================='
    );
  };

  //checks the .valid property of each input in array or individual input
  //returns true/false if form object is valid/invalid
  checkInputValidProperty = (form) => {
    // console.log('IS FORM VALID CHECK');
    let formIsValid = true;

    //each prop in profile
    for (let key in form) {
      //if the prop of profile has an element type of...
      if (form[key].validation) {
        if (form[key].componentconfig.valuetype === 'array') {
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
        if (this.state.form[key].componentconfig.valuetype === 'array') {
          formData[key] = this.state.form[key].value.map((each) => {
            return each.data;
          });
        }
        //single value, store just the value.data in formData
        else if (this.state.form[key].value) {
          formData[key] = this.state.form[key].value.data;
        }
      }
      if (this.state.id !== null) {
        return this.props.onProfileChanged(
          this.props.token,
          formData,
          this.state.id,
          () => {
            console.log('CALLBACK...');
            console.log('PROFILE UPDATED: ', formData);
            this.setState({ saving: false });
            this.redirect();
          }
        );
      }
      //id is null...create mode
      else {
        return this.props.onProfileCreated(this.props.token, formData, () => {
          console.log('PROFILE CREATED', formData);
          this.setState({ saving: false });
          this.props.history.push('/phonebookadmin');
        });
      }
    } else {
      console.log('Form contains invalid input');
    }
  };

  render() {
    console.log('RENDER');
    let formElementsArray = [];

    //make an object with 'data' is value associated with property
    //key is the prop name
    //use a data property because later we can spread the data object inside ComponentFactory
    if (this.props.formattedFormWithData !== null) {
      for (let key in this.props.formattedForm) {
        console.log('KEY: ', key);
        console.log(
          'this.props.formattedForm[key]: ',
          this.props.formattedForm[key]
        );
        formElementsArray.push({
          key: key,
          data: this.props.formattedForm[key], //refers to the value object associated with the profile property which is {key:{value}}
        });
      }

      //inject object key+data into component factory
      let formInputs = formElementsArray.map((each) => {
        //key is unique because it uses the property 'name'
        return <ComponentFactory key={each.key} data={each.data} />;
      });
      const query = new URLSearchParams(this.props.location.search).get('id');
      //console.log('QUERY: ', query);
      return (
        <React.Fragment>
          {/* add modal just in-case needed, show binds to state of true/false */}
          <Modal show={this.state.saving}>
            <p>Saving</p>
          </Modal>

          {(query !== null && this.props.id === null) ||
          this.props.isLoading ? (
            <Spinner />
          ) : (
            <div className={this.className}>
              <DefaultPageLayout
                label={this.props.id ? 'Update Profile' : 'Create Profile'}>
                <Card>
                  <form onSubmit={this.onSubmitHandler} autoComplete='off'>
                    {/* input context provides context state/functions to formInputs */}
                    <InputContext.Provider
                      value={{
                        addinput: this.addInputHandler,
                        removeinput: this.removeInputHandler,
                        changed: this.inputChangedHandler,
                        moveiteminarray: this.moveItemHandler,
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
                          cancelable: true,
                        });
                        this.submitInputRef.current.dispatchEvent(event);
                      }}>
                      Submit
                    </Button>
                  </form>
                </Card>
              </DefaultPageLayout>
            </div>
          )}
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isLoading: state.profile.loading,
    schema: state.profile.schema, //schema for each profile
    activeProfile: state.profile.activeProfile,
    formattedForm: state.profile.formattedForm,
    formattedFormWithData: state.profile.formattedFormWithData,
    id: state.profile.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfileSchema: () => {
      console.log('mapDispatchToProps: onFetchProfileSchema');
      dispatch(actions.processFetchProfileSchema());
    },

    onFetchProfile: (paramvalue) => {
      console.log('FUNCTION onFetchProfile');
      dispatch(actions.processFetchProfile(paramvalue));
    },

    onFormattedFormCreated: (formatted) => {
      dispatch(actions.processFormatedFormCreated(formatted));
    },

    onAssignDataToFormattedFormComplete: (form) => {
      dispatch(actions.formatDataComplete(form));
    },

    onProfileCreated: (token, form, callback) => {
      dispatch(actions.processProfileCreate(token, form, callback));
    },
    onProfileChanged: (token, form, id, callback) => {
      dispatch(actions.processProfileUpdate(token, form, id, callback));

      // let updateitemIndex = state.phoneBook.findIndex(
      //   (profile) => profile.id === action.profileData.id
      // );
      // let updateitem = { ...state.phoneBook[updateitemIndex] };

      // updateitem.name = action.profileData.name;
      // updateitem.lastname = action.profileData.lastname;
      // updateitem.profilenumbers = action.profileData.profilenumbers;
      // updateitem.emails = action.profileData.emails;

      // let profiles = [...state.phoneBook];
      // profiles[updateitemIndex] = updateitem;
      // console.log('profiles: ', profiles);
      // console.log('state before update: ', state);
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ProfileCreateOrUpdate, axios));
