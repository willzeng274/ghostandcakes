import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { Socket } from "socket.io-client";

const MessageInput = ({ socket }: { socket: Socket | undefined }) => {
    const [value, setValue] = useState<string>('');
    const submitForm = (e: any) => {
      e.preventDefault();
      if (socket) {
        socket.emit('message', value);
        setValue('');
      }
    };
    return (
      <form onSubmit={submitForm}>
        <Input
          autoFocus
          value={value}
          placeholder="Type your message"
          onChange={(e) => {
            setValue(e.currentTarget.value);
          }}
        />
        <Button type="submit" disabled={!value}>Send🕊️</Button>
      </form>
    );
};

export default MessageInput;