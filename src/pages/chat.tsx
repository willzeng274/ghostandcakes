import React, { useEffect, useRef, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Button, Input, Text } from '@chakra-ui/react';

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
  const [allowed, setAllowed] = useState<boolean>(false);
  const [requested, setRequested] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      if (user?.uid) {
        const messagesRef = firestore.collection('messages');
        const now = Date.now();
        const cutoff = now/1000 - 1 * 24 * 60 * 60;
        const old = await messagesRef.orderBy('createdAt').get();
        const deleted = old.docs.map((doc: any) => { return {data: doc.data(), id: doc.id} }).filter((doc: any) => doc.data.createdAt.seconds < cutoff);
        deleted.forEach((item: any) => {
          messagesRef.doc(item.id).delete().then(() => {
          })
        })
      }
    })()
  });
  function allowEmail(email: string): any {
    fetch("/api/email", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    })
      .then((res: Response) => res.json())
      .then((res: {message: boolean}) => {
        setRequested(true);
        setAllowed(res.message);
      });
    return (
      <>
        {
          requested
            ?
              "Sorry, you are not allowed to use the chat. For privacy reasons you need to join the creator's school."
            :
              "Loading..."
        } 
      </>
    )
  }
  return (
    <div className="App">
      <header>
        <SignOut />
      </header>

      <section>
        {user ? allowed ? <ChatRoom /> : allowEmail(user.email) : <SignIn />}
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
      <Button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</Button>
      <Text>Be polite! If you&apos;re reported you can get banned.</Text>
    </>
  )

}

function SignOut() {
  const [clicked, setClicked] = useState<boolean>(false);
  useEffect(() => {
    if (clicked) {
      auth.signOut();
      window.location.href = "/";
    }
  }, [clicked])
  return auth.currentUser && (
    <Button className="sign-out" onClick={() => setClicked(true)}>Sign Out</Button>
  )
}


function ChatRoom() {
  const dummy = useRef<any>();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  React.useEffect((): any => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (formValue.trim().length < 1) {
        return;
    }
    const { uid, displayName } = auth.currentUser;

    await messagesRef.add({
      text: formValue.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  async function deleteMessage(e: any, id: any, uid: any) {
    e.preventDefault();
    if (uid != auth.currentUser.uid) {
      return;
    }
    await messagesRef.doc(id).delete()
  }

  return (<>
    <main style={{height: "85vh", width: "100%", overflowY: "scroll"}}>

      {messages && messages.map((msg: any, index: any) => <ChatMessage key={index} message={msg} delet={deleteMessage} mRef={messagesRef} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <Input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <Button type="submit" disabled={!formValue}>Send🕊️</Button>

    </form>
  </>)
}


function ChatMessage(props: any) {
  const { text, uid, displayName, id }: any = props.message;
  const { delet, mRef: messagesRef } = props;
  const [formValue, setFormValue] = React.useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  
  async function editMessage(e: any, id: any, uid: any) {
    e.preventDefault();
    if (uid != auth.currentUser.uid) {
      return;
    }
    if (formValue.trim().length < 1) {
      return;
    }
    await messagesRef.doc(id).update({
      text: formValue.trim()
    })
    setEditing(false);
    setFormValue("");
  }

  return (
    <div className={`message ${messageClass}`}>
      <b>{displayName}</b>
      {
        editing ?
          <>
            <form onSubmit={(e) => editMessage(e, id, uid)}>
            <Input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
            <Button type="submit" disabled={!formValue}>Edit</Button>
            </form>
          </>
        :
          <p>{text}</p>
      }
      <Button onClick={(e: any) => delet(e, id, uid)} marginRight={1}>Delete</Button>
      <Button onClick={_ => setEditing(true)}>Edit</Button>
    </div>
  )
}

export default App;