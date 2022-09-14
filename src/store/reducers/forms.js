// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    //add
    case actionTypes.FORMS_FETCH_START:
      return fetchStart(state, action);
    case actionTypes.FORMS_FETCH_SUCCESS:
      return fetchSuccess(state, action);
    case actionTypes.FORMS_FETCH_FAIL:
      return fetchFail(state, action);
    case actionTypes.FORMS_ADD_SCHEMA:
      return addSchema(state, action);
    default:
      return state;
  }
};

const initialState = {
  formlist:{},
  schemaListPath: 'schemas/collection',
  loading: false,
  error: null,
};

//single contact
const fetchStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchSuccess = (state, action) => {
  console.log('formlist: ', {...state.formlist, [action.schemapath]:action.data });
  return updateObject(state, { loading: false, formlist: {...state.formlist, [action.schemapath]:action.data }});
};

const fetchFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const addSchema = (state, action)=>{
  return updateObject(state, {formlist:{...state.formlist, [action.schemapath]:{...state.formlist[action.schemapath], [action.data]:[]} }})
}



export default reducer;
