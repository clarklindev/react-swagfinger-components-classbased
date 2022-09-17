// actions
import * as actionTypes from './actionsTypes';
import axios from 'axios';
import axiosInstance from '../../axios-firebase';

const source = axios.CancelToken.source();

//=======================================================

//ProfileCreateOrUpdate
export const processFetchProfileSchema = () => {
  console.log('actions->profile->processFetchProfileSchema()');
  return async (dispatch) => {
    dispatch(fetchProfileSchemaStart());//sets state in reducer profile->loading to true
    axiosInstance
      .get(`/schemas/collection/profiles.json`, {
        cancelToken: source.token,
      })
      .then((response) => {
        console.log('GET: /schemas/collection/profiles.json | RESPONSE', response);
        dispatch(fetchProfileSchemaSuccess(response));//sets state in reducer profile->loading, schema[]
      });
  };
};
        //fetch profile schema
        const fetchProfileSchemaStart = () => {
          console.log('actions->profile->fetchProfileSchemaStart()');
          return {
            type: actionTypes.PROFILE_FETCH_SCHEMA_START,
          };
        };

        const fetchProfileSchemaSuccess = (response) => {
          console.log('actions->profile->fetchProfileSchemaSuccess()');
          return {
            type: actionTypes.PROFILE_FETCH_SCHEMA_SUCCESS,
            response: response,
          };
        };

// --------------------------------------------------

export const processFormatedFormCreated = (formattedFormObject) => {
  console.log('actions->profile->processFormatedFormCreated()');

  return async (dispatch) => {
    dispatch(formattedFormCreated(formattedFormObject));
  };
};

        const formattedFormCreated = (formattedFormObject) => {
          console.log('actions->profile->formattedFormCreated()');
          return {
            type: actionTypes.PROFILE_FORMATTED_FORM_CREATED,
            formattedFormObject: formattedFormObject
          };
        };

// --------------------------------------------------

export const processFetchProfile = (queryparam) => {
  console.log('actions->profile->processFetchProfile()');
  console.log('queryparam: ', queryparam);
  
  return (dispatch) => {
    dispatch(fetchProfileStart());
    axiosInstance
      .get(`/data/profiles/${queryparam}.json`, { cancelToken: source.token })
      .then((response) => {
        console.log('GET /data/profiles/${queryparam}.json | RESPONSE', response);
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

        //fetching single contact
        const fetchProfileStart = () => {
          console.log('actions->profile->fetchProfileStart()');
          return {
            type: actionTypes.PROFILE_FETCH_START,
          };
        };

        const fetchProfileSuccess = (queryparam, activeProfile) => {
          console.log('actions->profile->fetchProfileSuccess()');
          return {
            type: actionTypes.PROFILE_FETCH_SUCCESS,
            data: { activeProfile: activeProfile, queryparam: queryparam },
          };
        };
        

// --------------------------------------------------

//receives form oject with value properties that is validated
export const formatDataComplete = (form) => {
  return { type: actionTypes.PROFILE_FORMAT_SCHEMA_WITH_DATA, data: form };
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














//=======================================================




export const fetchProfileFail = (error) => {
  return {
    type: actionTypes.PROFILE_FETCH_FAIL,
    error: error,
  };
};



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
