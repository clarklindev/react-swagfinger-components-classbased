// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.PROFILE_CREATE: return addProfile(state, action); //add
    case actionTypes.PROFILE_UPDATE: return updateProfile(state, action); //update
    case actionTypes.PROFILE_DELETE: return removeProfile(state, action); //remove

    //schema
    case actionTypes.PROFILE_FETCH_SCHEMA_START: return fetchProfileSchemaStart(state, action);
    case actionTypes.PROFILE_FETCH_SCHEMA_SUCCESS: return fetchProfileSchemaSuccess(state, action);
    case actionTypes.PROFILE_FORMAT_SCHEMA_WITH_DATA: return formatSchemaWithData(state, action);
    case actionTypes.PROFILE_FORMATTED_FORM_CREATED: return formattedFormCreated(state, action);
   

    //SINGLE CONTACT
    case actionTypes.PROFILE_FETCH_START: return fetchProfileStart(state, action);
    case actionTypes.PROFILE_FETCH_SUCCESS: return fetchProfileSuccess(state, action);
    // case actionTypes.PROFILE_FETCH_FAIL: return fetchProfileFail(state, action);

    default:
      return state;
  }
};

const initialState = {
  
  schema: [],

  urlQuerystringId: null,
  activeProfile: null, //the actual object with all the props of the form
  formattedForm: null, //without data
  formattedFormWithData: null,
  error: null,
};


const addProfile = (state, action) => {
  console.log('PROFILE ADDED');
  return updateObject(state, {
    phoneBook: state.phoneBook.concat(action.profile),
  });
};

const updateProfile = (state, action) => {
  let updateitemIndex = state.phoneBook.findIndex(
    (profile) => profile.id === action.profileData.id
  );
  let updateitem = { ...state.phoneBook[updateitemIndex] };

  updateitem.name = action.profileData.name;
  updateitem.lastname = action.profileData.lastname;
  updateitem.contactnumbers = action.profileData.contactnumbers;
  updateitem.emails = action.profileData.emails;

  let profiles = [...state.phoneBook];
  profiles[updateitemIndex] = updateitem;
  return updateObject(state, { phoneBook: profiles });
};

const removeProfile = (state, action) => {
  const updatedArray = state.phoneBook.filter(
    (profile) => profile.id !== action.profileData.id
  );
  console.log('contactDELETE updated array: ', updatedArray);
  console.log('state before remove: ', state);
  return updateObject(state, { phoneBook: updatedArray });
};

//schema
const fetchProfileSchemaStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchProfileSchemaSuccess = (state, action) => {
  return updateObject(state, { schema: action.response.data, loading: false });
};

const formatSchemaWithData = (state, action) => {
  return updateObject(state, {
    state,
    loading: false,
    formattedFormWithData: action.data,
  });
};

const formattedFormCreated = (state, action) => {
  console.log('redux formattedForm: ', action.formattedForm);
  return updateObject(state, {
    formattedForm: action.formattedForm,
  });
};







//single contact
const fetchProfileStart = (state, action) => {
  return updateObject(state, { loading: true, activeProfile: null });
};


const fetchProfileSuccess = (state, action) => {
  console.log('fetchProfileSuccess: ', action.data.queryparam);
  return updateObject(state, {
    loading: false,
    activeProfile: action.data.profile,
    urlQuerystringId: action.data.queryparam,
  });
};

// const fetchProfileFail = (state, action) => {
//   return updateObject(state, {
//     state,
//     loading: false,
//     activeProfile: null,
//   });
// };

export default reducer;
