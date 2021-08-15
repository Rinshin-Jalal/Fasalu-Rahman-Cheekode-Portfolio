import Link from 'next/link';
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from '../contexts/userContext.js'
import React, { useState, useContext } from 'react';
import LogoutPopup from '../comps/Logoutpopup.js';



export default function Login() {
  const { setUser, isUserLoggedIn} = useContext(UserContext)
  const ACCESS_TOKEN = 'access_token'
  const REFRESH_TOKEN = 'refresh_token'
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [cpassword, setCPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
      setIsOpen(!isOpen);
  }

  const loginUser = (username, password) => {
  if(process.browser){
    const loginBody = {username: username, password: password}

    return tokenRequest.post(`/api/token/both/`, loginBody)
      .then((response)=> {
        window.localStorage.setItem(ACCESS_TOKEN, response.data.access);
        window.localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        window.localStorage.setItem('user',username)
        return Promise.resolve(response.data);
      }).catch((error)=>{
        return Promise.reject(error);
      });
  }
}
    const BASE_URL = "http://localhost:8000"

    let tokenRequest = axios.create({
        baseURL: BASE_URL,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
    })


  const Signup = () =>{
    fetch(`${BASE_URL}/users/new/`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"username": username, 'email':email ,'password':password})
      }).then(res => res.json())
        .then(res => {
            loginUser(username, password).then((data)=>{
              setUser({username: username});
              router.push('/');
            }).catch((error)=> {
              setError("Don't use space(' ') in passwords/email/username ")//error)
            })
        });
      }  
  

  const onRegisterFormSubmit = (event) => {
    event.preventDefault();
    if (isValidForm()){
      Signup()
    }
  }
  const isValidForm = () => {
      if (username === "" || password === ""){
        setError("You haven't typed username/password");
        return false;
      }
      if (cpassword != password){
        setError("Confirm password and password are not same")
        return false
      }
    return true;
  }
  return (

<div className="lr">
          {isUserLoggedIn ? (
                <div className="lr-box">
                  <div className="finished">
                    <p className="styled-head lr-styled">Sign Up</p>
                    <p>You have already Done This👍 <Link href="/posts"><a> visit <span> Blogs</span></a></Link></p>
                    <button onClick={togglePopup}>logout</button>
                  </div>
                </div>
          ) : (
          <div className="lr-box">
            <p className="styled-head lr-styled">Sign Up</p>
            <form onSubmit={onRegisterFormSubmit} method="POST">
            <input
              type="text"
              placeholder="username"
              required
              id="username"
              autoFocus
              onChange={(event)=>{setUsername(event.target.value.replace(/ /g, '_')
              .replace(/[^\w-]+/g, ''))}}
              value={username}
            />
            <input
              type="email"
              required
              placeholder="email"
              onChange={(event)=>{setEmail(event.target.value)}}
            />
            <input
              type="password"
              required
              placeholder="password"
              onChange={(event)=>{setPassword(event.target.value.trim())}}
            />
            <input
              type="password"
              required
              placeholder="confirm password"
              onChange={(event)=>{setCPassword(event.target.value.trim())}}
            />
            <p className="extra">Have an account,<Link href="/login"><a>Sign In</a></Link> </p>
            <input type="submit" value="Sign Up"/>
            
          </form>

            <p>{error}</p>
          </div>
          )}
        {isOpen && <LogoutPopup handleClose={togglePopup}/>}
    </div>


  )
}
