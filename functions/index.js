// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

//using google cloud storage
const { Storage } = require('@google-cloud/storage');

const os = require('os');
const path = require('path');

//'spawn' allows us to run tools installed on the server the cloud function runs in
//imageMagic is already preinstalled,
const spawn = require('child-process-promise').spawn;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//storage trigger .onFinalize() for create and rewrite existing
//note: onChange() is deprecated, using .onFinalize()
exports.onFileChange = functions.storage
  .object() //default bucket
  .onFinalize(async (object, context) => {
    const fileBucket = object.bucket;
    const filePath = object.name; //path+name
    const fileName = path.basename(filePath); //get ONLY the file name.

    const contentType = object.contentType;

    if (!contentType.startsWith('image/')) {
      return console.log('This is not an image.');
    }

    //exit if image is already resized, prevent infinite loop
    if (fileName.startsWith('resized-')) {
      console.log('Already resized that file');
      return;
    }

    //putting it back in the same bucket...
    const storage = new Storage();

    const destBucket = storage.bucket(fileBucket);

    //using the temp directory
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
      contentType: contentType
    };

    //bucket, operate on filePath, and download to name of tempFilePath
    await destBucket.file(filePath).download({
      destination: tempFilePath
    });

    // // Generate using ImageMagick.
    //convert() arguments: input filename, function, dimensions, output filename (here we are overriding)
    await spawn('convert', [tempFilePath, '-resize', '500x500', tempFilePath]);

    //changing the filename
    return destBucket.upload(tempFilePath, {
      destination: 'resized-' + fileName,
      metadata: metadata
    });
  });

exports.onFileDelete = functions.storage
  .object()
  .onDelete((object, context) => {
    console.log(object, context);
    return;
  });
