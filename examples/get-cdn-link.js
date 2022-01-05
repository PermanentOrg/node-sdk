// To run this script, use `node get-cdn-link.js`
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
});

run();

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function run() {
    await permanent.init();
    console.log('session started');

    const privateRoot = await permanent.folder.getMyFilesFolder();
    const randomChild = randomElement(privateRoot.ChildItemVOs);

    // doing this specifically for a record
    if (randomChild && randomChild.uploadFileName) {
      console.log("Get the full randomChild record");
      const result = await permanent.record.getRecordById(randomChild.recordId);
      const cdnLink = result['FileVOs'][0]['fileURL'];
      console.log(cdnLink);
    } else {
      console.log("No children or not a record");
    }

    console.log('Done!');
}
