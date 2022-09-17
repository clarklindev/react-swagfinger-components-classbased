// // actions
// import * as actionTypes from './actionsTypes';
// import axiosInstance from '../../axios-firebase';


// //=======================================================

// export const getSchema = (schemapath) => {
//   console.log('FUNCTION getSchema: ', schemapath);
//   return (dispatch) => {
//     dispatch(formFetchStart);
//     axiosInstance
//       .get(schemapath+'.json')
//       .then((response) => {
//         console.log('RESPONSE', response);
//         dispatch(formFetchSuccess(schemapath, response.data));
//       })
//       .catch((err) => {
//         console.log('ERROR: ', err);
//         console.log('ERROR MESSAGE: ', err.message);
//         dispatch(formFetchFail(err));
//       });
//   };
// };

// export const formAddSchema = (schemapath, schemaname) =>{
//   return {
//     type: actionTypes.FORMS_ADD_SCHEMA, data: schemaname, schemapath
//   }
// }

// export const formFetchStart = () => {return { type: actionTypes.FORMS_FETCH_START };};
// export const formFetchSuccess = (schemapath, data) => {return { type: actionTypes.FORMS_FETCH_SUCCESS, schemapath: schemapath, data: data };};
// export const formFetchFail = (error) => {return { type: actionTypes.FORMS_FETCH_FAIL, error: error };};

