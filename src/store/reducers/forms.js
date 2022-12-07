// // reducer
// import * as actionTypes from '../actions/actionsTypes';
// import { updateObject } from '../../shared/objectHelper';

// //reducer
// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     //add
//     case actionTypes.FORMS_FETCH_START:
//       return formFetchStart(state, action);
//     case actionTypes.FORMS_FETCH_SUCCESS:
//       return formFetchSuccess(state, action);
//     case actionTypes.FORMS_FETCH_FAIL:
//       return formFetchFail(state, action);
//     case actionTypes.FORMS_ADD_SCHEMA:
//       return formAddSchema(state, action);
//     default:
//       return state;
//   }
// };

// const initialState = {
//   formlist:{},
//   schemaListPath: 'schemas/collection',
//   loading: false,
//   error: null,
// };

// //single contact
// const formFetchStart = a(state, action) => {
//   return updateObject(state, { loading: true });
// };

// const formFetchSuccess = (state, action) => {
//   console.log('formlist: ', {...state.formlist, [action.schemapath]:action.data });
//   return updateObject(state, { loading: false, formlist: {...state.formlist, [action.schemapath]:action.data }});
// };

// const formFetchFail = (state, action) => {
//   return updateObject(state, { loading: false, error: action.error });
// };

// const formAddSchema = (state, action)=>{
//   return updateObject(state, {formlist:{...state.formlist, [action.schemapath]:{...state.formlist[action.schemapath], [action.data]:[]} }})
// }

// export default reducer;
