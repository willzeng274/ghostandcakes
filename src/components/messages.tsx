import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client"

export default function Messages({ socket }: { socket: Socket | undefined}) {
    const [messages, setMessages] = useState<any>({});
    useEffect(() => {
        const messageListener = (message: any) => {
            setMessages((prevMessages: any) => {
            const newMessages: any = {...prevMessages};
            newMessages[message.id] = message;
            return newMessages;
            });
        };
        
        const deleteMessageListener = (messageID: any) => {
            setMessages((prevMessages: any) => {
            const newMessages: any = {...prevMessages};
            delete newMessages[messageID];
            return newMessages;
            });
        };

        if (!socket) return;
        socket.on('message', messageListener);
        socket.on('ready', (vals: any) => {
            const newMsg: any = {
            ...messages
            };
            vals.forEach((val: any) => {
            newMsg[val.id] = val;
            })
            setMessages(newMsg);
        });
        socket.on('deleteMessage', deleteMessageListener);
        socket.emit('getMessages');

        return () => {
            socket.off('message', messageListener);
            socket.off('deleteMessage', deleteMessageListener);
        };
    }, [socket]);
  
    return (
      <Box height="80vh" width="100%" overflowY="scroll">
        {[...Object.values(messages)]
          .sort((a: any, b: any) => a.time - b.time)
          .map((message: any) => (
            <div
              key={message.id}
              title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
            >
                {/* <img src={message.user.img} /> */}
                <span className="user">{message.user.name}:</span>
                <span className="message">{message.value}</span>
                <span className="date">{new Date(message.time).toLocaleTimeString()}</span>
            </div>
          ))
        }
      </Box>
    );
  }