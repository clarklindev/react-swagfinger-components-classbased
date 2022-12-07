export const checkValidity = (value, rules) => {
  let isValid = true;
  let errors = [];

  if (!rules) {
    console.log('NO RULES???');
    return true;
  }

  if (rules.isRequired) {
    isValid = value !== '';
    //console.log('VALUE: ', value);
    if (typeof value === 'object') {
      //console.log('Value is an object');
      let testEmptyValues = Object.keys(value).some((item) => {
        return (
          value[item] === null ||
          value[item] === undefined ||
          value[item] === '' ||
          (value[item] !== null && value[item].trim() === '')
        );
      });
      if (testEmptyValues === true) {
        console.log('Object has empty values!!!');
        isValid = false;
      }
    }
    if (isValid === false) {
      errors.push('Input is required');
    }
  }

  if (rules.isDate) {
    let date = new Date(value);
    isValid = date !== 'Invalid Date' && !isNaN(date) && value !== null;
    console.log('Date is valid: ', isValid);
    if (isValid === false) {
      errors.push('Date is not valid');
    }
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    if (isValid === false) {
      errors.push(`Input requires a minimum length of ${rules.minLength}`);
    }
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
    if (isValid === false) {
      errors.push(`Input should have a maximum length of ${rules.maxLength}`);
    }
  }

  if (rules.isEmail) {
    const pattern =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
    if (isValid === false) {
      errors.push('Invalid email');
    }
  }

  if (rules.isNumber) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
    if (isValid === false) {
      errors.push('Value must be a numeric value');
    }
  }

  if (rules.isPhoneNumber) {
    const pattern =
      /(^\d{3}?[ |-|.]*?[0-9]{3}[ |-|.]*?[0-9]{4}$)|^\(\d{3}\)[ |-|.]*?(\d{3})[ |-|.]*?\d{4}|(^\(?\+?\d{2}\)?)[ |.|-]*?(\d{2})[ |.|-]*?(\d{3})[ |.|-]*?(\d{4})$/;
    isValid = pattern.test(value) && isValid;
    if (isValid === false) {
      errors.push('Value must be a valid contact number');
    }
  }

  return { isValid: isValid, errors: errors };
};

export default checkValidity;
