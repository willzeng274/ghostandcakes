import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { useRouter } from "next/router";

const SendMessage = ({ handleSubmit, handleMessageChange, message}: any) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="start typing...."
      />
      <button
        type="submit"
      >
        Send
      </button>
    </form>
  );
};

const Chat = () => {
  const router = useRouter();
  const [chats, setChats] = useState<Array<any>>([]);
  const [sender, setSender] = useState<string>("");
  const [messageToSend, setMessageToSend] = useState<string>("");
  const pusher = new Pusher(process.env.NEXT_PUBLIC_APP_KEY || "", {
    cluster: process.env.NEXT_PUBLIC_CLUSTER
  });
  useEffect(() => {
    let usrname: string = prompt("Username?");
    if (usrname.length > 10) {
      usrname = usrname.substring(0, 10);
    }
    setSender(usrname || "User_" + String(Math.floor(Math.random() * 100)));
    const channel = pusher.subscribe("chat");
    channel.bind("chat-event", function (data: any) {
      console.log("Received event")
      setChats((prevState): Array<any> => [
        ...prevState,
        { sender: data.sender, message: data.message },
      ]);
    });
    console.log("Reloaded")
    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const handleSignOut = () => {
    pusher.unsubscribe("chat");
    router.push("/");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (messageToSend.length < 1) {
      return;
    }
    await axios.post("/api/pusher", {
      message: messageToSend,
      sender,
    });
    setMessageToSend("");
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <div>
              <p>
                Hello, <span>{sender}</span>
              </p>
              <div>
                <button
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            </div>

            <div>
              <h2>You&apos;re online.</h2>
            </div>
          </div>

          <div>
            CHAT BOX
            <div style={{height: "70vh", width: "100%", overflowY: "scroll", border: "1px solid black"}}>
              {chats.map((chat, id) => (
                <div key={id}>
                  <div>
                    <b>{chat.sender === sender ? "You" : chat.sender}</b> : {chat.message.replaceAll("\\n", "\n")}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <SendMessage
                message={messageToSend}
                handleMessageChange={(e: any) => setMessageToSend(e.target.value)}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
