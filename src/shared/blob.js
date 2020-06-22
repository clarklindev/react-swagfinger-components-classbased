export const getFileBlob = (url) => {
  console.log('url:', url);
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://cors-anywhere.herokuapp.com/${url}`);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      var status = xhr.status;
      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

export default Blob;
