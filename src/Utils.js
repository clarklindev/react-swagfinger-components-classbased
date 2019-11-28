class Utils {
  static getClassNameString = (props) => {
    return [...new Set(props)]
      .filter((item) => item !== null && item !== undefined)
      .join(' ');
  };
}
export default Utils;
