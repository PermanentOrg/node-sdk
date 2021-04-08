// To run this script, do `node upload.js`
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

const imageUrl = 'https://live.staticflickr.com/4360/23503731148_915435b305_b.jpg';
const imageName = 'puppy.jpg';

run();

async function run() {
  const attempts = 1;

  await permanent.init();
  console.log('session valid!');

  const start = new Date();
  const folderForSet = await permanent.folder.create(`simultaneous test @ ${new Date().toISOString()}`);

  console.log('folder created');

  const logTime = () => {
    const end = new Date();
    const seconds = (end.getTime() - start.getTime()) / 1000;
    console.log(`Time elapsed: ${seconds} seconds`);
  }

  try {
    const record = await permanent.record.uploadFromUrl({displayName: 'image', uploadUri: imageUrl, uploadFileName: imageName}, folderForSet);
    record.size = 98894;
    const testPresigned = await permanent.record.getPresignedUrl('image/jpeg', record);
    permanent.record.addStorage(record);
    logTime();
    console.log('all success!');
  } catch (err) {
    console.dir(err);
    logTime();
    console.error('failure :(');
  }
}
