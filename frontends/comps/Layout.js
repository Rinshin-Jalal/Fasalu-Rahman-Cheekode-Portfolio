import { refreshToken,logoutUser,BASE_URL } from '../api/auth';
import { UserContext } from '../contexts/userContext';
import React,{useState,useEffect} from 'react';
import Head from 'next/head';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './footer';


const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const isUserLoggedIn = !!user;
  const ACCESS_TOKEN = 'access_token'
  const REFRESH_TOKEN = 'refresh_token'
  useEffect(() => {
    if (process.browser && window.localStorage.getItem(ACCESS_TOKEN) && window.localStorage.getItem(REFRESH_TOKEN)){

        const getUserData = async (id)=>{
            const res = await fetch(`${BASE_URL}/users/${id}`);
            const userData = await res.json();
            setUser(userData);
        }

        var refreshedtoken = jwt_decode(window.localStorage.getItem(REFRESH_TOKEN))
        getUserData(refreshedtoken.user_id);

    }
},[])

  if (process.browser && window.localStorage.getItem(ACCESS_TOKEN) && window.localStorage.getItem(REFRESH_TOKEN)){
    var accesstoken = window.localStorage.getItem(ACCESS_TOKEN);
    var refreshtoken = window.localStorage.getItem(REFRESH_TOKEN);
    if (jwt_decode(accesstoken).exp < Date.now() / 1000) {
      refreshToken();
    }
    if (jwt_decode(refreshtoken).exp < Date.now() / 1000) {
      logoutUser();
      setUser(null);
    }
  }
  const logout = (event) => {
    event.preventDefault();
    logoutUser();
    setUser(null);
  }
  const authRequest = process.browser ? axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem(ACCESS_TOKEN)}`,
      }
  }) : {BASE_URL: BASE_URL,timeout: 50};

  return (
      <div className="content">
          <UserContext.Provider value={{authRequest,BASE_URL,user, setUser, isUserLoggedIn,logout}}>
              <Navbar></Navbar>
              { children }
              <Footer></Footer>
          </UserContext.Provider>
      </div>
  );
}

export default Layout;
