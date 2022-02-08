import React from 'react'
import SocketIOClient from "socket.io-client"

interface IMsg {
    user: string;
    msg: string;
}

const Msg: React.FC = () => {
    const inputRef = React.useRef(null);
  
    const [connected, setConnected] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string>("");
    const [chat, setChat] = React.useState<IMsg[]>([]);
    const [msg, setMsg] = React.useState<string>("");
  
    React.useEffect((): any => {
      const socket = (SocketIOClient as any).connect(process.env.BASE_URL, {
        path: "/api/ws",
      });
  
      socket.on("connect", () => {
        console.log("SOCKET CONNECTED!", socket.id);
        setConnected(true);
      });
  
      socket.on("message", (message: IMsg) => {
        chat.push(message);
        setChat([...chat]);
      });
      setUsername(prompt("What is your preferred username?") || "User_" + String(new Date().getTime()).substr(-3))
      if (socket) return () => socket.disconnect();
    }, []);
  
    const sendMessage = async () => {
      if (msg) {
        const message: IMsg = {
          user: username,
          msg,
        };

        const resp = await fetch("/api/msg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
  
        if (resp.ok) setMsg("");
      }
  
      (inputRef?.current as any)?.focus();
    };
  
    return (
      <div>
        <div>
          <div>
            {chat.length ? (
              chat.map((chat, i) => (
                <div key={"msg_" + i}>
                  <span style={{fontWeight: "bold"}}>
                    {chat.user === username ? "Me" : chat.user}
                  </span>
                  : {chat.msg}
                </div>
              ))
            ) : (
              <div>
                No chat messages
              </div>
            )}
          </div>
          <div>
            <div>
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={msg}
                  placeholder={connected ? "Type a message..." : "Connecting..."}
                  disabled={!connected}
                  onChange={(e) => {
                    setMsg(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
              </div>
              <div>
                <button
                  onClick={sendMessage}
                  disabled={!connected}
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Msg;