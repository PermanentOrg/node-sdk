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
});

const token = 'YOUR_TOKEN_HERE';

run();

async function run() {

  await permanent.init();
  console.log('session valid!');

  try {
      let record = {};
      /*
      I have been getting the record from web-app for testing
      purposes.  Using the exact data given below will fail, because
      the record won't exist in AWS.  To get your own version of
      this, alter your local version of web-app so that it never
      completes the upload process and shows some information in
      the console.
          --- a/src/app/core/services/upload/uploader.ts
          +++ b/src/app/core/services/upload/uploader.ts
          @@ -55,6 +55,7 @@ export class Uploader {
              emitUploadProgress: (e: HttpEvent<any>) => void,
          ) => {
              const { destinationUrl, presignedPost } = await this.getUploadData(item);
                  +    console.log(destinationUrl);

              await this.httpClient.post(
                  presignedPost.url,
                  @@ -67,7 +68,9 @@ export class Uploader {
                  },
              ).forEach(emitUploadProgress);

                  -    return this.registerRecord(item, destinationUrl);
                  +    console.log("DEBUG: This is the item to use for the RecordVO");
                  +    console.log(item);
                  +    //return this.registerRecord(item, destinationUrl);
          };

      Then upload a document with dev tools open and grab the record
      and destination url from the console.
      */


      record = {
          "cleanParams": [
              "recordId",
              "archiveNbr",
              "folder_linkId",
              "parentFolder_linkId",
              "parentFolderId",
              "uploadFileName"
          ],
          "parentFolderId": 3,
          "parentFolder_linkId": 3,
          "displayName": "20190328_M15_Gaia_stars.gif",
          "uploadFileName": "20190328_M15_Gaia_stars.gif",
          "size": 4102311,
          "derivedCreatedDT": "2020-04-10T19:46:46.000Z",
          "isRecord": true,
          "isFolder": false,
          "isFetching": false,
          "isPendingAction": false,
          "isNewlyCreated": false,
          "dataStatus": 0
      };
      // Also have been pulling this out of web-app for testing.
      const dest_url = 'https://[BUCKET].s3.amazonaws.com/[FOLDER]/unprocessed/[KEY]';
      //
      permanent.record.registerRecordAndAddStorage(record, dest_url, token);
      console.log('all success!');
  } catch (err) {
      console.dir(err);
      console.error('failure :(');
  }
}
