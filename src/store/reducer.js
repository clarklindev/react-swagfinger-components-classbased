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
