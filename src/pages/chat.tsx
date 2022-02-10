import React, { useRef, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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

firebase.initializeApp(clientCredentials);

const auth: any = firebase.auth();
export const firestore: any = firebase.firestore();

function App() {

  const [user]: any[] = useAuthState(auth);
  function allowEmail(email: string): boolean {
    console.log(email, process.env.NEXT_PUBLIC_ONE, process.env.NEXT_PUBLIC_TWO, email.endsWith(process.env.NEXT_PUBLIC_ONE as string))
    return [process.env.NEXT_PUBLIC_ONE, process.env.NEXT_PUBLIC_TWO, "capitalismdiscordbot@gmail.com"].map((e: any) => email.endsWith(e)).some((ele) => !!ele)
  }
  return (
    <div className="App">
      <header>
        <SignOut />
      </header>

      <section>
        {user ? allowEmail(auth.currentUser.email) ? <ChatRoom /> : <>Sorry, you are not allowed to use the chat. For privacy reasons you need to join the creator&apos;s school.</> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Be polite! If you're reported you can get banned.</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef<any>();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' } as any);

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e: any) => {
    e.preventDefault();

    const { uid, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>Send🕊️</button>

    </form>
  </>)
}


function ChatMessage(props: any) {
  const { text, uid, displayName } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <b>{displayName}</b>
      <p>{text}</p>
    </div>
  </>)
}


export default App;