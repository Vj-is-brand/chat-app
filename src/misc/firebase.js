import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyDqsBDeyPyX4CNiWhmOo4wEOjshCONiI5w",
    authDomain: "chat-web-app-d3b7a.firebaseapp.com",
    databaseURL: "https://chat-web-app-d3b7a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-web-app-d3b7a",
    storageBucket: "chat-web-app-d3b7a.appspot.com",
    messagingSenderId: "873416998411",
    appId: "1:873416998411:web:085449eaa5374fe33b910e"
  };
  
  const app = firebase.initializeApp(config);
  export const auth = app.auth();
  export const database = app.database();
  
  