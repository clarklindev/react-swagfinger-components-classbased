import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  components: null,

  loading: false,
  error: null,
};

const fetchComponentsStart = (state, action) => {
  console.log('REDUCER fetchComponentsStart');
  return updateObject(state, {
    loading: true,
  });
};

const fetchComponentsSuccess = (state, action) => {
  return updateObject(state, {
    components: action.data,
    loading: false,
  });
};

const fetchComponentsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_COMPONENTS_START:
      return fetchComponentsStart(state, action);

    case actionTypes.FETCH_COMPONENTS_SUCCESS:
      return fetchComponentsSuccess(state, action);

    case actionTypes.FETCH_COMPONENTS_FAIL:
      return fetchComponentsFail(state, action);
    default:
      return state;
  }
};

export default reducer;
