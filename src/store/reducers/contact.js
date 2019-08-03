// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../utility';
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
			return updateObject(state, {
				phoneBook: [...state.phoneBook, newContact]
			});

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

			return updateObject(state, { phoneBook: contacts });

		//remove
		case actionTypes.REMOVE_CONTACT:
			const updatedArray = state.phoneBook.filter(
				contact => contact.id !== action.contactData.id
			);
			return updateObject(state, { phoneBook: updatedArray });

		default:
			return state;
	}
};

export default reducer;
