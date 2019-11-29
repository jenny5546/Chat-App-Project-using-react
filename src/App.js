/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';

const API_ENDPOINT = 'https://snu-web-random-chat.herokuapp.com';

class ChatMessage {
  constructor(userName, message, createdAt) {
    this.userName = userName;
    this.message = message;
    this.createdAt = createdAt;
  }
}

export default function App() {
  const [messageList, setMessageList] = useState([]);
  const [name, setName] = useState(null);
  const [content, setContent] =useState(null);

  const onLogin = (e) => {
    e.preventDefault();
    if (!name) {
      return alert('input your name');
    }
    fetch(`${API_ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Authorization: `Key ${localStorage.getItem('__key')}`,
      },
      body: `name=${name}`,
    })
      .then((response) => response.json())
      .then(({ key }) => {
        console.log(key);
        if (key) {
          localStorage.setItem('__key', key);
          localStorage.setItem('name', name);
          window.location.reload();
        }
        
      })
      .catch((err) => console.error(err));
  };
  const sendMessage =(e) =>{
    e.preventDefault();
    
    fetch(`${API_ENDPOINT}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Key ${localStorage.getItem('__key')}`,
      },
      body: `message=${content}`
    })
      .then((response) => response.json())
      .then((message) => {
        console.log(message);
        const new_message= new ChatMessage(message.userName, content, message.createdAt);
        console.log(new_message)
        
        setMessageList([
          ...messageList,
          new_message
        ])

        console.log(messageList);
        //window.location.reload();
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    setInterval(()=>{
      fetch(`${API_ENDPOINT}/chats`)
      .then((res) => res.json())
      .then((messages) => {
        setMessageList(
          messages.map((message) => new ChatMessage(message.userName, message.message, message.createdAt)),
        );
      });
    },100)
  }, []);


  if(localStorage.getItem('name')){ //만약 로그인이 돼 있으면
    return(
      <div>
          <div>
          Welcome, {localStorage.getItem('name')}
        </div>

        <form onSubmit={sendMessage}>
          <input type="text" name="message" placeholder="What do you want to say?" onChange={(e) => setContent(e.target.value)} />
          <input type="submit" value="Send!" />
        </form>

        <div className="chatList">
        {messageList.map(message=>{
          return (
            <div>
              <span>{ message.userName } : </span>
              <span>{ message.message } </span>
              <span>{ message.createdAt } </span>      
            </div>      
          )})} 
        </div>
      </div>
    )
  }

  else return (
    <div>
      로그인하세요
      <form onSubmit={onLogin}>
        <input type="text" name="name" placeholder="type your name" onChange={(e) => setName(e.target.value)} />
        <input type="submit" value="login" />
      </form>

      <div className="chatList">
        {messageList.map(message=>{
          return (
            <div>
              <span>{ message.userName } : </span>
              <span>{ message.message } </span>
              <span>{ message.createdAt } </span>      
            </div>      
          )})} 
      </div>
    </div>
  );
}