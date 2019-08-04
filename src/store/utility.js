export const updateObject = (oldObject, updatedValues) => {
	let newObject = { ...oldObject, ...updatedValues };
	console.log('after update: ', newObject);
	return newObject;
};
