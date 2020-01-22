export const CheckValidity = (value, rules) => {
  let isValid = true;
  let errors = [];

  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value !== '';
    if (isValid === false) {
      errors.push('Input is required');
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
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
    if (isValid === false) {
      errors.push('Invalid email');
    }
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
    if (isValid === false) {
      errors.push('Value must be a numeric value');
    }
  }

  return { isValid: isValid, errors: errors };
};

export default CheckValidity;
