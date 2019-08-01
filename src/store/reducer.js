import * as actionTypes from './actions';

const initialState = {
	phoneBook: []
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_CONTACT:
			const newContact = {
				id: action.contactData.id,
				name: action.contactData.name,
				contact: action.contactData.contact
			};
			return {
				...state,
				phoneBook: [...state.phoneBook, newContact]
			};
		case actionTypes.REMOVE_CONTACT:
			return {
				...state,
				phoneBook: state.phoneBook.filter(
					contact => contact.id !== action.contactId
				)
			};

		default:
			return state;
	}
};

export default reducer;
