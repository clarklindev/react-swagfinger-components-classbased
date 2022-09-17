// actions
import * as actionTypes from './actionsTypes';
import axios from 'axios';
import axiosInstance from '../../axios-firebase';

const source = axios.CancelToken.source();

//=======================================================



// export const tryOfflineMode = () => {
//   console.log('tryOfflineMode');
//   return (dispatch) => {
//     //   axios
//     //     .get('http://localhost:3000/data.json')
//     //     .then((response) => {
//     //       console.log('json: ', response.data);
//     //       console.log('here...');
//     //       let login = response.data.data.schemas.collection.login;
//     //       let offlineprofiles = response.data.data.profiles;
//     //       //this step is so we can add ID to the object
//     //       const fetchedProfiles = [];
//     //       for (let key in offlineprofiles) {
//     //         fetchedProfiles.push({ ...offlineprofiles[key], id: key });
//     //       }
//     //       console.log('offline fetched profiles: ', fetchedProfiles);
//     //       dispatch(fetchProfilesSuccess(fetchedProfiles, true));
//     //     })
//     //     .catch((err) => {});
//   };
// };


//single profile

export const processFetchProfile = (queryparam) => {
  return (dispatch) => {
    dispatch(fetchProfileStart());
    axiosInstance
      .get(`/data/profiles/${queryparam}.json`, { cancelToken: source.token })
      .then((response) => {
        console.log('RESPONSE', response);
        dispatch(fetchProfileSuccess(queryparam, { ...response.data }));
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

    axiosInstance
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
  return { type: actionTypes.PROFILE_FORMAT_SCHEMA_WITH_DATA, data: form };
};

//=======================================================


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
    type: actionTypes.PROFILE_FETCH_SCHEMA_START,
  };
};

export const fetchProfileSchemaSuccess = (response) => {
  console.log('fetchProfileSchemaSuccess');
  return {
    type: actionTypes.PROFILE_FETCH_SCHEMA_SUCCESS,
    response: response,
  };
};

export const formattedFormCreated = (formattedForm) => {
  return {
    type: actionTypes.PROFILE_FORMATTED_FORM_CREATED,
    formattedForm: formattedForm,
  };
};

//=======================================================



//fetching single contact

export const fetchProfileStart = () => {
  console.log('FUNCTION fetchSingleProfileStart');
  return {
    type: actionTypes.PROFILE_FETCH_START,
  };
};

export const fetchProfileSuccess = (queryparam, profile) => {
  console.log('FUNCTION fetchSingleProfileSuccess');
  return {
    type: actionTypes.PROFILE_FETCH_SUCCESS,
    data: { profile: profile, queryparam: queryparam },
  };
};

export const fetchProfileFail = (error) => {
  return {
    type: actionTypes.PROFILE_FETCH_FAIL,
    error: error,
  };
};


