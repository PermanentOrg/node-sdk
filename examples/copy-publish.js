// To run this script, use `node share.js`
//
// Uncomment this line to run on an insecure local environment, if you
// like:
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const permSdk = require('@permanentorg/node-sdk');

// You can pull the "permSession" and "permMFA" cookie values from
// devtools on any request.  Include
//
// 'baseUrl': 'https://local.permanent.org/api'
//
// or similar if you want to run this locally or on another
// environment (by default it will run against prod)

const permanent = new permSdk.Permanent({
    'sessionToken': 'permSession_COOKIE',
    'mfaToken': 'permMFA_COOKIE',
    'archiveNbr': 'YOUR_ARCHIVE',
});

run();

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function run() {
    await permanent.init();
    console.log('session started');

    // I want to copy a random item from "My Files" to "Public"
    // In other words, we're publishing a random file from "My Files"!
    const root = await permanent.folder.getMyFilesFolder();
    const public = await permanent.folder.getPublicFolder();
    const randomChild = randomElement(root.ChildItemVOs);

    console.log(`Copying "${randomChild.displayName}" to Public...`);

    /*
    You must call the proper API endpoint to copy a folder vs a record.
    Right now when you're handed an arbitrary list of ItemVOs like we are doing
    here, you have to manually check whether an Item is a folder or record.

    Hopefully, in the future, this will be smoothed out a bit more.
    */
    let result;
    if (randomChild.type.includes('folder')) {
      // The API takes an array of items to copy in case you want to copy multiple
      result = await permanent.folder.copy([randomChild], public);
    } else {
      result = await permanent.record.copy([randomChild], public);
    }

    console.log('Done!');
}
