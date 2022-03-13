import MessageInput from "./input";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Button, Text } from "@chakra-ui/react"
import { signOut } from "firebase/auth";
import { auth } from "../../pages/chat_fb";
import {  useAppSelector } from "../../reducers/settings";
import Messages from "./messages";

function SignOut() {
    const [clicked, setClicked] = useState<boolean>(false);
    useEffect(() => {
      if (clicked) {
        signOut(auth);
        localStorage.removeItem("idToken");
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
        let newSocket: Socket;
        switch (process.env.NODE_ENV) {
            case "development":
                newSocket = io("ws://localhost:3000/", {
                    path: "/api/ws/",
                    auth: {
                        token: process.env.NEXT_PUBLIC_SOCKET_TOKEN
                    }
                })
                break;
            default:
                newSocket = io("wss://gnc-backend-production.up.railway.app", {
                    auth: {
                        token: process.env.NEXT_PUBLIC_SOCKET_TOKEN
                    }
                });
                break;
        }
        newSocket.on("connect", () => {
            setConnected(true);
        });
        setSocket(newSocket)
        return () => newSocket.close();
    }, []);
    return (
        <>
            {
                connected ? (
                    <Box>
                        <SignOut />
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