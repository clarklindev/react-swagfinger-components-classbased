// actions
import * as actionTypes from './actionsTypes';
import axiosInstance from '../../axios-firebase';
import { CheckValidity as validationCheck } from '../../shared/validation';
import * as arrayHelper from '../../shared/arrayHelper';

//=======================================================

export const getSchema = (schemapath) => {
  console.log('FUNCTION getSchema: ', schemapath);
  return (dispatch) => {
    dispatch(fetchStart);
    axiosInstance
      .get(schemapath+'.json')
      .then((response) => {
        console.log('RESPONSE', response);
        dispatch(fetchSuccess(schemapath, response.data));
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        console.log('ERROR MESSAGE: ', err.message);
        dispatch(fetchFail(err));
      });
  };
};

export const addSchema = (schemapath, schemaname) =>{
  return {
    type: actionTypes.FORMS_ADD_SCHEMA, data: schemaname, schemapath
  }
}

export const fetchStart = () => {return { type: actionTypes.FORMS_FETCH_START };};
export const fetchSuccess = (schemapath, data) => {return { type: actionTypes.FORMS_FETCH_SUCCESS, schemapath: schemapath, data: data };};
export const fetchFail = (error) => {return { type: actionTypes.FORMS_FETCH_FAIL, error: error };};

//addInputHandler is only called on a multiinput type...
  //assumption is working with array hence .concat({})
export const addInputHandler = (formname, type, key, data = '') => {
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
  };


//remove checks the index of the input and removes it from the inputs array by index
export const removeInputHandler = (key, index) => {
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
  };



  // ------------------------------------
  //@type single, array, object, arrayofobjects. (required)
  //@newval the new value. (required)
  //@key 'field' in firebase. (required)
  export const updateInputHandler = (type, key, newval, index = null, objectkey = null) => {
    console.log('updateInputHandler key: ', key, '|', newval);

    const updatedForm = {
      ...this.state.localstateform,
    };
    console.log('updatedForm: ', updatedForm);
    //which prop of form in firebase
    const updatedFormElement = {
      ...updatedForm[key],
    };

    //each stored item gets assigned this obj
    let validation;
    let obj = {
      data: undefined,
      touched: false,
      pristine: true,
      valid: undefined,
      errors: undefined,
    };
    switch (type) {
      case 'single':
        //single prop of form
        validation = validationCheck(
          newval,
          updatedFormElement.componentconfig.validation
        );
        obj = {
          data: newval, //new value,
          touched: true, //touched?
          pristine: false, //pristine?
          valid: validation.isValid, //validation
          errors: validation.errors, //validation errors
        };
        updatedFormElement.value = obj;
        break;
      case 'array':
        console.log('array: ', type, key, newval, index);
        //single prop of form
        validation = validationCheck(
          newval,
          updatedFormElement.componentconfig.validation
        );
        obj = {
          data: newval, //new value,
          touched: true, //touched?
          pristine: false, //pristine?
          valid: validation.isValid, //validation
          errors: validation.errors, //validation errors
        };
        if (updatedFormElement.value === undefined) {
          updatedFormElement.value = [];
        }
        updatedFormElement.value[index] = obj;
        break;

      case 'object':
        console.log('object: ', type, key, newval, index, objectkey);
        validation = validationCheck(
          newval,
          updatedFormElement.componentconfig.validation
        );
        obj = {
          data: newval, //new value,
          touched: true, //touched?
          pristine: false, //pristine?
          valid: validation.isValid, //validation
          errors: validation.errors, //validation errors
        };

        updatedFormElement.value[objectkey] = obj;

        break;

      case 'arrayofobjects':
        const metadata = updatedFormElement.componentconfig.metadata.find(
          (item) => {
            return item.name === objectkey;
          }
        );
        console.log('meta:', metadata);
        validation = validationCheck(newval, metadata.validation);
        console.log('why: ', validation);
        obj = {
          data: newval, //new value,
          touched: true, //touched?
          pristine: false, //pristine?
          valid: validation.isValid, //validation
          errors: validation.errors, //validation errors
        };
        console.log('here..: ', obj);
        updatedFormElement.value[index][objectkey] = obj;
        break;
      default:
        throw new Error('No Type');
    }

    updatedForm[key] = updatedFormElement; //update form's input element state as that or 'updatedFormElement'

    const formValidCheck = this.onSubmitTest();
    // console.log('FORM VALIDITY: ', formValidCheck);
    this.setState({ localstateform: updatedForm, formIsValid: formValidCheck });
  };

  //only called by arrays
  export const moveItemHandler = (key, fromIndex, toIndex) => {
    const updatedForm = {
      ...this.state.localstateform,
    };

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
  };