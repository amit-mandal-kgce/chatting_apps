import React, { useEffect, useState } from "react";
import { FiPhoneOutgoing, FiPlusCircle, FiSend } from "react-icons/fi";
import Avater from "../../assets/usericon.svg";
import { io } from "socket.io-client";

const Dashboard = () => {
  // user......................................................
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user:detail")) || {}
  );
  console.log(setUser);
  const [conversations, setConversation] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  console.log(socket);
  // Sockte...............
  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(()=>{
    socket.emit('addUser', user?.id)
    socket.on('getUsers', users => {
      console.log("Active user :>>", users)
    })
  }, [socket])

  // Users....................................
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      setUsers(resData);
    };
    fetchUsers();
  }, [user]);

  // Conversations.................................
  useEffect(() => {
    const loggedInUsr = JSON.parse(localStorage.getItem("user:detail"));
    const fetchConversations = async () => {
      const res = await fetch(
        `http://localhost:8000/api/conversation/${loggedInUsr?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();
      setConversation(resData);
    };
    fetchConversations();
  }, []);

  // message conversationId...................................
  const fetchMessage = async (conversationId, receiver) => {
    const res = await fetch(
      `http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    console.log("resData :>>", resData);
    setMessages({ messages: resData, receiver, conversationId });
  };

  // Button send message.......................
  const sendMessage = async (e) => {
    await fetch(`http://localhost:8000/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId,
      }),
    });
    setMessage("");
  };

  console.log("user :>>", user);
  console.log("conversations :>>", conversations);
  console.log("message :>>", message);
  console.log("users :>>", users);
  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-primary">
        <div className="flex mx-14 items-center my-3">
          <div className="border border-light rounded-full p-[2px]">
            <img src={Avater} width={55} height={55} alt="bird" />
          </div>
          <div className="mx-2">
            <h3 className="text-lg">{user?.fullName}</h3>
            <p className="text-xs font-light">My account</p>
          </div>
        </div>
        <hr />
        <div className="mx-14 my-4">
          <div className="text-blue-500 text-lg mb-2">Messages</div>
          <div className="overflow-y-scroll h-[600px]">
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }) => {
                return (
                  <div className="flex items-center py-3 border-b border-b-gray-600">
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={() => fetchMessage(conversationId, user)}
                    >
                      <div>
                        <img src={Avater} width={40} height={40} alt="bird" />
                      </div>
                      <div className="mx-3">
                        <h3 className="text-sm font-semibold">
                          {user?.fullName}
                        </h3>
                        <p className="text-xs font-light text-gray-600">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {messages?.receiver?.fullName && (
          <div className="w-[75%] bg-secondary h-[50px] my-5 rounded-full flex items-center px-10">
            <div className="cursor-pointer">
              <img src={Avater} width={40} height={40} alt="bird" />
            </div>
            <div className="mr-auto">
              <h3 className="text-sm font-semibold ml-6">
                {messages?.receiver?.fullName}
              </h3>
              <p className="text-xs ml-6 font-light text-gray-600">
                {messages?.receiver?.email}
              </p>
            </div>
            <div className="cursor-pointer">
              <FiPhoneOutgoing />
            </div>
          </div>
        )}
        <div className="h-[75%] w-full overflow-y-scroll">
          <div className="p-6">
            {messages?.messages?.length > 0 ? (
              messages.messages.map(({ message, user: { id } = {} }) => {
                return (
                  <div
                    className={` max-w-[40%] mb-6 rounded-b-xl  p-2 ${
                      id === user?.id
                        ? "text-white bg-teal-300 rounded-tl-xl ml-auto"
                        : "bg-pink-300 rounded-tr-xl"
                    }`}
                  >
                    {message}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Messages or No Conversations Selected
              </div>
            )}
          </div>
        </div>
        {messages?.receiver?.fullName && (
          <div className="p-4 bg-green-200 px-8 w-full flex items-center">
            <input
              placeholder="Type a massage...."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border mx-8 outline-none w-full rounded-full p-2"
            />
            <div
              className={`px-1 text-3xl cursor-pointer ${
                !message && "pointer-events-none"
              }`}
            >
              <FiPlusCircle />
            </div>
            <div
              className={`px-1 text-3xl mx-6 cursor-pointer ${
                !message && "pointer-events-none"
              }`}
              onClick={() => sendMessage()}
            >
              <FiSend />
            </div>
          </div>
        )}
      </div>
      <div className="w-[25%] h-screen bg-light px-8 py-7">
        <div className="text-blue-600 text-lg">People</div>
        <div className="overflow-y-scroll h-[700px]">
          {users.length > 0 ? (
            users.map(({ userId, user }) => {
              return (
                <div className="flex items-center py-3 border-b border-b-gray-600">
                  <div
                    className="cursor-pointer flex items-center"
                    onClick={() => fetchMessage("new", user)}
                  >
                    <div>
                      <img src={Avater} width={55} height={55} alt="bird" />
                    </div>
                    <div className="mx-3">
                      <h3 className="text-lg font-semibold">
                        {user?.fullName}
                      </h3>
                      <p className="text-md font-light text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold mt-24">
              No Conversations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
