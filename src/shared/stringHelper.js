export const getUniqueClassNameString = (props) => {
  return [...new Set(props)]
    .filter((item) => item !== null && item !== undefined)
    .join(' ');
};
