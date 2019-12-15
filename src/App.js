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

// function getDocHeight() {
//   const D = document;
//   return Math.max(
//     D.body.scrollHeight, D.documentElement.scrollHeight,
//     D.body.offsetHeight, D.documentElement.offsetHeight,
//     D.body.clientHeight, D.documentElement.clientHeight,
//   );
// }
// function amountscrolled() {
//   const winheight= window.innerHeight || (document.documentElement || document.body).clientHeight;
//   const docheight = getDocHeight();
//   const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
//   const trackLength = docheight - winheight;
//   const pctScrolled = Math.floor(scrollTop/trackLength*100); // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
//   console.log(pctScrolled + '% scrolled')
//   return pctScrolled;
// }

// window.addEventListener('scroll', () => {
//   amountscrolled();
// }, false);

// window.onload = () => {
//   console.log("hi")
//   window.scrollTo(1000, 1000);
// };

export default function App() {
  const [messageList, setMessageList] = useState([]);
  // const [messageHistory, setHistory] = useState([]);
  const [name, setName] = useState(null);
  const [content, setContent] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDuplicates = (response) => {
    if (!response.ok) {
      return alert('중복된 닉네임입니다');
    }
    return response.json();
  };

  const onLogin = (e) => {
    e.preventDefault();
    if (!name) {
      return alert('닉네임을 입력해주세요');
    }
    fetch(`${API_ENDPOINT}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Authorization: `Key ${localStorage.getItem('__key')}`,
      },
      body: `name=${name}`,
    })
      .then(handleDuplicates)
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
  const sendMessage = (e) => {
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
        const newMessage = new ChatMessage(message.user.name, content, message.createdAt);
        console.log(newMessage);
        setMessageList([
          ...messageList,
          newMessage,
        ]);

        document.querySelector('.input').value = '';
      })
      .catch((err) => console.error(err));
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('__key');
    localStorage.removeItem('name');
  };

  useEffect(() => {
    setInterval(() => {
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

  
  // fetch(`https://cors-anywhere.herokuapp.com/https://openapi.naver.com/v1/search/local.json?query=hi&start=1&sort=random`,{
  //     headers:{
  //       'X-Naver-Client-Id':'v2ovBB6VAQB_os_SAzYR',
  //       'X-Naver-Client-Secret':'TrDGGlwyV7',
  //     }
  //   }).then((response)=>response.json())
  //     .then((data)=>console.log(data));

  // const loadMore = (e) =>{
  //   e.preventDefault();
  //   if (messageHistory[messageHistory.length -1]){
  //     fetch(`${API_ENDPOINT}/chats?createdAtFrom=${messageHistory[messageHistory.length -1].createdAt+1}`)
  //     .then((res) => res.json())
  //     .then((messages) => {
  //         messages.map((message) => messageHistory.push(new ChatMessage(message.userName, message.message, message.createdAt)))
  //     });
  //   }
    
  // }

//   setInterval(()=>{
//     if (messageHistory[messageHistory.length -1] && messageHistory[messageHistory.length -1]!==messageList[messageList.length-1]){
//           fetch(`${API_ENDPOINT}/chats?createdAtFrom=${messageHistory[messageHistory.length -1].createdAt+1}`)
//           .then((res) => res.json())
//           .then((messages) => {
//               messages.map((message) => messageHistory.push(new ChatMessage(message.userName, message.message, message.createdAt)))
//           });
//         }
//   }, 100);

//  useEffect(() => {
//   fetch(`${API_ENDPOINT}/chats`)
//         .then((res) => res.json())
//         .then((messages) => {
//           setHistory(
//             messages.map((message) => new ChatMessage(message.userName, message.message, message.createdAt)),
//           );
          
          
//         });
// }, []);


//console.log(messageHistory)

  // if (amountscrolled()=== 100){
  //     if (messageList[0]) {
  //       fetch(`${API_ENDPOINT}/chats?createdAtTo=${messageList[0].createdAt}`)
  //         .then((res) => res.json())
  //         .then((messages) => {
  //           console.log(messages);
  //           messages.sort((a, b) => a.createdAt - b.createdAt);
  //           setMessageList([
  //             ...messageList,
  //             messages.map((message) => new ChatMessage(message.userName, message.message, message.createdAt)),
  //           ]);
  //         });
  //     }
  // //
  // }
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
          <input type="submit" onClick={logout} className="logout-button" value="로그아웃" />
          {/* <input type="submit" onClick={loadMore} className="button" value="loadmore" /> */}
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
            <textarea className="input" placeholder="하고 싶은 말이 있으신가요?" onKeyDown={(e) => { if (e.keyCode === 13) { if (e.shiftKey === true) { e.target.value += '\n'; } else sendMessage(e);} }} onChange={(e) => setContent(e.target.value)} />
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
            <form className="login_form" onSubmit={onLogin}>
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
          {messageList.map(message =>{
            return (
              <div className="chat-container">
                <div className="username">
                  {message.userName}
                  :
                </div>
                <div className="content">
                  { message.message }
                </div>
                <div className="date">
                  { formatDate(message.createdAt) }
                </div>
              </div>
            ); })}
        </div>

        <form className="chat_form" onSubmit={sendMessage}>
          <img className="icon" src={icon}/>
          <input type="text" className="input" placeholder="하고 싶은 말이 있으신가요?" onChange={(e) => setContent(e.target.value)} />
          <input type="submit" className="button" value="보내기" />
        </form>

      </div>
    </div>
  );
}