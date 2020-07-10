import React, { Component, version } from 'react';
import { connect } from 'react-redux';

import classes from './ProfileCreateOrUpdate.module.scss';

//Helper classes
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

    //reference
    this.submitInputRef = React.createRef();
  }

  state = {
    saving: false,
    formIsValid: null, //for form validation,
    localstateform: null, //for a single profile
  };
  //------------------------------------------------------
  //------------------------------------------------------
  //pull data from firebase, generated form is dependant on whats inside the database in firebase
  //key in database needs to exist to be associated with state,
  componentDidMount() {
    console.log('COMPONENT DID MOUNT - ProfileCreateOrUpdate');
    //generate form from firebase 'form'
    //schema is same for all instances
    //sets up props.schema accessed via redux state state.profile.schema
    this.props.onFetchSchemaProfiles();
  }

  componentDidUpdate(prevProps) {
    //...schema updated from redux
    if (prevProps.schema !== this.props.schema) {
      console.log('COMPONENTDIDUPDATE - props.schema ', this.props.schema);
      //our schema is as per firebase at this moment, createPlaceholders changes this by giving each item in schema a value property
      this.createPlaceholders(this.props.schema);
    }

    if (prevProps.formattedForm !== this.props.formattedForm) {
      //gets a single profile depending on id
      //sets up props.id accessed via redux state state.profile.urlQuerystringId
      //sets up props.activeProfile accessed via redux state state.profile.activeProfile
      console.log('this.props.formattedForm:', this.props.formattedForm);
      this.getDataProfileByIdHandler();
    }

    // //this step deals with metadata if there are multiple entry fields (object) under each value from firebase
    if (prevProps.activeProfile !== this.props.activeProfile) {
      console.log('COMPONENTDIDUPDATE props.activeProfile');
      console.log('props.activeProfile:', this.props.activeProfile);
      this.assignValuesToPlaceholders(); //for a single profile...
    }

    if (prevProps.formattedFormWithData !== this.props.formattedFormWithData) {
      console.log('formattedFormWithData: ', this.props.formattedFormWithData);
      this.setState({
        localstateform: this.props.formattedFormWithData,
      });
    }
  }

  //-----------------------------------------------
  //step1: CREATE FORM from firebase
  //* creates a value property for each attribute of firebase database reference
  //* the value is the value of dataObject = {}
  //* sets up state.form - form is an object of objects
  //* returns same object as FIREBASE data with ADDITIONAL 'VALUE' property of value dataObject (see below)
  //-----------------------------------------------

  createPlaceholders = (schema) => {
    console.log('\nFUNCTION createPlaceholders\n');
    console.log('schema:', schema); //schema is an array

    let formatted = {};
    // //form value is a dataObject, and we save the values we want in dataObjects' .data property
    const dataObject = {
      data: '',
      valid: false,
      errors: null,
      touched: false,
      pristine: true,
    };

    const schemacopy = [...schema];

    //each entry in schema
    //add value property - only if property has a 'type' and check how many inputs to add (.defaultinputs)
    //if componentconfig.startchildcount === options then use the amount of entries under .options as number of inputs
    //adds dataObject as value or an array of dataObjects
    schemacopy.forEach((item) => {
      let tempObj = { ...item };
      switch (tempObj.type) {
        case 'single':
        case 'object':
          tempObj.value = dataObject;
          break;
        case 'array':
          let arrayValues = [];
          for (let j = 0; j < tempObj.componentconfig.defaultinputs; j++) {
            arrayValues.push(dataObject);
          }
          tempObj.value = arrayValues;
          break;

        case 'arrayofobjects':
          let arrayofobjectsValues = [];

          let complexObject = tempObj.componentconfig.metadata.map((item) => {
            return dataObject;
          });

          for (let j = 0; j < tempObj.componentconfig.defaultinputs; j++) {
            arrayofobjectsValues.push(complexObject);
          }

          tempObj.value = arrayofobjectsValues;
          break;
        default:
      }
      formatted[tempObj.field] = tempObj;
    });

    console.log('formatted:', formatted, '\n\n');
    // //save to redux store as formattedForm
    this.props.onFormattedFormCreated(formatted); //formatted is an object of dataObject
  };

  //-----------------------------------------------
  //step2: fetch data from firebase and store in redux .activeProfile prop
  //* return values at eg. https://react-crud-1db4b.firebaseio.com/data/profile/$id
  //* stores returned values in redux accessed via props.activeProfile
  //-----------------------------------------------
  getDataProfileByIdHandler = (queryparam = 'id') => {
    console.log('\nFUNCTION getDataProfileByIdHandler\n');
    const query = new URLSearchParams(this.props.location.search);
    const paramvalue = query.get(queryparam); //get from url query param 'id'
    console.log('paramvalue: ', paramvalue);
    if (paramvalue !== null) {
      this.props.onFetchDataProfile(paramvalue);
    } else {
      console.log('no query params to fetch profile');
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
    let newValues = Object.keys(this.props.activeProfile).map((item) => {
      //if the values also exist from forms schema
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
          val = this.valueValidationCheck(item, this.props.activeProfile[item]);
        }
        return { key: item, value: val };
      }
    });
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

  //item is the property,
  valueValidationCheck = (item, value) => {
    console.log('value: ', value);
    //if metadata exists and the value is an object...
    let validated = null;

    if (
      this.props.formattedForm[item].componentconfig.metadata &&
      typeof value === 'object'
    ) {
      //matching values keys to metadata field,
      const result = Object.keys(value).map((each) => {
        //returns the metadata object
        let obj = this.props.formattedForm[item].componentconfig.metadata.find(
          (meta) => {
            return meta.field === each;
          }
        );
        return validationCheck(value[each], obj.validation); //returns { isValid: isValid, errors: errors };
      });
      let isAllValid = result
        .map((obj) => {
          return obj.isValid;
        })
        .every((each) => {
          return each === true;
        });

      let metadataErrorList = result.map((obj) => {
        return obj.errors;
      });

      validated = { isValid: isAllValid, errors: metadataErrorList };
    } else {
      //not an object...
      validated = validationCheck(
        value,
        this.props.formattedForm[item].componentconfig.validation
      );
    }

    return {
      data: value, //value at the key
      valid: validated.isValid,
      errors: validated.errors, //array of errors
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
    console.log('ADDINPUTHANDLER\n\n\n');
    event.preventDefault();
    console.log('KEY:', key);

    this.setState((prevState) => {
      const updated = {
        localstateform: {
          ...prevState.localstateform,
          [key]: {
            ...prevState.localstateform[key],
            value: prevState.localstateform[key].value.concat({
              data: data,
              valid: false,
              touched: false,
              pristine: true,
              errors: null,
            }),
          },
        },
      };
      console.log('updated: ', updated);

      return {
        localstateform: updated,
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
    console.log('inputChangedHandler key: ', key, '|', newval);

    const updatedForm = {
      ...this.state.localstateform,
    };

    const updatedFormElement = {
      ...updatedForm[key],
    };

    //single profile
    //single prop of form
    let validation = validationCheck(
      newval,
      updatedFormElement.componentconfig.metadata[0].componentconfig.validation
    );
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
    this.setState({ localstateform: updatedForm, formIsValid: formValidCheck });
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
    console.log('\n\n================================================\nRENDER');

    //make an object with 'data' is value associated with property
    //key is the prop name
    //use a data property because later we can spread the data object inside ComponentFactory

    let formElementsArray = [];
    for (let key in this.state.localstateform) {
      console.log('KEY: ', key);
      console.log(
        'this.props.localstateform[key]: ',
        this.state.localstateform[key]
      );
      formElementsArray.push({
        key: key,
        data: this.state.localstateform[key], //refers to the value object associated with the profile property which is {key:{value}}
      });
    }

    //inject object key+data into component factory
    let formInputs = formElementsArray.map((each) => {
      //key is unique because it uses the property 'field'
      return <ComponentFactory key={each.key} data={each.data} />;
    });

    const query = new URLSearchParams(this.props.location.search).get('id');
    console.log('QUERY: ', query);
    console.log('this.props.id: ', this.props.id);
    console.log('this.props.isLoading: ', this.props.isLoading);

    return (
      <React.Fragment>
        {/* add modal just in-case needed, show binds to state of true/false */}
        <Modal show={this.state.saving}>
          <p>Saving</p>
        </Modal>

        {(query !== null && this.props.id === null) ||
        this.props.isLoading === true ? (
          <Spinner />
        ) : (
          <div className={classes.ProfileCreateOrUpdate}>
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
                    onMouseOver={(event) => {} /*this.onSubmitTest(event)*/}
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
                      //this.submitInputRef.current.dispatchEvent(event);
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
    id: state.profile.urlQuerystringId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchSchemaProfiles: () => {
      console.log('mapDispatchToProps: onFetchSchemaProfiles');
      dispatch(actions.processFetchProfileSchema());
    },

    onFetchDataProfile: (paramvalue) => {
      console.log('FUNCTION onFetchProfile');
      dispatch(actions.processFetchProfile(paramvalue)); //paramvalue is the query string prop's value
    },

    onFormattedFormCreated: (formatted) => {
      //at this stge we have props.id and activeProfile
      console.log('mapDispatchToProps: onFormattedFormCreated');
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
