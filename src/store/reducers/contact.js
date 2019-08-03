// reducer
import * as actionTypes from '../actions/actionsTypes';

const initialState = {
	phoneBook: []
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		//add
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
		//update
		case actionTypes.UPDATE_CONTACT:
			let updateitemIndex = state.phoneBook.findIndex(
				contact => contact.id === action.contactData.id
			);
			let updateitem = { ...state.phoneBook[updateitemIndex] };
			updateitem.name = action.contactData.name;
			updateitem.contact = action.contactData.contact;

			let contacts = [...state.phoneBook];
			contacts[updateitemIndex] = updateitem;

			return {
				...state,
				phoneBook: contacts
			};
		//remove
		case actionTypes.REMOVE_CONTACT:
			return {
				...state,
				phoneBook: state.phoneBook.filter(
					contact => contact.id !== action.contactData.id
				)
			};

		default:
			return state;
	}
};

export default reducer;
