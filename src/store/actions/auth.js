import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};
export const authSuccess = authData => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		authData: authData
	};
};

export const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

//async
export const auth = (email, password, isSignUp) => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};

		let url =
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAJzYSyjWZ0D45Prfs_8h1BjuL_PWh_bOY';
		if (!isSignUp) {
			url =
				// note firebase v3 is diff from v1, v3: /identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAJzYSyjWZ0D45Prfs_8h1BjuL_PWh_bOY';
		}
		axios
			.post(url, authData)
			.then(response => {
				console.log(response);
				dispatch(authSuccess(response.data));
			})
			.catch(err => {
				console.log(err);
				dispatch(authFail(err));
			});
	};
};
