import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  hideToolbar: false,
};

const shouldHideToolbar = (state, action) => {
  return updateObject(state, { hideToolbar: action.show });
};

//reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_TOOLBAR:
      return shouldHideToolbar(state, action);
    default:
      return state;
  }
};

export default reducer;
