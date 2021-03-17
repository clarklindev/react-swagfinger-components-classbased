// actions
import * as actionTypes from './actionsTypes';
import axiosInstance from '../../axios-firebase';

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
    type: actionTypes.ADD_SCHEMA, data: schemaname, schemapath
  }
}

export const fetchStart = () => {return { type: actionTypes.FETCH_START };};
export const fetchSuccess = (schemapath, data) => {return { type: actionTypes.FETCH_SUCCESS, schemapath: schemapath, data: data };};
export const fetchFail = (error) => {return { type: actionTypes.FETCH_FAIL, error: error };};
