import Link from 'next/link';
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from '../contexts/userContext.js'
import React, { useState, useContext,useEffect } from 'react';
import {tokenRequest,logoutUser,BASE_URL} from '../api/auth.js'
import LogoutPopup from '../comps/Logoutpopup.js';



export default function Login() {
  const {user, setUser, isUserLoggedIn} = useContext(UserContext)
  const ACCESS_TOKEN = 'access_token'
  const REFRESH_TOKEN = 'refresh_token'
  const router = useRouter()
  //console.log(isUserLoggedIn)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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
        return Promise.resolve(response.data);
      }).catch((error)=>{
        return Promise.reject(error);
      });
  }
}

    let tokenRequest = axios.create({
        baseURL: BASE_URL,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
    })

  const onLoginFormSubmit = (event) => {
    console.log('ds');
    event.preventDefault();
    if (!isValidForm()){
      return
    }
    loginUser(username, password).then((data)=>{
      setUser({username: username});
      router.push('/');
    }).catch((err)=> {
      // console.log(err)
      setError("Incorrect username/password.Try again")
    })
  }
  const isValidForm = () => {
    setError("")
    if (username === "" || password === ""){
      setError("Try a Real password and Username");
      return false;
    }
    return true;
  }
  // eslint-disable-next-line no-unused-vars
  const logout = () => {
    logoutUser()
    setUser(null);
  }

  return (

    <div className="lr">
          {isUserLoggedIn ? (
                <div className="lr-box">
                  <div className="finished">
                    <p className="styled-head lr-styled">Sign in</p>
                    <p>You have already Done This👍 <Link href="/posts"><a> visit <span> Blogs</span></a></Link></p>
                    <button onClick={togglePopup}>logout</button>
                  </div>
                </div>
          ) : (
          <div className="lr-box">
            <p className="styled-head lr-styled">Sign in</p>
            <form onSubmit={onLoginFormSubmit} method="POST">
              <input
                type="text"
                required
                id="username"
                label="User Name"
                name="username"
                placeholder="username"
                autoFocus
                onChange={(event)=>{setUsername(event.target.value.replace(/ /g, '-')
                .replace(/[^\w-]+/g, ''))}}
              />
              <input
                type="password"
                required
                name="password"
                label="Password"
                placeholder="password"
                onChange={(event)=>{setPassword(event.target.value.trim())}}
              />
              <p className="extra">Don't have an account,<Link href="/register"><a>Sign Up</a></Link> </p>
              <input type="submit" value="Sign In"/>
            </form>

            <p>{error}</p>
          </div>
          )}
        {isOpen && <LogoutPopup handleClose={togglePopup}/>}
    </div>

  )
}


//export default Logins;
