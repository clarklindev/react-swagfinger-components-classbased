// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const fs = require('fs');
//using google cloud storage
//const { Storage } = require('@google-cloud/storage');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//storage trigger .onFinalize() for create and rewrite existing
//note: onChange is deprecated, using .onFinalize()
exports.onFileChange = functions.storage
  .object()
  .onFinalize(async (object, context) => {
    const fileBucket = object.bucket;
    const filePath = object.name;
    const contentType = object.contentType;

    if (!contentType.startsWith('image/')) {
      return console.log('This is not an image.');
    }

    //get the file name.
    const fileName = path.basename(filePath);

    //exit if image is already resized, prevent infinite loop
    if (fileName.startsWith('renamed-')) {
      console.log('Already resized that file');
      return;
    }

    // Download file from bucket.
    console.log('File change detected, function execution started');
    const bucket = admin.storage().bucket(fileBucket);
    //temporary download to storage... gets cleaned up when function execution completes
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
      contentType: contentType
    };

    await bucket.file(filePath).download({ destination: tempFilePath });
    console.log('Image downloaded locally to: ', tempFilePath);

    // Generate a thumbnail using ImageMagick.
    await spawn('convert', [tempFilePath, '-resize', '500x500', tempFilePath]);
    console.log('Image resized to', tempFilePath);

    // We add a 'renamed-' prefix to file name. That's where we'll upload the renamed file.
    const renamedFileName = `renamed-${fileName}`;
    const renamedFilePath = path.join(
      path.dirname(tempFilePath),
      renamedFileName
    );

    //upload the resized/renamed file
    await bucket.upload(tempFilePath, {
      destination: renamedFilePath,
      metadata: metadata
    });

    // Once the file has been uploaded, delete the local file to free up disk space.
    return fs.unlinkSync(tempFilePath);
  });

exports.onFileDelete = functions.storage
  .object()
  .onDelete((object, context) => {
    console.log(object, context);
    return;
  });
