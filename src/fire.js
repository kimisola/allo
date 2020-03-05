/* installation: npm install firebase --save */
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';


var firebaseConfig = {
    apiKey: "AIzaSyCQoWS7vPhhScB6kcPpfLP4W1l45-rQzLg",
    authDomain: "allo-dc54c.firebaseapp.com",
    databaseURL: "https://allo-dc54c.firebaseio.com",
    projectId: "allo-dc54c",
    storageBucket: "allo-dc54c.appspot.com",
    messagingSenderId: "672799510517",
    appId: "1:672799510517:web:1577184a6f9b32e2311abc",
    measurementId: "G-Z7W71Q2L1X",
};

export const googleProvider = new firebase.auth.GoogleAuthProvider();
const fire = firebase.initializeApp(firebaseConfig)
export const db = fire.firestore();

export default fire
