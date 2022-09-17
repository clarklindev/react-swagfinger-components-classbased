// actions
import * as actionTypes from './actionsTypes';
import axios from 'axios';
import axiosInstance from '../../axios-firebase';

const source = axios.CancelToken.source();

export const processResetId = () => {
  return (dispatch) => {
    dispatch(resetId());
  };
};

export const phonebookLoadProfiles = () => {
  console.log('phonebookLoadProfiles');
  // async constant
  return (dispatch) => {
    dispatch(fetchProfilesStart());

    axiosInstance
      .get('/data/profiles.json')
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
        console.log('ERROR: ', err);
        console.log('ERROR MESSAGE: ', err.message);
        dispatch(fetchProfilesFail(err));
      });
  };
};

// export const processFetchProfilesCancel = () => {
//   source.cancel('Operation cancelled by the user.');
//   console.log('REQUEST CANCELLED!!!');
//   return {
//     type: actionTypes.PROFILES_FETCH_CANCEL,
//   };
// };


        export const resetId = () => {
          return {
            type: actionTypes.PROFILE_RESET_ID,
          };
        };

        //fetching contacts
        export const fetchProfilesStart = () => {
          return {
            type: actionTypes.PROFILES_FETCH_START,
          };
        };

        export const fetchProfilesSuccess = (profiles, offlineMode = false) => {
          return {
            type: actionTypes.PROFILES_FETCH_SUCCESS,
            data: { profiles: profiles, offlineMode: offlineMode },
          };
        };

        export const fetchProfilesFail = (error) => {
          console.log('fetchProfilesFail');
          return {
            type: actionTypes.PROFILES_FETCH_FAIL,
            error: error,
          };
        };