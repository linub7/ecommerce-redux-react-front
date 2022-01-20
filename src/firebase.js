import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCnYa0XC0Txv5cmR2xosr1XcleLN1ipXb8',
  authDomain: 'ecommerce-5f46c.firebaseapp.com',
  projectId: 'ecommerce-5f46c',
  storageBucket: 'ecommerce-5f46c.appspot.com',
  messagingSenderId: '139904683325',
  appId: '1:139904683325:web:225c64d49c20061ddb8954',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
