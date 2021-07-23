// import firebase from "firebase/app";
// import "firebase/firestore";

// const QUE_ID = makeid(7);


// function makeid(length) {
//     var result           = '';
//     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < length; i++ ) {
//       result += characters.charAt(Math.floor(Math.random() * 
//  charactersLength));
//    }
//    return result;
// }

// var firebaseConfig = {
//     apiKey: "AIzaSyAmlYzBkBbB3SGPz3PsdqqXn77fHhixQI8",
//     authDomain: "communalque.firebaseapp.com",
//     projectId: "communalque",
//     storageBucket: "communalque.appspot.com",
//     messagingSenderId: "896023398932",
//     appId: "1:896023398932:web:3082e03ab83264139f7501",
//     measurementId: "G-WKZ0V8Z852"
//   };
//   firebase.initializeApp(firebaseConfig);
//   var db = firebase.firestore();

// const InitializeQue = () => {
//     db.collection(QUE_ID).add({
//     })
//     .then((docRef) => {
//         console.log("Start Que qith ID " + QUE_ID);
//         console.log("Document written with ID: ", docRef.id);
//     })
//     .catch((error) => {
//         console.error("Error adding document: ", error);
//     });
//   return (
//     <>
//     </>
//   );
// };

// export default InitializeQue;