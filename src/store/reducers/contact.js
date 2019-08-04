// reducer
import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../utility';
const initialState = {
	phoneBook: []
};
const addContact = (state, action) => {
	const newContact = {
		id: action.contactData.id,
		name: action.contactData.name,
		contact: action.contactData.contact
	};
	return updateObject(state, {
		phoneBook: [...state.phoneBook, newContact]
	});
};

const updateContact = (state, action) => {
	let updateitemIndex = state.phoneBook.findIndex(
		contact => contact.id === action.contactData.id
	);
	let updateitem = { ...state.phoneBook[updateitemIndex] };
	updateitem.name = action.contactData.name;
	updateitem.contact = action.contactData.contact;

	let contacts = [...state.phoneBook];
	contacts[updateitemIndex] = updateitem;

	return updateObject(state, { phoneBook: contacts });
};

const removeContact = (state, action) => {
	const updatedArray = state.phoneBook.filter(
		contact => contact.id !== action.contactData.id
	);
	return updateObject(state, { phoneBook: updatedArray });
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		//add
		case actionTypes.ADD_CONTACT:
			addContact(state, action);

		//update
		case actionTypes.UPDATE_CONTACT:
			updateContact(state, action);

		//remove
		case actionTypes.REMOVE_CONTACT:
			removeContact(state, action);

		default:
			return state;
	}
};

export default reducer;