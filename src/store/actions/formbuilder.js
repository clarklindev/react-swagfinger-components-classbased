import * as actionTypes from './actionsTypes';
import axiosInstance from '../../axios-firebase';

export const processFetchComponents = () => {
  console.log('ACTIONS processFetchComponents');
  return (dispatch) => {
    dispatch(fetchComponentsStart());
    axiosInstance
      .get(`/schemas/components.json`)
      .then((response) => {
        console.log('RESPONSE', response);
        dispatch(fetchComponentsSuccess({ ...response.data }));
      })
      .catch((err) => {
        if (axiosInstance.isCancel(err)) {
          console.log('Request canceled ', err.message);
        }
        dispatch(fetchComponentsFail(err));
      });
  };
};

export const fetchComponentsStart = () => {
  console.log('FUNCTION fetchComponentsStart');
  return {
    type: actionTypes.FETCH_COMPONENTS_START,
  };
};

export const fetchComponentsSuccess = (result) => {
  console.log('FUNCTION fetchComponentsSuccess');
  return {
    type: actionTypes.FETCH_COMPONENTS_SUCCESS,
    data: result,
  };
};

export const fetchComponentsFail = (error) => {
  return {
    type: actionTypes.FETCH_COMPONENTS_FAIL,
    error: error,
  };
};
