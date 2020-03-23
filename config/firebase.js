import firebase from 'firebase'

const firebaseConfig = {
   apiKey: "AIzaSyC58CQAjmLOUpAL91z1pTcDNOypIQaVcrQ",
    authDomain: "insta-clone-5a93c.firebaseapp.com",
    databaseURL: "https://insta-clone-5a93c.firebaseio.com",
    projectId: "insta-clone-5a93c",
    storageBucket: "insta-clone-5a93c.appspot.com",
    messagingSenderId: "959819393478",
    appId: "1:959819393478:web:43bc0b22be95b87ec86ac7"
};

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig)

export const Database = Firebase.database();

export default Firebase;