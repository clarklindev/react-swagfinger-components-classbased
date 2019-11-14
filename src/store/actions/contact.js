// actions
import * as actionTypes from "./actionsTypes";
import axios from "../../axios-contacts";

export const contactCreate = contact => {
  return {
    type: actionTypes.CONTACT_CREATE,
    contactData: contact
  };
};

//async
export const processContactCreate = contact => {
  return dispatch => {
    axios
      .post("/contacts.json", contact)
      .then(response => {
        dispatch(
          contactCreate({
            id: response.data.name,
            name: contact.name,
            lastname: contact.lastname,
            contactnumbers: contact.contactnumbers,
            emails: contact.emails
          })
        );
      })
      .catch(error => {
        console.log("ERROR");
      });
  };
};

export const contactDelete = id => {
  return { type: actionTypes.CONTACT_DELETE, contactData: { id: id } };
};

//async
export const processContactDelete = id => {
  return dispatch => {
    axios.delete(`/contacts/${id}.json`).then(response => {
      console.log(response);
      dispatch(contactDelete(id));
    });
  };
};

export const contactUpdate = ({
  id,
  name,
  lastname,
  contactnumbers,
  emails
}) => {
  return {
    type: actionTypes.CONTACT_UPDATE,
    contactData: {
      id: id,
      name: name,
      lastname: lastname,
      contactnumbers: contactnumbers,
      emails: emails
    }
  };
};
//async
export const processContactUpdate = contact => {
  return dispatch => {
    axios.put(`/contacts/${contact.id}.json`, contact).then(response => {
      console.log(response);
      dispatch(contactUpdate(contact));
    });
  };
};

//fetching contacts

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
export const fetchContacts = signal => {
  return dispatch => {
    axios
      .get("/contacts.json")
      .then(response => {
        const fetchedContacts = [];
        for (let key in response.data) {
          fetchedContacts.push({ ...response.data[key], id: key });
        }
        console.log("fetched contacts: ", fetchedContacts);
        dispatch(fetchContactsSuccess(fetchedContacts));
      })
      .catch(err => {
        dispatch(fetchContactsFail(err));
      });
  };
};
