// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  phoneBook: [], //stores firebase data/profiles/id with an id prop
  loading: false,
};

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PROFILE_RESET_ID: return resetId(state, action);
    //CONTACTS
    case actionTypes.PROFILES_FETCH_START: return fetchProfilesStart(state, action);
    case actionTypes.PROFILES_FETCH_SUCCESS: return fetchProfilesSuccess(state, action);
    case actionTypes.PROFILES_FETCH_FAIL: return fetchProfilesFail(state, action);
    // case actionTypes.PROFILES_FETCH_CANCEL: return fetchProfilesCancel(state, action);

    default:
      return state;
  }
};

const resetId = (state, action) => {
  return updateObject(state, {
    urlQuerystringId: null,
    activeProfile: null,
    formattedForm: null,
    formattedFormWithData: null,
  });
};

//contacts
const fetchProfilesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchProfilesSuccess = (state, action) => {
  return updateObject(state, {
    phoneBook: action.data.profiles,
    loading: false,
  });
};

const fetchProfilesFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

// const fetchProfilesCancel = (state, action) => {
//   return state;
// };

export default reducer;