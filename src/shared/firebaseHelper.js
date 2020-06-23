export const urlFromRef = async (ref) => {
  return new Promise(function (resolve, reject) {
    ref.getDownloadURL().then((url) => {
      resolve(url);
    });
  });
};
