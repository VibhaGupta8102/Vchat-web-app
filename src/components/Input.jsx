import React, { useContext, useState } from 'react'
import Attach from '../img/attach.jpg'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import {v4 as uuid} from "uuid"

const Input = () => { 
  const [text,setText]= useState("")
  const [img,setImg]= useState(null)
  const[err,setErr]= useState(false);

  const {currentUser}= useContext(AuthContext)
  const {data}= useContext(ChatContext)

  const handleSend= async ()=>{
    if(img && text){
      try{
      const storageRef = ref(storage, uuid());
      await uploadBytesResumable(storageRef, img).then(  () => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try{
            await updateDoc(doc(db,"chats",data.chatId),{
              messages: arrayUnion({
                id: uuid(),
                text,
                img: downloadURL,
                senderId:currentUser.uid,
                date:Timestamp.now(),
              }),
            });
          }
          catch (error) {
            setErr(true);
          }
        });
       } );
    }
    catch (err) {
      console.log(err);
      setErr(true);
    }
  }
  else if(img && !text){
    try{
    const storageRef = ref(storage, uuid());
    await uploadBytesResumable(storageRef, img).then(  () => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try{
          await updateDoc(doc(db,"chats",data.chatId),{
            messages: arrayUnion({
              id: uuid(),
              // text,
              img: downloadURL,
              senderId:currentUser.uid,
              date:Timestamp.now(),
            }),
          });
        }
        catch (error) {
          setErr(true);
        }
      });
     } );
  }
  catch (err) {
    console.log(err);
    setErr(true);
  }
}
    else{
      await updateDoc(doc(db,"chats",data.chatId),{
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId:currentUser.uid,
          date:Timestamp.now(),
        }),
      });
    }

     await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId +".lastMessage"]:{
        text,
      },
      [data.chatId+".date"]: serverTimestamp()
     })

     await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatId +".lastMessage"]:{
        text,
      },
      [data.chatId+".date"]: serverTimestamp()
     })


    setText("")
    setImg(null)
  }

  return (
    <div className='input'>
     <input type="text" placeholder='Type here...' onChange={e=>setText(e.target.value)} value={text} style={{outline:"none"}}/>
     <div className="send">
      <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
      <label htmlFor="file">
        <img src={Attach} alt="" />
      </label>
      <button onClick={handleSend}>Send</button>
      {err && <span>Something went wrong</span>}
     </div>

    </div>
  )
}

export default Input
