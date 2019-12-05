/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-mdl';
import './App.css';
import icon from './icon-profile-1.jpg';
import 'react-mdl/extra/material.js';
import 'react-mdl/extra/material.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const API_ENDPOINT = 'https://snu-web-random-chat.herokuapp.com';

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.getFullYear() + '년 ' + 
    (date.getMonth()+1)  + '월 ' + 
    date.getDate() + '일 ' + 
    date.getHours() + '시 ' + 
    date.getMinutes() + '분'
    + date.getSeconds() +'초';
}


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
  const [content, setContent] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
    if (!localStorage.getItem('__key')) {
      return alert("로그인하고 이용해주세요")
    }
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
        var date = formatDate(message.createdAt);
        const newMessage = new ChatMessage(message.user.name, content, date);
        console.log(newMessage);
        setMessageList([
          ...messageList,
          newMessage,
        ]);

        //console.log(messageList);
        document.querySelector('.input').value = '';
      })
      .catch((err) => console.error(err));
  };

  const logout =(e)=>{
    e.preventDefault();
    localStorage.removeItem('__key');
    localStorage.removeItem('name');
  };

  useEffect(() => {
    setInterval(()=>{
      fetch(`${API_ENDPOINT}/chats?order=desc`)
        .then((res) => res.json())
        .then((messages) => {
          messages.sort((a, b) => a.createdAt - b.createdAt);
          setMessageList(
            messages.map((message) => new ChatMessage(message.userName, message.message, message.createdAt)),
          );
        });
    }, 3000);
  }, []);


  if (localStorage.getItem('name')) { // 만약 로그인이 돼 있으면
    return (
      <div className="App">
        <header className="App-header">
          <div className="Chatroom-title">
            [벤처 웹프로그래밍 공주님 왕자님방]에 오신
            &nbsp;
            {localStorage.getItem('name')}
            님, 환영합니다!
          </div>

        </header>
        <div className="logout">
          <Button type="submit" onClick={logout} className="logout-button" raised accent ripple>로그아웃</Button>
        </div>
        <div className="chatbox">
          <div className="chatList">
            {messageList.map(message=> {
              return (
                <div className={`chat-container ${localStorage.getItem('name') === message.userName ? 'mine' : ''}`}>
                  <div className="username">
                    { message.userName }
                    :
                  </div>
                  <div className="content">
                    { message.message }
                  </div>
                  <div className="date">
                    { formatDate(message.createdAt) }
                  </div>
                </div>
              );
            })}
          </div>

          <form className="chat_form" onSubmit={sendMessage}>
            <img className="icon" src={icon}/>
            <textarea className="input" placeholder="하고 싶은 말이 있으신가요?" onKeyDown={(e) => { if (e.keyCode === 13){ if (e.shiftKey === true) { e.target.value += '\n'; } else sendMessage(e);} }} onChange={(e) => setContent(e.target.value)} />
            <input type="submit" className="button" value="보내기" />
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Chatroom-title">
          벤처 웹프로그래밍 공주님 왕자님들과 채팅하려면 방에 입장해 주세요.
        </div>
      </header>
      <div className="login">
        <input type="submit" className="button" value="로그인" onClick={handleClickOpen} />
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">로그인</DialogTitle>
          <DialogContent>
            <form className= "login_form" onSubmit={onLogin}>
              <input type="text" className="login_input" placeholder="닉네임을 입력해주세요" onChange={(e) => setName(e.target.value)} />
              <input type="submit" className="button" value="방 입장" />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="chatbox">
        <div className="chatList">
          {messageList.map(message => {
            return (
              <div className="chat-container">
                <div className="username"> { message.userName } : </div> 
                <div className="content"> { message.message } </div>
                <div className="date">{ formatDate(message.createdAt) } </div>
              </div>
            ) })}
        </div>

        <form className= "chat_form" onSubmit={sendMessage}>
          <img className="icon" src={icon}/>
          <input type="text" className="input" placeholder="하고 싶은 말이 있으신가요?" onChange={(e) => setContent(e.target.value)} />
          <input type="submit" className="button" value="보내기" />
        </form>

      </div>
    </div>
  );
}