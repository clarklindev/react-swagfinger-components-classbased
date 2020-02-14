// actions
import * as actionTypes from './actionsTypes';
import axios from 'axios';
import axiosInstance from '../../axios-contacts';
const source = axios.CancelToken.source();

export const contactCreate = (contact) => {
  return {
    type: actionTypes.CONTACT_CREATE,
    contactData: contact
  };
};

//async
export const processContactCreate = (token, contact, callback) => {
  return (dispatch) => {
    axiosInstance
      .post('/contacts.json?auth=' + token, contact)
      .then((response) => {
        console.log('response: ', response);
        dispatch(
          contactCreate({
            id: response.data.name,
            ...contact
          })
        );
        callback();
      })
      .catch((error) => {
        console.log('ERROR:', error);
      });
  };
};

export const contactDelete = (id) => {
  return { type: actionTypes.CONTACT_DELETE, contactData: { id: id } };
};

//async
export const processContactDelete = (token, id) => {
  return (dispatch) => {
    axiosInstance
      .delete(`/contacts/${id}.json?auth=` + token)
      .then((response) => {
        console.log(response);
        dispatch(contactDelete(id));
      });
  };
};

export const contactUpdate = (contact, id) => {
  return {
    type: actionTypes.CONTACT_UPDATE,
    contactData: { ...contact }
  };
};
//async
export const processContactUpdate = (token, contact, id, callback) => {
  console.log('UPDATTTTTTING: ', contact);
  return (dispatch) => {
    axiosInstance
      .put(`/contacts/${id}.json?auth=` + token, contact)
      .then((response) => {
        console.log('UPDATTTTTTING THEN...: ', contact);
        console.log(response);
        dispatch(contactUpdate(contact, id));
        callback();
      })
      .catch((error) => {
        console.log('ERROR:', error);
      });
  };
};

//fetching contacts

export const fetchContactsStart = () => {
  return {
    type: actionTypes.FETCH_CONTACTS_START
  };
};

export const fetchContactsSuccess = (contacts) => {
  return {
    type: actionTypes.FETCH_CONTACTS_SUCCESS,
    contacts: contacts
  };
};

export const fetchContactsFail = (error) => {
  return {
    type: actionTypes.FETCH_CONTACTS_FAIL,
    error: error
  };
};

export const fetchContactsCancel = () => {
  source.cancel('Operation cancelled by the user.');
  console.log('REQUEST CANCELLED!!!');
  return {
    type: actionTypes.FETCH_CONTACTS_CANCEL
  };
};

// async constant
export const processFetchContacts = () => {
  return (dispatch) => {
    dispatch(fetchContactsStart());
    axiosInstance
      .get('/contacts.json', { cancelToken: source.token })
      .then((response) => {
        console.log('RESPONSE', response);

        //this step is so we can add ID to the object
        const fetchedContacts = [];
        for (let key in response.data) {
          fetchedContacts.push({ ...response.data[key], id: key });
        }
        console.log('fetched contacts: ', fetchedContacts);
        dispatch(fetchContactsSuccess(fetchedContacts));
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled ', err.message);
        }
        dispatch(fetchContactsFail(err));
      });
  };
};
//=======================================================
//fetching single contact

export const fetchSingleContactStart = () => {
  return {
    type: actionTypes.FETCH_SINGLECONTACT_START
  };
};

export const fetchSingleContactSuccess = (contact) => {
  return {
    type: actionTypes.FETCH_SINGLECONTACT_SUCCESS,
    contactData: contact
  };
};

export const fetchSingleContactFail = (error) => {
  return {
    type: actionTypes.FETCH_SINGLECONTACT_FAIL,
    error: error
  };
};

// async constant
export const processFetchSingleContact = (id) => {
  return (dispatch) => {
    dispatch(fetchSingleContactStart());
    axiosInstance
      .get(`/contacts/${id}.json`, { cancelToken: source.token })
      .then((response) => {
        console.log('RESPONSE', response);
        //add id
        dispatch(fetchSingleContactSuccess({ ...response.data, id: id }));
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled ', err.message);
        }
        dispatch(fetchSingleContactFail(err));
      });
  };
};
