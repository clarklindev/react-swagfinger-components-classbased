import * as actionTypes from './actions';

const initialState = {
	counter: 'some data'
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.UPPERCASE:
			return {};
		default:
			return state;
	}
};

export default reducer;
