import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyAmlYzBkBbB3SGPz3PsdqqXn77fHhixQI8",
    authDomain: "communalque.firebaseapp.com",
    projectId: "communalque",
    storageBucket: "communalque.appspot.com",
    messagingSenderId: "896023398932",
    appId: "1:896023398932:web:3082e03ab83264139f7501",
    measurementId: "G-WKZ0V8Z852"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

const InitializeQue = () => {
    db.collection("users").add({
        first: "Alan",
        middle: "Mathison",
        last: "Turing",
        born: 1912
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  return (
    <>
    </>
  );
};

export default InitializeQue;