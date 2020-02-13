// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  phoneBook: [],
  activeContact: null,
  loading: false
};
const addContact = (state, action) => {
  console.log('CONTACT ADDED');
  return updateObject(state, {
    phoneBook: state.phoneBook.concat(action.contactData)
  });
};

const updateContact = (state, action) => {
  let updateitemIndex = state.phoneBook.findIndex(
    (contact) => contact.id === action.contactData.id
  );
  let updateitem = { ...state.phoneBook[updateitemIndex] };

  updateitem.name = action.contactData.name;
  updateitem.lastname = action.contactData.lastname;
  updateitem.contactnumbers = action.contactData.contactnumbers;
  updateitem.emails = action.contactData.emails;

  let contacts = [...state.phoneBook];
  contacts[updateitemIndex] = updateitem;
  console.log('contacts: ', contacts);
  console.log('state before update: ', state);
  return updateObject(state, { phoneBook: contacts });
};

const removeContact = (state, action) => {
  const updatedArray = state.phoneBook.filter(
    (contact) => contact.id !== action.contactData.id
  );
  console.log('contactDELETE updated array: ', updatedArray);
  console.log('state before remove: ', state);
  return updateObject(state, { phoneBook: updatedArray });
};

//contacts
const fetchContactsStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const fetchContactsFail = (state, action) => {
  return updateObject(state, { loading: false });
};

const fetchContactsSuccess = (state, action) => {
  return updateObject(state, { phoneBook: action.contacts, loading: false });
};

const fetchContactsCancel = (state, action) => {
  return state;
};

//single contact
const fetchSingleContactStart = (state, action) => {
  return updateObject(state, { loading: true, activeContact: null });
};

const fetchSingleContactSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    activeContact: action.contactData
  });
};

const fetchSingleContactFail = (state, action) => {
  return updateObject(state, {
    state,
    loading: false,
    activeContact: null
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    //add
    case actionTypes.CONTACT_CREATE:
      return addContact(state, action);
    //update
    case actionTypes.CONTACT_UPDATE:
      return updateContact(state, action);
    //remove
    case actionTypes.CONTACT_DELETE:
      return removeContact(state, action);

    //CONTACTS
    case actionTypes.FETCH_CONTACTS_START:
      return fetchContactsStart(state, action);

    case actionTypes.FETCH_CONTACTS_FAIL:
      return fetchContactsFail(state, action);

    case actionTypes.FETCH_CONTACTS_SUCCESS:
      return fetchContactsSuccess(state, action);

    case actionTypes.FETCH_CONTACTS_CANCEL:
      return fetchContactsCancel(state, action);

    //SINGLE CONTACT
    case actionTypes.FETCH_SINGLECONTACT_START:
      return fetchSingleContactStart(state, action);

    case actionTypes.FETCH_SINGLECONTACT_SUCCESS:
      return fetchSingleContactSuccess(state, action);

    case actionTypes.FETCH_SINGLECONTACT_FAIL:
      return fetchSingleContactFail(state, action);
    default:
      return state;
  }
};

export default reducer;
