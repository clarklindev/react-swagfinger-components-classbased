const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//storage trigger .onFinalize() for create and rewrite existing
exports.onFileChange = functions.storage
  .object()
  .onFinalize((object, context) => {
    console.log(object, context);
    const bucket = object.bucket;
    const contentType = object.contentType;
    const filePath = object.name;
    console.log('File change detected, function execution started');

    //prevent infinite loop
    if (path.basename(filePath).startsWith('resized')) {
      console.log('Already resized that file');
      return;
    }

    //create a client
    const storage = new Storage();

    const destBucket = storage.bucket(bucket);
    //temporary download to storage... gets cleaned up when function execution completes
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = { contentType: contentType };

    //to download we need to pass destination where to download
    return (
      destBucket
        .file(filePath)
        .download({
          destination: tmpFilePath
        })

        // resize
        .then(() => {
          //spawn
          //keeps aspect ratio, tries fitting existing image into this aspect ratio
          return spawn('convert', [
            tmpFilePath,
            '-resize',
            '500x500',
            tmpFilePath
          ]);
        })

        .then(() => {
          //rename file
          return destBucket.upload(tmpFilePath, {
            destination: 'resized-' + path.basename(filePath),
            metadata: metadata
          });
        })
    );
  });

exports.onFileDelete = functions.storage
  .object()
  .onDelete((object, context) => {
    console.log(object, context);
    return;
  });
