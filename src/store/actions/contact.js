// actions
import * as actionTypes from './actionsTypes';
import axios from '../../axios-contacts';

export const addContact = contact => {
	return {
		type: actionTypes.ADD_CONTACT,
		contactData: contact
	};
};

export const storeContact = contact => {
	return dispatch => {
		axios
			.post('/contacts.json', contact)
			.then(response => {
				console.log('response.data: ', response.data);
				dispatch(
					addContact({
						contact: contact.contact,
						name: contact.name,
						id: response.data.name
					})
				);
			})
			.catch(err => {});
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
				console.log('fetched contacts: ', fetchedContacts);
				dispatch(fetchContactsSuccess(fetchedContacts));
			})
			.catch(err => {
				dispatch(fetchContactsFail(err));
			});
	};
};
