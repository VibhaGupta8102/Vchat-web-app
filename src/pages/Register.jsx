import React ,{ useState } from 'react'
// import "../style.scss" 
import Add from '../img/profile.png' ;
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth,storage,db} from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
   const[err,setErr]= useState(false);
   const [loading, setLoading] = useState(false);
  const navigate= useNavigate();

  const handleSubmit = async (e)=>{
    setLoading(true);
    e.preventDefault()
    const displayName=e.target[0].value;
    const email=e.target[1].value;
    const password=e.target[2].value;
    const file=e.target[3].files[0];
try {
  const res  = await createUserWithEmailAndPassword(auth, email, password);
  const date = new Date().getTime();
const storageRef = ref(storage,  `${displayName + date}`);
await uploadBytesResumable(storageRef, file).then(
  () => {
    getDownloadURL(storageRef).then(async(downloadURL) => {
      try{
      await updateProfile(res.user,{
        displayName,
        photoURL: downloadURL,
      });
      await setDoc(doc(db,"users",res.user.uid),{
        uid: res.user.uid,
        displayName,
        email,
        photoURL:downloadURL,
      });
      await setDoc(doc(db,"userChats",res.user.uid),{});
      navigate("/")
    }
    catch (err) {
      console.log(err);
      setErr(true);
      setLoading(false);
    }
  });
  });
} catch (error) {
  setErr(true);
  setLoading(false);
}
  };

  return (
    <div className="formContainer">
        <div className="formWrapper">
        <h1 className="logo">Vchat</h1>
        <h3 className="title">Register</h3>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Display Name'/>
            <input type="email" placeholder='Email'/>
            <input type="password" placeholder='Password'/>
            <input type="file" id='file' style={{display:"none"}} />

            <label htmlFor="file"  style={{display:"flex",
          alignItems:"center" , gap:"11px" , cursor:"pointer" , fontSize:"12px" , color:"rgb(126, 159, 230)"}}>
             <img src={Add} alt="" />
              <span>Add profile pic</span>
              </label>
              <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>You do have account? <Link to="/login">Login</Link></p>
        </div>
    </div>
  );
};

export default Register
