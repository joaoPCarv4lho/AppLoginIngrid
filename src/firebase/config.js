import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDVCORhysOucvuH-7CRXd6ekv1IaP_M1RY",
  authDomain: "apploginingrid-a30eb.firebaseapp.com",
  databaseURL: "https://apploginingrid-a30eb-default-rtdb.firebaseio.com",
  projectId: "apploginingrid-a30eb",
  storageBucket: "apploginingrid-a30eb.appspot.com",
  messagingSenderId: "222655414718",
  appId: "1:222655414718:web:52d60eec4fe4027a1279ef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const firestore = getFirestore(app);
enableIndexedDbPersistence(firestore)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.error('The current browser does not support all of the features required to enable persistence');
    }
  });

export { app, auth, firestore };
