// actions
import * as actionTypes from './actionsTypes';
import axios from 'axios';
import axiosInstance from '../../axios-firebase';
const source = axios.CancelToken.source();

//=======================================================

export const processFetchForms = () => {
  console.log('processFetchForms');
  // async constant
  return (dispatch) => {
    dispatch(fetchFormsStart);
    axiosInstance
      .get('/schemas/collection.json')
      .then((response) => {
        console.log('RESPONSE', response);

        //this step is so we can add ID to the object
        const list = {};
        for (let key in response.data) {
          list[key] = response.data[key];
        }
        dispatch(fetchFormsSuccess(list));
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        console.log('ERROR MESSAGE: ', err.message);
        dispatch(fetchFormsFail(err));
      });
  };
};

export const fetchFormsStart = () => {
  return { type: actionTypes.FETCH_FORMSLIST_START };
};

export const fetchFormsSuccess = (data) => {
  console.log('FUNCTION fetchFormsSuccess');
  return { type: actionTypes.FETCH_FORMSLIST_SUCCESS, data: data };
};

export const fetchFormsFail = (error) => {
  return { type: actionTypes.FETCH_FORMSLIST_FAIL, error: error };
};
