import MessageInput from "./input";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Button, Text } from "@chakra-ui/react"
import { signOut } from "firebase/auth";
import { auth } from "../pages/chat";
import {  useAppSelector } from "../reducers/settings";
import Messages from "./messages";

function SignOut() {
    const [clicked, setClicked] = useState<boolean>(false);
    useEffect(() => {
      if (clicked) {
        signOut(auth);
        window.location.href = "/";
      }
    }, [clicked])
    return auth.currentUser && (
      <Button className="sign-out" onClick={() => setClicked(true)}>Sign Out</Button>
    )
  }

export default function ChatRoom() {
    const token = useAppSelector((state) => state.token.value);
    const [connected, setConnected] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket>();
    useEffect((): any => {
        const newSocket = io("wss://gnc-backend-production.up.railway.app");
        // const newSocket = io(process.env.NODE_ENV === "development" ? "ws://localhost:3000/" : "wss://gnc-backend-production.up.railway.app//", {
        //     path: process.env.NODE_ENV === "development" ? "/api/ws/" : "/socket.io/"
        // });
        newSocket.on("connect", () => setConnected(true));
        setSocket(newSocket)
        return () => newSocket.close();
    }, []);
    return (
        <>
            {
                connected ? (
                    <Box>
                        <Button onClick={SignOut}>Sign Out</Button>
                        {/* <Text>{token}{"\n"}{JSON.stringify(auth.currentUser)}</Text> */}
                        <Messages socket={socket} />
                        <MessageInput socket={socket} />
                    </Box>
                ) : (
                    <Text>{"Connecting websockets..."}</Text>
                )
            }
        </>
    )
}