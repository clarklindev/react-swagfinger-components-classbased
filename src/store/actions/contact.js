// actions
import * as actionTypes from './actionsTypes';
import axios from '../../axios-contacts';

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

export const fetchContactsStart = () => {
	return {
		type: actionTypes.FETCH_CONTACTS_START
	};
};

export const fetchContactsSuccess = contacts => {
	return {
		type: actionTypes.FETCH_CONTACTS_SUCCESS,
		contacts: contacts
	};
};

export const fetchContactsFail = error => {
	return {
		type: actionTypes.FETCH_CONTACTS_FAIL,
		error: error
	};
};

// async constant
export const fetchContacts = () => {
	return dispatch => {
		axios
			.get('/contacts.json')
			.then(res => {
				const fetchedContacts = [];
				for (let key in res.data) {
					fetchedContacts.push({ ...res.data[key], id: key });
				}
				dispatch(fetchContactsSuccess(fetchedContacts));
			})
			.catch(err => {
				dispatch(fetchContactsFail(err));
			});
	};
};
