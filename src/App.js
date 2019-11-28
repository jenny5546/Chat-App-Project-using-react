import React, { useEffect, useState } from "react";

class ChatMessage {
  constructor(name, message, createdAt){
    this.name=name;
    this.message = message;
    this.createdAt= createdAt;
  }
}
export default function App() {
  const url= 'https://snu-web-random-chat.herokuapp.com';
  const [messageList, setMessageList] = useState([]);
  const [name, setName] = useState(null);
  const onLogin= (e)=>{
    e.preventDefault();
    if (!name){
      return alert('input your name');
    }
    fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': `Key ${localStorage.getItem('__key')}`,
      },
      body: JSON.stringify({ name }),
    }).then((response) => response.json())
    .then(({ key }) => {
      console.log(key);
      if (key) localStorage.setItem('__key', key);
    }).catch((err)=> console.error(err))
  }

  useEffect(() =>{
    fetch(`${url}/chats`)
    .then((res)=> res.json())
    .then((messages)=>{
      // console.log(messages);
      setMessageList(
        messages.map((message)=> new ChatMessage(message.user.name, message.message, message.createdAt)),
      );
    });
  });

  return (
    <div> 
      Chat program
      <div className="chatList">
        <form onSubmit={onLogin}>
          <input type="text" name="name" placeholder="type your name" onChange={(e)=> setName(e.target.value)}/>
          <input type="submit" value="login"/>
        </form>
        {messageList.map(message=>{
          return (
            <div>
              <span>{message.name}</span>
              <span>{message.message}</span>
              <span>{message.createdAt}</span>      
            </div>      
          )
        })
      }
        
      </div>
    </div>
  );
}

