// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  formlist:{},
  loading: false,
  error: null,
};

//single contact
const fetchStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchSuccess = (state, action) => {
  return updateObject(state, { loading: false, formlist: {...state.formlist, [action.schemapath]:action.data }});
};

const fetchFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const addSchema = (state, action)=>{
  return updateObject(state, {formlist:{...state.formlist, [action.schemapath]:{...state.formlist[action.schemapath], [action.data]:[]} }})
}

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    //add
    case actionTypes.FETCH_START:
      return fetchStart(state, action);
    case actionTypes.FETCH_SUCCESS:
      return fetchSuccess(state, action);
    case actionTypes.FETCH_FAIL:
      return fetchFail(state, action);
    case actionTypes.ADD_SCHEMA:
      return addSchema(state, action);
    default:
      return state;
  }
};

export default reducer;
