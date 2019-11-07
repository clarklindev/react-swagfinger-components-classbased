// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../utility';
const initialState = {
  phoneBook: [],
  loading: false
};
const addContact = (state, action) => {
  return updateObject(state, {
    phoneBook: state.phoneBook.concat(action.contactData)
  });
};

const updateContact = (state, action) => {
  let updateitemIndex = state.phoneBook.findIndex(
    contact => contact.id === action.contactData.id
  );
  let updateitem = { ...state.phoneBook[updateitemIndex] };
  updateitem.name = action.contactData.name;
  updateitem.lastname = action.contactData.lastname;
  updateitem.contact = action.contactData.contact;

  let contacts = [...state.phoneBook];
  contacts[updateitemIndex] = updateitem;
  console.log('contacts: ', contacts);
  console.log('state before update: ', state);
  return updateObject(state, { phoneBook: contacts });
};

const removeContact = (state, action) => {
  const updatedArray = state.phoneBook.filter(
    contact => contact.id !== action.contactData.id
  );
  console.log('contactDELETE updated array: ', updatedArray);
  console.log('state before remove: ', state);
  return updateObject(state, { phoneBook: updatedArray });
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

    //start
    case actionTypes.FETCH_CONTACTS_START:
      return {
        ...state,
        loading: true
      };

    case actionTypes.FETCH_CONTACTS_FAIL:
      return {
        ...state,
        loading: false
      };

    case actionTypes.FETCH_CONTACTS_SUCCESS:
      return {
        ...state,
        phoneBook: action.contacts,
        loading: false
      };
    default:
      return state;
  }
};

export default reducer;
