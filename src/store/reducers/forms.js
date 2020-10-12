// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  formsList: null,
  loading: false,
  error: null,
};

//single contact
const fetchFormsListStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchFormsListSuccess = (state, action) => {
  return updateObject(state, { loading: false, formsList: action.data });
};

const fetchFormsListFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    //add
    case actionTypes.FETCH_FORMSLIST_START:
      return fetchFormsListStart(state, action);
    case actionTypes.FETCH_FORMSLIST_SUCCESS:
      return fetchFormsListSuccess(state, action);
    case actionTypes.FETCH_FORMSLIST_FAIL:
      return fetchFormsListFail(state, action);
    default:
      return state;
  }
};

export default reducer;
