// To run this script, use `node copy-publish.js`
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

    const privateRoot = await permanent.folder.getMyFilesFolder();
    const publicRoot = await permanent.folder.getPublicFolder();
    const randomChild = randomElement(privateRoot.ChildItemVOs);

    if (randomChild) {
      console.log(`Copying "${randomChild.displayName}" to Public...`);
      const result = await permanent.item.copy(randomChild, publicRoot);
    }

    console.log('Done!');
}
