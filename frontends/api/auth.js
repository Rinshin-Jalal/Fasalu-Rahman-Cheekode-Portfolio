import axios from 'axios';
const BASE_URL = "https://fasalcheekodeserver.herokuapp.com"
const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

let tokenRequest = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
})
const refreshToken = () => {
  if (process.browser){
    const refreshBody = {"refresh": window.localStorage.getItem(REFRESH_TOKEN)}
    return tokenRequest.post(`/api/token/access/`, refreshBody)
      .then((response)=> {
        window.localStorage.setItem(ACCESS_TOKEN, response.data.access);
        return Promise.resolve(response.data);
      }).catch((error)=>{
        return Promise.reject(error);
      });
  }
}

const isCorrectRefreshError = (status) => {
  return status === 401;
}


const authRequest = process.browser ? axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
    headers: {
      'Authorization': `Bearer ${window.localStorage.getItem(ACCESS_TOKEN)}`,
    }
}) : {BASE_URL: BASE_URL,timeout: 50};
if (process.browser){
  authRequest.interceptors.response.use(
    (response) => response,
    (error) => { 
      return errorInterceptor(error)
    }
  );
}

const errorInterceptor = (error) => {
  if(process.browser){
    const originalRequest = error.config;
    const status = error.response.status;
    if (isCorrectRefreshError(status)) {
      return refreshToken().then((data)=> {
        const headerAuthorization = `Bearer ${window.localStorage.getItem(ACCESS_TOKEN)}`;
        authRequest.defaults.headers['Authorization'] = headerAuthorization;
        originalRequest.headers['Authorization'] = headerAuthorization;
        return authRequest(originalRequest)
      }).catch((error)=> {
        logoutUser();
        return Promise.reject(error)
      })
    }
    return Promise.reject(error)
  }
}

const logoutUser = () => {
  if (process.browser){
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.removeItem(REFRESH_TOKEN);
    authRequest.defaults.headers['Authorization'] = "";
  }
}

export  {tokenRequest,logoutUser, refreshToken, authRequest,
         errorInterceptor, BASE_URL, ACCESS_TOKEN, REFRESH_TOKEN }

