// actions
import * as actionTypes from './actionsTypes';

export const addContact = ({ id, name, contact }) => {
	return {
		type: actionTypes.ADD_CONTACT,
		contactData: { id: id, name: name, contact: contact }
	};
};

export const storeContact = contact => {
	return dispatch => {
		//can delay action here...
		//setTImeout(()=>{
		dispatch(addContact(contact));
		//},2000);
	};
};

export const removeContact = id => {
	return { type: actionTypes.REMOVE_CONTACT, contactData: { id: id } };
};

export const updateContact = ({ id, name, contact }) => {
	return {
		type: actionTypes.UPDATE_CONTACT,
		contactData: { id: id, name: name, contact: contact }
	};
};
