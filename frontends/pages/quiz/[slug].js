// import React, { useState } from 'react';
// import 'github-markdown-css'
// import Metadata from '../../comps/Metadata';
// import Image from 'next/image'
import {useEffect, useState} from 'react';
import { UserContext } from '../../contexts/userContext.js'
import { useContext } from 'react'
import Link from "next/link"
import ErrorPage from 'next/error'
// import ScorePopup from '../../comps/ScorePopup.js';
// import { authRequest } from '../../api/auth.js';


const BASE_URL = 'http://127.0.0.1:8000';

export const getStaticPaths = async () =>{
    const res = await fetch(`${BASE_URL}/quiz/`);
    const data = await res.json();
    const paths = data.map(post => {
        return{
            params: {slug:String(post.slug)}
        }
    })

    return {
        paths,
        fallback:true,
    }
}
export const getStaticProps = async ({params}) => {
    const slug = params.slug;
    const res = await fetch(`${BASE_URL}/quiz/q/${slug}/`);
    const data = await res.json();

    return {
        props: { quiz: data ,status:res.status},
        revalidate:1
    }
}


export default function App({quiz,status}) {

  if(status == 404) return <ErrorPage statusCode={404}/>

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const {user,isUserLoggedIn,authRequest} = useContext(UserContext)
  const [score, setScore] = useState(0);


  if (process.browser){
    if (window && JSON.parse(window.localStorage.getItem('score')) && !showScore){
      const scoreLs = JSON.parse(window.localStorage.getItem('score'));
      if (scoreLs.quiz == quiz?.[0]?.quiz){
        setScore(scoreLs?.score);
        setShowScore(true);
      }
    }
  }
  const handleAnswerOptionClick = (isRight) => {
    console.log(false)
    console.log(isRight)
    let newscore = score
    if (isRight) {

      newscore++
      setScore(newscore);


      console.log("newscore:",newscore)
    }

    console.log(score)
    const nextQuestion = currentQuestion + 1;
    // console.log("r:",score)
    if (nextQuestion < quiz.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      console.log(score)

      setShowScore(true);
      
      let form_data = new FormData();
      form_data.append('score',newscore);
      console.log("quiz",quiz?.[0]?.quiz)
      form_data.append("quiz",quiz?.[0]?.quiz)
      form_data.append("user",user.username);
      // console.log(score)
        // console.log(`Bearer ${window.localStorage.getItem('access_token')}`)
        authRequest.post('/quiz/score/',form_data,{
          timeout:12000,  /// Is the main
          headers: {
              'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          }
      })
          .then(res => {
            console.log(res.data)
            window.localStorage.setItem("score",JSON.stringify({quiz:quiz?.[0]?.quiz,score:res.data.score,user:user.username}))
          })
          .catch(err => {
            console.log(err)
          })
    }
  };
  const abcd = ['a','b','c','d']
  if (isUserLoggedIn == false ){
    return (
      <div className="quizing">
        <div className="quizer">
            <div className="sc-section">
              <h1>Sign In First To Participate🤩</h1>
              <p>we want to know about you to fill the register🥰 </p>
              <h2 style={{textAlign:"center",fontSize:"30px"}}> <Link href="/login"><a><span style={{fontSize:"40px",color:"wheat"}}>Sign In</span></a></Link> & Comeback </h2>
              <Link href="/login"><a style={{textAlign:"center"}} className="btq">Go to Sign In</a></Link>
            </div>
        </div>
      </div>
    )
  }
  return (
    <div className="quizing">
      <div className='quizer'>
       
        {(showScore  ? (

            <main className='sc-section'>
              <h1>Congratulations🥳</h1>
              <p>You have scored: <a> <span>{score}</span> out of {quiz?.length}</a></p> 

              <Link href="/quiz"><a className="btq">Back to Quizzes</a></Link>
            </main>
        ) : (
          <div className="qa">
            <div className='q-section'>
            <p className='q-text'><small className='small-indicator'><span>Q.No {currentQuestion + 1}</span>/{quiz?.length}</small>  {quiz?.[currentQuestion].title}</p>
              {quiz?.[currentQuestion].image && <img className="q-img" src={quiz?.[currentQuestion].image} alt="" />}
            </div>
            <p className="small-indicator">options:-</p>
            <div className='a-section'>
              {quiz?.[currentQuestion].answers.map((answerOption) => (
                <div className="answs" key={answerOption.id} onClick={() => handleAnswerOptionClick(answerOption.is_right)}>
                  <p className="answer"> {answerOption.answer_text}</p>
                  {answerOption.image && <img src={answerOption.image}  className="a-img" />  }
                </div>
              ))}
            </div>
          </div>
          ))}
        
      </div>
    </div>
  );
}

