import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_AUTH_DOMAIN,FIREBASE_PROJECT_ID } from "@env";

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  appId: FIREBASE_APP_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID
};

if (getApps().length === 0) {
  const app = initializeApp(firebaseConfig);
}

const fbApp = getApp();
const fbStorage = getStorage()

const listFiles = async () => {

// Create a reference under which you want to list
const listRef = ref(getStorage(), 'images');

// Find all the prefixes and items.
const listResponse = await listAll(listRef);
return listResponse.items

}
/**
 * 
 * @param {*} uri 
 * @param {*} name 
 */

const uploadToFirebase = async (uri, name, onProgress) => {

  const fetchResponse = await fetch(uri)
  const theBlob = await fetchResponse.blob();

  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpg'
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const imageRef = ref(getStorage(), `images/${name}`);
  const uploadTask = uploadBytesResumable(imageRef, theBlob, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata
        })
      }
    );
  });
};


export {
  fbApp,
  fbStorage,
  uploadToFirebase,
  listFiles
}
