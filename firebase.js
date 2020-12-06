import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/app';

const firebaseConfig = {
apiKey: "AIzaSyAb8wuSjDdGBeuxbmpSdPKUHcx_gH0QCxk",
  authDomain: "insta-clone-976b6.firebaseapp.com",
  projectId: "insta-clone-976b6",
  storageBucket: "insta-clone-976b6.appspot.com",
  messagingSenderId: "703862102679",
  appId: "1:703862102679:web:e90eebd097c464522a67d2",
  measurementId: "G-VWPC1LM26F"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth, storage };
