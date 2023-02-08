import React, { Component } from 'react';
import { connect } from 'react-redux';

//ProfileCreateOrUpdate style
import classes from './ProfileCreateOrUpdate.module.scss';

//Helper classes
import axios from '../../axios-firebase';
import { validationHelper } from '../../shared';
import * as arrayHelper from '../../shared/arrayHelper';

//redux store
import * as actions from '../../store/actions';
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
import Separator from '../../components/UI/Separator/Separator';

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
    console.log('COMPONENT DID MOUNT - ProfileCreateOrUpdate()');
    //generate form from firebase 'form'
    //schema is same for all instances
    //sets up props.schema accessed via redux state
    this.props.getSchemaHandler(); //state.profile.schema
  }

  componentDidUpdate(prevProps) {
    //...schema updated from redux
    if (prevProps.schema !== this.props.schema) {
      console.log('COMPONENTDIDUPDATE - props.schema');
      //our schema is as per firebase at this moment, createPlaceholders changes this by giving each item in schema a value property
      this.createPlaceholders(this.props.schema); // state.profile.formattedFormObject
    }

    if (prevProps.formattedFormObject !== this.props.formattedFormObject) {
      //gets a single profile depending on id
      //sets up props.id accessed via redux state state.profile.urlQuerystringId
      //sets up props.activeProfile accessed via redux state state.profile.activeProfile
      console.log('COMPONENTDIDUPDATE - props.formattedFormObject');
      console.log('STATE-> localstateform: this.props.formattedFormObject');
      this.setState({
        localstateform: this.props.formattedFormObject,
      });
      this.getDataProfileByIdHandler(); //state.profile.activeProfile
    }

    // //this step deals with metadata if there are multiple entry fields (object) under each value from firebase
    if (prevProps.activeProfile !== this.props.activeProfile) {
      console.log('COMPONENTDIDUPDATE - props.activeProfile');
      // console.log('props.activeProfile:', this.props.activeProfile);
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
    console.log('\nFUNCTION createPlaceholders()\n');
    console.log('schema:', schema); //schema is an array of objects:[ {"key" : "value"} ]

    let formattedFormObject = {};
    // //form value is a dataObject, and we save the values of input components in dataObjects' .data property
    const dataObject = {
      data: '',
      valid: undefined,
      errors: [],
      touched: false,
      pristine: true,
    };

    const schemacopy = [...schema];
    console.log('schemacopy: ', schemacopy); //array

    // //each entry in schema
    // //add value property - only if property has a 'type' and check how many inputs to add (.defaultinputs)
    // //if componentconfig.startchildcount === options then use the amount of entries under .options as number of inputs
    // //adds dataObject as value or an array of dataObjects
    schemacopy.forEach((item) => {
      let tempObj = { ...item };
      //console.log('tempObj: ', tempObj);

      //adding a property .value
      switch (tempObj.type) {
        case 'single':
          tempObj.value = dataObject;
          console.log(`FORMATTED (single): ${dataObject}`);
          break;
        case 'array':
          let arrayValues = [];
          let count;
          //how many <inputs> to have
          if (tempObj.componentconfig.hasOwnProperty('defaultinputs')) {
            if (isNaN(tempObj.componentconfig.defaultinputs)) {
              throw new Error('needs to be a number');
            }
            count = tempObj.componentconfig.defaultinputs;
          } else {
            //implicit
            count = tempObj.componentconfig.options.length;
            //console.log('count: ', count);
          }
          for (let j = 0; j < count; j++) {
            arrayValues.push(dataObject);
          }
          tempObj.value = arrayValues;
          console.log(`FORMATTED (array): ${arrayValues}`);
          break;

        case 'object':
          //console.log('tempObj: ', tempObj);
          let obj = {};
          tempObj.componentconfig.metadata.forEach((item) => {
            //obj at .name property gets value of dataObject
            obj[item.name] = { ...dataObject };
            //if any of children of metadata has value property
            if (item.value) {
              //referencing the dataObject...data property...
              obj[item.name].data = item.value;
            }
            // console.log('metadata.item: ', item);
          });
          tempObj.value = obj;
          console.log('FORMATTED (object): ', obj);
          break;

        case 'arrayofobjects':
          let arrayofobjectsValues = [];

          //for the number of inputs set in .defaultinputs...
          for (let j = 0; j < tempObj.componentconfig.defaultinputs; j++) {
            //create an object, for eatch item in metadata, give it a dataObject
            let obj = {};
            tempObj.componentconfig.metadata.forEach((item) => {
              obj[item.name] = dataObject;
            });
            arrayofobjectsValues.push(obj);
          }
          tempObj.value = arrayofobjectsValues;
          console.log(`FORMATTED (arrayofobjects): ${arrayofobjectsValues}`);
          break;

        default:
          break;
      }

      formattedFormObject[tempObj.name] = tempObj; //store in formattedFormObject{} object
    });

    console.log('formattedFormObject:', formattedFormObject, '\n\n');
    //save to redux store as formattedFormObject
    this.props.onFormattedFormCreated(formattedFormObject); //formatted is an object of dataObject
  };

  //-----------------------------------------------
  //step2: fetch data from firebase and store in redux .activeProfile prop
  //* return values at eg. https://react-crud-d662d-default-rtdb.firebaseio.com/data/profile/$id
  //* stores returned values in redux accessed via props.activeProfile
  //-----------------------------------------------
  getDataProfileByIdHandler = (queryparam = 'id') => {
    console.log('\nFUNCTION getDataProfileByIdHandler()\n');
    const query = new URLSearchParams(this.props.location.search);
    const paramvalue = query.get(queryparam); //get from url query param 'id'
    //console.log('paramvalue: ', paramvalue);
    if (paramvalue !== null) {
      this.props.onFetchDataProfile(paramvalue);
    } else {
      console.log('no query params to fetch profile');
    }
  };

  //-----------------------------------------------
  //step3: assign values to placeholder object AND validate
  //* Update the dataObject value from step1 with firebase data associated with .activeProfile
  //* sets state formattedFormWithData (not props.formattedFormObject as updating props.formattedFormObject would cause componentDidUpdate to call getFormValuesUsingQuerystringProp())
  //-----------------------------------------------
  assignValuesToPlaceholders = () => {
    console.log('\nFUNCTION assignValuesToPlaceholders()\n');
    //go through all the activeProfile prop values...

    console.log(`this.props.activeProfile: `);
    console.table(this.props.activeProfile); //actual data values from database

    console.log(`this.props.formattedFormObject: `);
    console.table(this.props.formattedFormObject);

    //go through every key from stored values of database
    let newValues = Object.keys(this.props.activeProfile).map(
      (formattribute) => {
        //if the values also exist in the form schema (formattedFormObject)
        if (this.props.formattedFormObject[formattribute]) {
          let value = null;

          //check its type in form schema...
          switch (this.props.formattedFormObject[formattribute].type) {
            case 'single':
              //do validation check on the stored value from database
              //vs form schema componentconfig.validation
              const validated = validationHelper.checkValidity(
                this.props.activeProfile[formattribute], //value
                this.props.formattedFormObject[formattribute].componentconfig
                  .validation
              );
              value = {
                data: this.props.activeProfile[formattribute], //value from database at the key
                valid: validated.isValid,
                errors: validated.errors, //array of errors
                touched: false,
                pristine: true,
              };
              break;

            case 'array':
              //each is the saved value in the database
              value = this.props.activeProfile[formattribute].map((each) => {
                const validated = validationHelper.checkValidity(
                  each,
                  this.props.formattedFormObject[formattribute].componentconfig
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
                let metadata = this.props.formattedFormObject[
                  formattribute
                ].componentconfig.metadata.find((meta) => {
                  return meta.name === attr;
                });

                let valueInFirebase =
                  this.props.formattedFormObject[formattribute].value[attr]
                    .data;
                //console.log('valueInFirebase: ', valueInFirebase);
                const validated = validationHelper.checkValidity(
                  this.props.formattedFormObject[formattribute].value[attr]
                    .data,
                  metadata.validation
                );
                //console.log('validated: ', validated);
                obj[attr] = {
                  data: this.props.formattedFormObject[formattribute].value[
                    attr
                  ].data, //value at the key
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
                // console.log('arrayofobjects each: ', each);

                let obj = {};
                //go through each attribute of the value
                Object.keys(each).forEach((attr) => {
                  // console.log('attr: ', attr);
                  obj[attr] = '';
                  let metadata = this.props.formattedFormObject[
                    formattribute
                  ].componentconfig.metadata.find((meta) => {
                    return meta.name === attr;
                  });
                  const validated = validationHelper.checkValidity(
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

    let updated = { ...this.props.formattedFormObject };
    //update state.form at key with value property from newValues
    filteredNewValues.forEach((each) => {
      updated[each.key].value = each.value;
    });
    console.log('updated: ', updated);
    this.props.onAssignDataToFormattedFormComplete(updated);
  };

  //------------------------------------------------------
  //------------------------------------------------------

  redirect = (path) => {
    this.props.history.push(path);
  };

  //------------------------------------------------------
  //------------------------------------------------------

  //update .pristine prop of inputs to false
  //used to test inputs validity when mouse is over submit button
  onSubmitTest = (event) => {
    console.log('onSubmitTest');
    //make all inputs pristine:false
    //each prop in profile
    console.log(
      'this.props.formattedFormObject: ',
      this.props.formattedFormObject
    );
    console.log('this.props.activeProfile: ', this.props.activeProfile);
    console.log('this.state.localstateform: ', this.state.localstateform);
    let isFormValid = true;
    Object.keys(this.state.localstateform).map((formattribute) => {
      let obj = {};
      switch (this.state.localstateform[formattribute].type) {
        case 'single':
          console.log('single: ', formattribute);
          const validated = validationHelper.checkValidity(
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
            let validated = validationHelper.checkValidity(
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
              const validated = validationHelper.checkValidity(
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
              const validated = validationHelper.checkValidity(
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
  //           this.redirect('/phonebookadmin');
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
    console.log(
      '\n\n================================================\nRE-RENDER'
    );

    //make an object with 'data' is value associated with property
    //key is the prop name
    //use a data property because later we can spread the data object inside ComponentFactory
    let formInputs = [];
    if (this.state.localstateform) {
      console.log('this.state.localstateform: ', this.state.localstateform);
      for (let key in this.state.localstateform) {
        // console.log('key:', key);
        // console.log('data: ', this.state.localstateform[key]);
        formInputs.push(
          <ComponentFactory key={key} data={this.state.localstateform[key]} />
        );
      }
    }

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
        }}
      >
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
              label={this.props.id ? 'Update Profile' : 'Create Profile'}
            >
              <Card>
                <form onSubmit={this.onSubmitHandler} autoComplete='off'>
                  {/* input context provides context state/functions to formInputs */}
                  <div
                    style={{ display: 'flex', flexDirection: 'column' }}
                    padding='not-bottom'
                  >
                    <InputContext.Provider
                      value={{
                        addinput: this.props.addInputHandler,
                        removeinput: this.props.removeInputHandler,
                        changed: this.props.updateInputHandler,
                        moveiteminarray: this.props.moveItemHandler,
                      }}
                    >
                      {formInputs}
                    </InputContext.Provider>
                  </div>
                  <Separator style='Solid' />
                  <div
                    style={{ display: 'flex', flexDirection: 'column' }}
                    padding='true'
                  >
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
                  </div>
                </form>
              </Card>
            </DefaultPageLayout>
          </div>
        )}
      </React.Fragment>
    );
  }
}

//----------------------------------------------------------------------------

const mapStateToProps = (state) => {
  return {
    schema: state.profile.schema, //schema for each profile
    token: state.auth.token,
    isLoading: state.profile.loading,
    activeProfile: state.profile.activeProfile,
    formattedFormObject: state.profile.formattedFormObject,
    formattedFormWithData: state.profile.formattedFormWithData,
    id: state.profile.urlQuerystringId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSchemaHandler: () => {
      console.log('mapDispatchToProps: getSchemaHandler()');
      dispatch(actions.processFetchProfileSchema()); //gives access to props.schema
    },

    onFormattedFormCreated: (formattedFormObject) => {
      //at this stge we have props.id and activeProfile
      console.log('mapDispatchToProps: onFormattedFormCreated()');
      dispatch(actions.processFormatedFormCreated(formattedFormObject)); //give access to props.formattedFormObject
    },

    onFetchDataProfile: (paramvalue) => {
      console.log('mapDispatchToProps: onFetchProfile()');
      //paramvalue is the query string prop's value (id)
      dispatch(actions.processFetchProfile(paramvalue)); //gives access to props.activeProfile / props.urlQuerystringId
    },

    onAssignDataToFormattedFormComplete: (form) => {
      console.log('mapDispatchToProps: onAssignDataToFormattedFormComplete()');
      dispatch(actions.formatDataComplete(form)); //gives access to props.formattedFormWithData
    },

    // onProfileCreated: (token, form, callback) => {
    //   dispatch(actions.processProfileCreate(token, form, callback));
    // },
    // onProfileChanged: (token, form, id, callback) => {
    //   dispatch(actions.processProfileUpdate(token, form, id, callback));
    // },

    //addInputHandler is only called on a multiinput type...
    //assumption is working with array hence .concat({})
    addInputHandler: (formname, type, key, data = '') => {
      console.log('ADDINPUTHANDLER\n\n\n');
      console.log('KEY:', key);

      const dataObj = {
        data: data,
        valid: undefined,
        touched: false,
        pristine: true,
        errors: [],
      };

      switch (type) {
        case 'array':
          this.setState(
            (prevState) => {
              return {
                localstateform: {
                  ...this.state.localstateform,
                  [key]: {
                    ...prevState.localstateform[key],
                    value: prevState.localstateform[key].value.concat(dataObj),
                  },
                },
              };
            },
            () => {
              console.log('After: ', this.state.localstateform);
            }
          );
          break;
        case 'arrayofobjects':
          this.setState((prevState) => {
            //CREATE THE EMPTY OBJECT TO ADD... WE GET THIS FROM THE FIREBASE METADATA
            let obj = {};
            prevState.localstateform[key].componentconfig.metadata.forEach(
              (item) => {
                obj[item.name] = dataObj;
              }
            );

            return {
              localstateform: {
                ...this.state.localstateform,
                [key]: {
                  ...prevState.localstateform[key],
                  value: prevState.localstateform[key].value.concat(obj),
                },
              },
            };
          });

          break;

        default:
          new Error('NO Type');
      }
    },

    //remove checks the index of the input and removes it from the inputs array by index
    removeInputHandler: (key, index) => {
      let updatedInputs = this.state.localstateform[key].value.filter(
        (item, i) => {
          if (index === i) {
            console.log('WHAT TO REMOVE:', item);
            item.key = '';
            item.value = '';
            item = null;
          }
          return index !== i;
        }
      );
      console.log('updatedInputs: ', updatedInputs);

      this.setState((prevState) => {
        console.log('...prevState.form[key]: ', {
          ...prevState.localstateform[key],
        });
        console.log('...updatedInputs', [...updatedInputs]);
        return {
          localstateform: {
            ...prevState.localstateform,
            [key]: {
              ...prevState.localstateform[key],
              value: [...updatedInputs],
            },
          },
        };
      });
    },

    // ------------------------------------
    //@type single, array, object, arrayofobjects. (required)
    //@newval the new value. (required)
    //@key 'field' in firebase. (required)
    updateInputHandler: (type, key, newval, index = null, objectkey = null) => {
      console.log('updateInputHandler key: ', key, '|', newval);
      // console.log('this.state.localstateform: ', this.state.localstateform);
      // const updatedForm = [
      //   ...this.state.localstateform,
      // ];
      // console.log('updatedForm: ', updatedForm);
      // //which prop of form in firebase
      // const updatedFormElement = {
      //   ...updatedForm[key],
      // };

      // //each stored item gets assigned this obj
      // let validation;
      // let obj = {
      //   data: undefined,
      //   touched: false,
      //   pristine: true,
      //   valid: undefined,
      //   errors: undefined,
      // };
      // switch (type) {
      //   case 'single':
      //     //single prop of form
      //     validation = validationHelper.checkValidity(
      //       newval,
      //       updatedFormElement.componentconfig.validation
      //     );
      //     obj = {
      //       data: newval, //new value,
      //       touched: true, //touched?
      //       pristine: false, //pristine?
      //       valid: validation.isValid, //validation
      //       errors: validation.errors, //validation errors
      //     };
      //     updatedFormElement.value = obj;
      //     break;
      //   case 'array':
      //     console.log('array: ', type, key, newval, index);
      //     //single prop of form
      //     validation = validationHelper.checkValidity(
      //       newval,
      //       updatedFormElement.componentconfig.validation
      //     );
      //     obj = {
      //       data: newval, //new value,
      //       touched: true, //touched?
      //       pristine: false, //pristine?
      //       valid: validation.isValid, //validation
      //       errors: validation.errors, //validation errors
      //     };
      //     if (updatedFormElement.value === undefined) {
      //       updatedFormElement.value = [];
      //     }
      //     updatedFormElement.value[index] = obj;
      //     break;

      //   case 'object':
      //     console.log('object: ', type, key, newval, index, objectkey);
      //     validation = validationHelper.checkValidity(
      //       newval,
      //       updatedFormElement.componentconfig.validation
      //     );
      //     obj = {
      //       data: newval, //new value,
      //       touched: true, //touched?
      //       pristine: false, //pristine?
      //       valid: validation.isValid, //validation
      //       errors: validation.errors, //validation errors
      //     };

      //     updatedFormElement.value[objectkey] = obj;

      //     break;

      //   case 'arrayofobjects':
      //     const metadata = updatedFormElement.componentconfig.metadata.find(
      //       (item) => {
      //         return item.name === objectkey;
      //       }
      //     );
      //     console.log('meta:', metadata);
      //     validation = validationHelper.checkValidity(newval, metadata.validation);
      //     console.log('why: ', validation);
      //     obj = {
      //       data: newval, //new value,
      //       touched: true, //touched?
      //       pristine: false, //pristine?
      //       valid: validation.isValid, //validation
      //       errors: validation.errors, //validation errors
      //     };
      //     console.log('here..: ', obj);
      //     updatedFormElement.value[index][objectkey] = obj;
      //     break;
      //   default:
      //     throw new Error('No Type');
      // }

      // updatedForm[key] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

      // const formValidCheck = this.onSubmitTest();
      // // console.log('FORM VALIDITY: ', formValidCheck);
      // this.setState({ localstateform: updatedForm, formIsValid: formValidCheck });
    },

    //only called by arrays
    moveItemHandler: (key, fromIndex, toIndex) => {
      const updatedForm = [...this.state.localstateform];

      const updatedFormElement = {
        ...updatedForm[key],
      };

      //updatedFormElement.value stores an array
      console.log('updatedForm: ', updatedForm);
      console.log('UpdateFormElement: ', updatedFormElement);
      let arr = updatedFormElement.value;
      console.log('arr:', arr, fromIndex, toIndex);
      let updatedArray = arrayHelper.moveItemInArray(arr, fromIndex, toIndex);
      console.log('updated array: ', updatedArray);

      updatedFormElement.value = updatedArray;
      updatedForm[key] = updatedFormElement;
      this.setState({ localstateform: updatedForm });
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ProfileCreateOrUpdate, axios));
