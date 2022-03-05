import React, { useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import ChatRoom from '../components/room';
import { useAppDispatch } from '../reducers/settings';
import { setToken } from '../reducers/token';

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_DATABASEURL
};

initializeApp(clientCredentials);
const provider = new GoogleAuthProvider();
export const auth = getAuth();

export default function Component() {
  const dispatch = useAppDispatch();
  function getSignIn() {
    signInWithPopup(auth, provider)
      .then((result: any) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        if (credential?.idToken) {
          localStorage.setItem("idToken", credential?.idToken);
        }
        dispatch(setToken(token));
      }).catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;
    const credential = GoogleAuthProvider.credential(idToken);
    signInWithCredential(auth, credential)
      .then((result: any) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        if (credential?.idToken) {
          localStorage.setItem("idToken", credential?.idToken);
        }
        dispatch(setToken(token));
      }).catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }, []);
  return (
    <>
      {
        auth.currentUser ? (
          <ChatRoom />
        ) : (
          <Button onClick={getSignIn}>Sign In</Button>
        )
      }
    </>
  )
}