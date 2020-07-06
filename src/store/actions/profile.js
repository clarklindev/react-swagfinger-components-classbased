// actions
import * as actionTypes from './actionsTypes';
import axios from 'axios';
import axiosInstance from '../../axios-profiles';
const source = axios.CancelToken.source();

//=======================================================
export const processResetId = () => {
  return (dispatch) => {
    dispatch(resetId());
  };
};
export const processFetchProfiles = () => {
  // async constant
  return (dispatch) => {
    dispatch(fetchProfilesStart());
    axiosInstance
      .get('/data/profiles.json', { cancelToken: source.token })
      .then((response) => {
        console.log('RESPONSE', response);

        //this step is so we can add ID to the object
        const fetchedProfiles = [];
        for (let key in response.data) {
          fetchedProfiles.push({ ...response.data[key], id: key });
        }
        console.log('fetched profiles: ', fetchedProfiles);
        dispatch(fetchProfilesSuccess(fetchedProfiles));
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled ', err.message);
        }
        dispatch(fetchProfilesFail(err));
      });
  };
};
export const processFetchProfilesCancel = () => {
  source.cancel('Operation cancelled by the user.');
  console.log('REQUEST CANCELLED!!!');
  return {
    type: actionTypes.FETCH_PROFILES_CANCEL,
  };
};

//single contact
export const processFetchProfile = (queryparam) => {
  return (dispatch) => {
    dispatch(fetchProfileStart());
    axiosInstance
      .get(`/data/profiles/${queryparam}.json`, { cancelToken: source.token })
      .then((response) => {
        console.log('RESPONSE', response);
        dispatch(fetchProfileSuccess({ ...response.data }));
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled ', err.message);
        }
        dispatch(fetchProfileFail(err));
      });
  };
};
//async
export const processProfileDelete = (token, id) => {
  return (dispatch) => {
    axiosInstance
      .delete(`/data/profiles/${id}.json?auth=` + token)
      .then((response) => {
        console.log(response);
        dispatch(profileDelete(id));
      });
  };
};

//async
export const processProfileCreate = (token, profile, callback) => {
  return (dispatch) => {
    axiosInstance
      .post('/data/profiles.json?auth=' + token, profile)
      .then((response) => {
        console.log('response: ', response);
        dispatch(
          profileCreate({
            id: response.data.name,
            ...profile,
          })
        );
        callback();
      })
      .catch((error) => {
        console.log('ERROR:', error);
      });
  };
};

//async
export const processProfileUpdate = (token, profile, id, callback) => {
  console.log('UPDATTTTTTING: ', profile);
  return async (dispatch) => {
    let response = await axiosInstance.put(
      `/data/profiles/${id}.json?auth=` + token,
      profile
    );
    console.log('UPDATTTTTTING THEN...: ', profile, '| id: ', id);
    console.log('response: ', response);
    await dispatch(profileUpdate(profile, id));
    console.log('after dispatch...');
    try {
      console.log('callback...');
      callback();
    } catch (error) {
      console.log('ERROR:', error);
    }
  };
};

export const processFetchProfileSchema = () => {
  console.log('processFetchProfileSchema');
  return async (dispatch) => {
    dispatch(fetchProfileSchemaStart());

    let response = axiosInstance
      .get(`/schemas/collection/profiles.json`, {
        cancelToken: source.token,
      })
      .then((response) => {
        console.log('gets here....');
        dispatch(fetchProfileSchemaSuccess(response));
      });
  };
};

export const processFormatedFormCreated = (formatted) => {
  return async (dispatch) => {
    dispatch(formattedFormCreated(formatted));
  };
};

//receives form oject with value properties that is validated
export const formatDataComplete = (form) => {
  return { type: actionTypes.FORMAT_SCHEMA_WITH_DATA, data: form };
};

//=======================================================
export const resetId = () => {
  return {
    type: actionTypes.RESET_ID,
  };
};
export const profileCreate = (profile) => {
  return {
    type: actionTypes.PROFILE_CREATE,
    profileData: profile,
  };
};

export const profileDelete = (id) => {
  return { type: actionTypes.PROFILE_DELETE, profileData: { id: id } };
};

export const profileUpdate = (profile, id) => {
  // let updateitemIndex = state.phoneBook.findIndex(
  //   (contact) => contact.id === action.profileData.id
  // );
  // let updateitem = { ...state.phoneBook[updateitemIndex] };

  // updateitem.name = action.profileData.name;
  // updateitem.lastname = action.profileData.lastname;
  // updateitem.contactnumbers = action.profileData.contactnumbers;
  // updateitem.emails = action.profileData.emails;

  // let contacts = [...state.phoneBook];
  // contacts[updateitemIndex] = updateitem;
  // console.log('contacts: ', contacts);
  // console.log('state before update: ', state);

  return {
    type: actionTypes.PROFILE_UPDATE,
    profileData: { ...profile, id },
  };
};

//fetch profile schema
export const fetchProfileSchemaStart = () => {
  console.log('fetchProfileSchemaStart');
  return {
    type: actionTypes.FETCH_PROFILE_SCHEMA_START,
  };
};

export const fetchProfileSchemaSuccess = (response) => {
  console.log('fetchProfileSchemaSuccess');
  return {
    type: actionTypes.FETCH_PROFILE_SCHEMA_SUCCESS,
    response: response,
  };
};

export const formattedFormCreated = (formattedForm) => {
  return {
    type: actionTypes.FORMATTED_FORM_CREATED,
    formattedForm: formattedForm,
  };
};

//=======================================================

//fetching contacts

export const fetchProfilesStart = () => {
  return {
    type: actionTypes.FETCH_PROFILES_START,
  };
};

export const fetchProfilesSuccess = (profiles) => {
  return {
    type: actionTypes.FETCH_PROFILES_SUCCESS,
    profiles: profiles,
  };
};

export const fetchProfilesFail = (error) => {
  return {
    type: actionTypes.FETCH_PROFILES_FAIL,
    error: error,
  };
};

//fetching single contact

export const fetchProfileStart = () => {
  console.log('FUNCTION fetchSingleProfileStart');
  return {
    type: actionTypes.FETCH_PROFILE_START,
  };
};

export const fetchProfileSuccess = (profile) => {
  console.log('FUNCTION fetchSingleProfileSuccess');
  return {
    type: actionTypes.FETCH_PROFILE_SUCCESS,
    profileData: profile,
  };
};

export const fetchProfileFail = (error) => {
  return {
    type: actionTypes.FETCH_PROFILE_FAIL,
    error: error,
  };
};
