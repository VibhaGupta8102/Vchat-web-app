import React, { useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom';
import {  signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';


const Login = () => {

    const[err,setErr]= useState(false);
   const navigate= useNavigate();
 
   const handleSubmit= async (e)=>{
     e.preventDefault()
     const email=e.target[0].value;
     const password=e.target[1].value;
 try {
   await signInWithEmailAndPassword(auth,email,password);
   navigate("/")
 } catch (error) {
   setErr(true);
 }
   };

  return (
    <div className="formContainer">
        <div className="formWrapper">
        <h1 className="logo">Vchat</h1>
        <h3 className="title">Login</h3>
        <form onSubmit={handleSubmit}>
            
            <input type="email" placeholder='Email'/>
            <input type="password" placeholder='Password'/>
            <button>SignIn</button>
            {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have account? <Link to="/register">Register</Link></p>
        </div>
    </div>
  )
}

export default Login