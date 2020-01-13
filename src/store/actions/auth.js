import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

//starts with authSuccess
export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000); //*1000 to convert from milliseconds
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};
export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

//async
export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBcmwi6R0CaeY9l1jfEUo0u71MZsVxldKo';
    if (!isSignUp) {
      url =
        // note firebase v3 is diff from v1, v3: /identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBcmwi6R0CaeY9l1jfEUo0u71MZsVxldKo';
    }
    axios
      .post(url, authData)
      .then((response) => {
        console.log('SUCCESS: ', response);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        //start timer for token
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        dispatch(authFail(err.response.data.error));
      });
  };
};
