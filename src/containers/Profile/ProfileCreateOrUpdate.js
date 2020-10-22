import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './ProfileCreateOrUpdate.module.scss';
//Helper classes
import axios from '../../axios-firebase';
import { CheckValidity as validationCheck } from '../../shared/validation';
//redux store
import * as actions from '../../store/actions/forms';
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
import HorizontalSeparator from '../../components/UI/Separator/HorizontalSeparator';
import FlexColumn from '../../hoc/Layout/FlexColumn';

class ProfileCreateOrUpdate extends Component {
  constructor(props) {
    super(props);

    //reference
    this.submitInputRef = React.createRef();
  }

  state = {
    saving: false,
    localstateform: null, //for a single profile
    isFormValid: true,
  };
  //------------------------------------------------------
  //------------------------------------------------------
  componentDidMount() {
    console.log('COMPONENT DID MOUNT - ProfileCreateOrUpdate');
    //generate form from firebase 'form'
    //schema is same for all instances
    //sets up props.schema accessed via redux state state.profile.schema
    this.props.getSchemaHandler('schemas/collection/profiles');
  }

  componentDidUpdate(prevProps) {
    //...schema updated from redux
    // if (prevProps.schema !== this.props.schema) {
    //   console.log('COMPONENTDIDUPDATE - props.schema ', this.props.schema);
    //   //our schema is as per firebase at this moment, createPlaceholders changes this by giving each item in schema a value property
    //   this.createPlaceholders(this.props.schema);
    // }

    // if (prevProps.formattedForm !== this.props.formattedForm) {
    //   //gets a single profile depending on id
    //   //sets up props.id accessed via redux state state.profile.urlQuerystringId
    //   //sets up props.activeProfile accessed via redux state state.profile.activeProfile
    //   console.log('this.props.formattedForm:', this.props.formattedForm);
    //   this.setState({
    //     localstateform: this.props.formattedForm,
    //   });
    //   this.getDataProfileByIdHandler();
    // }

    // // //this step deals with metadata if there are multiple entry fields (object) under each value from firebase
    // if (prevProps.activeProfile !== this.props.activeProfile) {
    //   console.log('COMPONENTDIDUPDATE props.activeProfile');
    //   console.log('props.activeProfile:', this.props.activeProfile);
    //   this.assignValuesToPlaceholders(); //for a single profile...
    // }

    // if (prevProps.formattedFormWithData !== this.props.formattedFormWithData) {
    //   console.log('formattedFormWithData: ', this.props.formattedFormWithData);
    //   this.setState({
    //     localstateform: this.props.formattedFormWithData,
    //   });
    // }
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
      valid: undefined,
      errors: [],
      touched: false,
      pristine: true,
    };

    const schemacopy = [...schema];
    console.log('schemacopy: ', schemacopy);

