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
      let record = {};
      // note: this is the size of our example photo
      record.size = 98894;
      const fileType = 'image/jpeg';
      // call getappfolders here, get parentfolder_linkid
      const appFolders = await permanent.folder.getAppFolders();
      const etherpadFolder = await permanent.folder.create(`Etherpad`, appFolders[0]);
      // we expect to get size and type from the client
      // assemble into a recordvo
      record.parentFolder_linkId = etherpadFolder.parentFolder_linkId;
      const testPresigned = await permanent.record.getPresignedUrl(fileType, record);
      // return presigned info to the client so it can post directly to the destination
      // then call registerRecordAndAddStorage
      const archiveId = permanent.getArchiveId();
      record.parentFolderId = etherpadFolder.parentFolderId;
      record.parentFolder_linkId = etherpadFolder.parentFolder_linkId;
      record.displayName = 'puppy';
      record.uploadFileName = imageName;
      record.derivedCreatedDT = '2021-04-08';
      record.archiveId = archiveId;
      permanent.record.registerRecord(record, testPresigned.value.destinationUrl);
      permanent.record.addStorage(record);
      logTime();
      console.log('all success!');
  } catch (err) {
      console.dir(err);
      logTime();
      console.error('failure :(');
  }
}
