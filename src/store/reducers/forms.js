// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  phoneBook: [], //stores firebase data/profiles/id with an id prop
  loading: false,
  schema: [],

  urlQuerystringId: null,
  activeProfile: null, //the actual object with all the props of the form
  formattedForm: null, //without data
  formattedFormWithData: null,
  error: null,
};

const resetId = (state, action) => {
  return updateObject(state, {
    urlQuerystringId: null,
    activeProfile: null,
    formattedForm: null,
    formattedFormWithData: null,
  });
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

//contacts
const fetchProfilesStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchProfilesFail = (state, action) => {
  return updateObject(state, { loading: false, error: action.error });
};

const fetchProfilesSuccess = (state, action) => {
  return updateObject(state, {
    phoneBook: action.data.profiles,
    loading: false,
  });
};

const fetchProfilesCancel = (state, action) => {
  return state;
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

const fetchProfileFail = (state, action) => {
  return updateObject(state, {
    state,
    loading: false,
    activeProfile: null,
  });
};

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    //add
    case actionTypes.PROFILE_CREATE:
      return addProfile(state, action);
    //update
    case actionTypes.PROFILE_UPDATE:
      return updateProfile(state, action);
    //remove
    case actionTypes.PROFILE_DELETE:
      return removeProfile(state, action);

    //schema
    case actionTypes.FETCH_PROFILE_SCHEMA_START:
      return fetchProfileSchemaStart(state, action);

    case actionTypes.FETCH_PROFILE_SCHEMA_SUCCESS:
      return fetchProfileSchemaSuccess(state, action);

    case actionTypes.FORMAT_SCHEMA_WITH_DATA:
      return formatSchemaWithData(state, action);

    case actionTypes.FORMATTED_FORM_CREATED:
      return formattedFormCreated(state, action);

    case actionTypes.RESET_ID:
      return resetId(state, action);
    //CONTACTS
    case actionTypes.FETCH_PROFILES_START:
      return fetchProfilesStart(state, action);

    case actionTypes.FETCH_PROFILES_SUCCESS:
      return fetchProfilesSuccess(state, action);

    case actionTypes.FETCH_PROFILES_FAIL:
      return fetchProfilesFail(state, action);

    case actionTypes.FETCH_PROFILES_CANCEL:
      return fetchProfilesCancel(state, action);

    //SINGLE CONTACT
    case actionTypes.FETCH_PROFILE_START:
      return fetchProfileStart(state, action);

    case actionTypes.FETCH_PROFILE_SUCCESS:
      return fetchProfileSuccess(state, action);

    case actionTypes.FETCH_PROFILE_FAIL:
      return fetchProfileFail(state, action);

    default:
      return state;
  }
};

export default reducer;