    //each entry in schema
    //add value property - only if property has a 'type' and check how many inputs to add (.defaultinputs)
    //if componentconfig.startchildcount === options then use the amount of entries under .options as number of inputs
    //adds dataObject as value or an array of dataObjects
    schemacopy.forEach((item) => {
      let tempObj = { ...item };
      console.log('tempObj: ', tempObj);
      switch (tempObj.type) {
        case 'single':
          tempObj.value = dataObject;
          break;

        case 'array':
          let arrayValues = [];
          let count;
          if (tempObj.componentconfig.hasOwnProperty('defaultinputs')) {
            if (isNaN(tempObj.componentconfig.defaultinputs)) {
              throw new Error('needs to be a number');
            }
            count = tempObj.componentconfig.defaultinputs;
          } else {
            //implicit
            count = tempObj.componentconfig.options.length;
            console.log('count: ', count);
          }
          for (let j = 0; j < count; j++) {
            arrayValues.push(dataObject);
          }
          console.log('arrayValues: ', arrayValues);
          tempObj.value = arrayValues;
          break;

        case 'object':
          let obj = {};
          tempObj.componentconfig.metadata.forEach((item) => {
            obj[item.name] = { ...dataObject };
            if (item.value) {
              obj[item.name].data = item.value;
            }
          });

          tempObj.value = obj;
          break;

        case 'arrayofobjects':
          let arrayofobjectsValues = [];
          for (let j = 0; j < tempObj.componentconfig.defaultinputs; j++) {
            let obj = {};
            tempObj.componentconfig.metadata.forEach((item) => {
              obj[item.name] = dataObject;
            });
            arrayofobjectsValues.push(obj);
          }

          console.log('arrayofobjectsValues: ', arrayofobjectsValues);
          tempObj.value = arrayofobjectsValues;
          break;

        default:
      }
      formatted[tempObj.name] = tempObj;
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
    //go through all the activeProfile prop values...
    let newValues = Object.keys(this.props.activeProfile).map(
      (formattribute) => {
        //if the values also exist from forms schema
        if (this.props.formattedForm[formattribute]) {
          let value = null;
          switch (this.props.formattedForm[formattribute].type) {
            case 'single':
              const validated = validationCheck(
                this.props.activeProfile[formattribute],
                this.props.formattedForm[formattribute].componentconfig
                  .validation
              );
              value = {
                data: this.props.activeProfile[formattribute], //value at the key
                valid: validated.isValid,
                errors: validated.errors, //array of errors
                touched: false,
                pristine: true,
              };
              break;

            case 'array':
              value = this.props.activeProfile[formattribute].map((each) => {
                const validated = validationCheck(
                  each,
                  this.props.formattedForm[formattribute].componentconfig
                    .validation
                );
                return {
                  data: each, //value at the key
                  valid: validated.isValid,
                  errors: validated.errors, //array of errors
                  touched: false,
                  pristine: true,
                };
              });
              break;
            case 'object':
              let keys = Object.keys(this.props.activeProfile[formattribute]);
              let obj = {};
              keys.forEach((attr) => {
                let metadata = this.props.formattedForm[
                  formattribute
                ].componentconfig.metadata.find((meta) => {
                  return meta.name === attr;
                });

                let valueInFirebase = this.props.formattedForm[formattribute]
                  .value[attr].data;
                console.log('valueInFirebase: ', valueInFirebase);
                const validated = validationCheck(
                  this.props.formattedForm[formattribute].value[attr].data,
                  metadata.validation
                );
                console.log('validated: ', validated);
                obj[attr] = {
                  data: this.props.formattedForm[formattribute].value[attr]
                    .data, //value at the key
                  valid: validated.isValid,
                  errors: validated.errors, //array of errors
                  touched: false,
                  pristine: true,
                };
              });
              value = obj;
              break;
            case 'arrayofobjects':
              value = this.props.activeProfile[formattribute].map((each) => {
                //each value is an object... validate each attribute
                console.log('arrayofobjects each: ', each);

                let obj = {};
                //go through each attribute of the value
                Object.keys(each).forEach((attr) => {
                  console.log('attr: ', attr);
                  obj[attr] = '';
                  let metadata = this.props.formattedForm[
                    formattribute
                  ].componentconfig.metadata.find((meta) => {
                    return meta.name === attr;
                  });
                  const validated = validationCheck(
                    each[attr],
                    metadata.validation
                  );
                  obj[attr] = {
                    data: each[attr], //value at the key
                    valid: validated.isValid,
                    errors: validated.errors, //array of errors
                    touched: false,
                    pristine: true,
                  };
                });
                return obj;
              });
              break;
            default:
              return new Error(
                'type needed in firebase... (single,object,array,arrayofobjects'
              );
          }
          console.log('value: ', value);
          return { key: formattribute, value: value };
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

  //------------------------------------------------------
  //------------------------------------------------------

  redirect = () => {
    this.props.history.push('/phonebookadmin');
  };

  //------------------------------------------------------
  //------------------------------------------------------


  

  //update .pristine prop of inputs to false
  //used to test inputs validity when mouse is over submit button
  onSubmitTest = (event) => {
    console.log('onSubmitTest');
    //make all inputs pristine:false
    //each prop in profile
    console.log('this.props.formattedForm: ', this.props.formattedForm);
    console.log('this.props.activeProfile: ', this.props.activeProfile);
    console.log('this.state.localstateform: ', this.state.localstateform);
    let isFormValid = true;
    Object.keys(this.state.localstateform).map((formattribute) => {
      let obj = {};
      switch (this.state.localstateform[formattribute].type) {
        case 'single':
          console.log('single: ', formattribute);
          const validated = validationCheck(
            this.state.localstateform[formattribute].value.data,
            this.state.localstateform[formattribute].componentconfig.validation
          );
          obj = {
            data: this.state.localstateform[formattribute].value.data, //value at the key
            valid: validated.isValid,
            errors: validated.errors, //array of errors
            touched: true,
            pristine: false,
          };
          if (validated.isValid === false) {
            isFormValid = false;
          }
          break;
        case 'array':
          console.log('array:', formattribute);
          obj = this.state.localstateform[formattribute].value.map((each) => {
            let validated = validationCheck(
              each.data,
              this.state.localstateform[formattribute].componentconfig
                .validation
            );
            if (validated.isValid === false) {
              isFormValid = false;
            }
            //console.log('EACH: ', each);
            let val = { ...each };
            val.touched = true;
            val.pristine = false;
            val.errors = validated.errors;
            val.valid = validated.isValid;
            return val;
          });

          break;
        case 'object':
          console.log('object:', formattribute);
          Object.keys(this.state.localstateform[formattribute].value).forEach(
            (attr) => {
              let metadata = this.state.localstateform[
                formattribute
              ].componentconfig.metadata.find((meta) => {
                return meta.name === attr;
              });
              const validated = validationCheck(
                this.state.localstateform[formattribute].value[attr].data,
                metadata.validation
              );
              if (validated.isValid === false) {
                isFormValid = false;
              }
              obj[attr] = {
                data: this.state.localstateform[formattribute].value[attr].data, //value at the key
                valid: validated.isValid,
                errors: validated.errors, //array of errors
                touched: true,
                pristine: false,
              };
              console.log('submit test: ');
              console.log('validated:', validated);
              console.log('obj[attr]:', obj[attr]);
            }
          );

          break;

        case 'arrayofobjects':
          console.log('arrayofobjects:', formattribute);
          obj = this.state.localstateform[formattribute].value.map((each) => {
            //each value is an object... validate each attribute
            console.log('arrayofobjects each: ', each);
            let val = {};
            // //go through each attribute of the value
            Object.keys(each).forEach((attr) => {
              //   console.log('attr: ', attr);
              val[attr] = '';
              let metadata = this.state.localstateform[
                formattribute
              ].componentconfig.metadata.find((meta) => {
                return meta.name === attr;
              });
              const validated = validationCheck(
                each[attr].data,
                metadata.validation
              );
              if (validated.isValid === false) {
                isFormValid = false;
              }
              val[attr] = {
                data: each[attr].data, //value at the key
                valid: validated.isValid,
                errors: validated.errors, //array of errors
                touched: true,
                pristine: false,
              };
            });
            return val;
          });
          break;
        default:
          console.log('nothing');
      }
      console.log('obj:', obj);

      this.setState((prevState) => ({
        localstateform: {
          ...prevState.localstateform,
          [formattribute]: {
            ...prevState.localstateform[formattribute],
            value: obj,
          },
        },

        isFormValid: isFormValid,
      }));

      console.log('=============');
      return obj;
    });
  };

  //function gets called when submit button is clicked
  onSubmitHandler = (event) => {
    console.log('onSubmitHandler..');
    event.preventDefault();
  };

  //   //checks valid property of each input of form, if returns true, it means it is a valid form
  //   if (this.checkInputValidProperty(this.state.form)) {
  //     console.log('submit');

  //     this.setState({ saving: true }); //if form inputs are valid, then set saving to true
  //     const formData = {};
  //     //build formData object and save only the value of each key...
  //     for (let key in this.state.form) {
  //       //array value, store just the value.data in formData
  //       if (this.state.form[key].componentconfig.valuetype === 'array') {
  //         formData[key] = this.state.form[key].value.map((each) => {
  //           return each.data;
  //         });
  //       }
  //       //single value, store just the value.data in formData
  //       else if (this.state.form[key].value) {
  //         formData[key] = this.state.form[key].value.data;
  //       }
  //     }
  //     if (this.state.id !== null) {
  //       return this.props.onProfileChanged(
  //         this.props.token,
  //         formData,
  //         this.state.id,
  //         () => {
  //           console.log('CALLBACK...');
  //           console.log('PROFILE UPDATED: ', formData);
  //           this.setState({ saving: false });
  //           this.redirect();
  //         }
  //       );
  //     }
  //     //id is null...create mode
  //     else {
  //       return this.props.onProfileCreated(this.props.token, formData, () => {
  //         console.log('PROFILE CREATED', formData);
  //         this.setState({ saving: false });
  //         this.props.history.push('/phonebookadmin');
  //       });
  //     }
  //   } else {
  //     console.log('Form contains invalid input');
  //   }
  // };

  render() {
    console.log('\n\n================================================\nRENDER');

    //make an object with 'data' is value associated with property
    //key is the prop name
    //use a data property because later we can spread the data object inside ComponentFactory
    let formInputs = [];
    // if (this.state.localstateform) {
    //   console.log('this.state.localstateform: ', this.state.localstateform);
    //   for (let key in this.state.localstateform) {
    //     console.log('key:', key);
    //     console.log('data: ', this.state.localstateform[key]);
    //     formInputs.push(
    //       <ComponentFactory key={key} data={this.state.localstateform[key]} />
    //     );
    //   }
    // }

    const query = new URLSearchParams(this.props.location.search).get('id');
    // console.log('QUERY: ', query);
    // console.log('this.props.id: ', this.props.id);
    // console.log('this.props.isLoading: ', this.props.isLoading);

    const submitbutton = (
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

          //get the reference to the actual submit input and mimic a mouseover
          this.submitInputRef.current.dispatchEvent(event);
        }}>
        Submit
      </Button>
    );

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
                  <FlexColumn padding="not-bottom">
                    <InputContext.Provider
                      value={{
                        addinput: this.props.addInputHandler,
                        removeinput: this.props.removeInputHandler,
                        changed: this.props.inputChangedHandler,
                        moveiteminarray: this.props.moveItemHandler,
                      }}>
                      {formInputs}
                    </InputContext.Provider>
                  </FlexColumn>
                  <HorizontalSeparator style='Solid' />
                  <FlexColumn padding="true">
                    <input
                      ref={this.submitInputRef}
                      type='submit'
                      value='Submit'
                      onMouseOver={(event) => {
                        console.log('mouseover');
                        this.onSubmitTest(event);
                      }}
                    />
                    {submitbutton}
                  </FlexColumn>
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
    schema: state.profile.schema, //schema for each profile
    token: state.auth.token,
    isLoading: state.profile.loading,
    activeProfile: state.profile.activeProfile,
    formattedForm: state.profile.formattedForm,
    formattedFormWithData: state.profile.formattedFormWithData,
    id: state.profile.urlQuerystringId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSchemaHandler: (schemapath) => {
      console.log('mapDispatchToProps: getSchemaHandler');
      dispatch(actions.getFormSchema(schemapath)); //gives access to props.schema
    },

    // onFormattedFormCreated: (formatted) => {
    //   //at this stge we have props.id and activeProfile
    //   console.log('mapDispatchToProps: onFormattedFormCreated');
    //   dispatch(actions.processFormatedFormCreated(formatted)); //give access to props.formattedForm
    // },

    // onFetchDataProfile: (paramvalue) => {
    //   console.log('FUNCTION onFetchProfile');
    //   //paramvalue is the query string prop's value (id)
    //   dispatch(actions.processFetchProfile(paramvalue)); //gives access to props.activeProfile / props.urlQuerystringId
    // },

    // onAssignDataToFormattedFormComplete: (form) => {
    //   dispatch(actions.formatDataComplete(form)); //gives access to props.formattedFormWithData
    // },

    // onProfileCreated: (token, form, callback) => {
    //   dispatch(actions.processProfileCreate(token, form, callback));
    // },
    // onProfileChanged: (token, form, id, callback) => {
    //   dispatch(actions.processProfileUpdate(token, form, id, callback));
    // },









    

    addInputHandler:()=>{
      dispatch(actions.addInputHandler());
    },
    updateInputHandler:()=>{
      dispatch(actions.updateInputHandler());
    },
    removeInputHandler:()=>{
      dispatch(actions.removeInputHandler());
    },
    moveItemHandler:()=>{
      dispatch(actions.moveItemHandler());
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ProfileCreateOrUpdate, axios));
