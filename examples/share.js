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
    'apiKey': 'PERMANENT_API_KEY',
});

run();

async function run() {
    await permanent.init();
    console.log('session started');

    const newFolder = await permanent.folder.create(`share test @ ${new Date().toISOString()}`);
    console.log('folder created');

    const folderShareUrl = await permanent.share.createFolderShareLink(
      newFolder,
      false,
      false
    );

    console.log('Folder share link is:');
    console.log(folderShareUrl);
}
