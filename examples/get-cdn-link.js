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
    const childRecords = privateRoot.ChildItemVOs.filter(
        (item) => permanent.item.isItemARecord(item)
    );
    if (childRecords.length === 0) {
        console.log('No records in My Files.  Upload or move a record to My Files to get a CDN link.');
    } else {
        const randomRecord = randomElement(childRecords);
        console.log('Get the full randomChild record with files');
        const result = await permanent.record.getRecordById(
            randomRecord.recordId
        );
        const cdnLink = result['FileVOs'][0]['fileURL'];
        console.log(cdnLink);
    }

    console.log('Done!');
}
