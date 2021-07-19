import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const firebaseApp =
  firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase
//console.log('TESTES->', process.env.TEST);
export const auth = firebase.auth()
export const db = firebaseApp.firestore()
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp

export type firebaseTimeStamp = firebase.firestore.Timestamp
