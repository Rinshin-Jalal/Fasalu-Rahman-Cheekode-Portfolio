import Metadata from '../../comps/Metadata';
import Link from 'next/link';
import { UserContext } from '../../contexts/userContext.js'
import {  useContext } from 'react';


const BASE_URL = 'https://fasalcheekodeserver.herokuapp.com';

export const getStaticProps = async () => {
    const res = await fetch(`${BASE_URL}/quiz/`);
    const data = await res.json();
    return {
        props: { quizzes:  data},
        revalidate:1
    }
}

function Home({quizzes}) {
    const {user, setUser, isUserLoggedIn} = useContext(UserContext)
    
  return (
    <div className="blog quiz">
        <Metadata title={`Fasal Cheekode Creative Corner | Quiz`}  description={'Fasal Cheekode Creative Corner is The Corner of Education'}/>
        <div>
            <p className="styled-head blog-styled">Quiz</p>
            <h2 className="primarytext">Fasal Cheekode's Quizzes</h2>
            <p className="intro">Lorem ipsum dolor sit amet, consectetur adipiscing egestasLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis at nunc auctor ornare netus in amet, pulvinar. Risus diam quis volutpat eu eget sit egestas.</p>
            
            <div className="line"></div>
            {quizzes.length > 0 ? (
            <div className="">
                <h1 className="allposts">All Quiz</h1>
                <div className="posts">
                    {quizzes.map(quiz=>(
                        <div className="blog-box quiz" key={quiz.id}>
                        <Link  href={`/quiz/${quiz.slug}`}>
                            <img className="blog-image" src={quiz.image?quiz.image : "/quiz.png"} alt={`Quiz - ${quiz.title}`} title={`Quiz - ${quiz.title}`} />
                        </Link>
                                <Link href={`/quiz/${quiz.slug}`}>  
                                    <a>
                                        <h3 className="blog-title">{quiz.title.length >= 40 ? (`${quiz.title.slice(0,40)}...`):(`${quiz.title}`)}</h3>
                                    </a>
                                </Link>
                            <div>
                                <p className="blog-smallbody">No.of Questions: {quiz.question.length}</p>
                            </div>
                        </div>
                    ))}              
                </div>
            </div>
            ):(
                <h1 className="allposts">No Quiz Available</h1>
            )}
        </div>
    </div>
  );
}
export default Home
/*
                {quizzes.map(quiz=>(
                    <div className="quiz-box">
                        <Link href={`/quiz/${quiz.title}`} key={quiz.id}>
                            <a>
                                <h3>{quiz.title}</h3>
                            </a>
                        </Link>
                        <Link href={`/posts/${post.slug}`}>  
                            <a>
                                <h3 className="blog-title">{post.title.length >= 40 ? (`${post.title.slice(0,40)}...`):(`${post.title}`)}</h3>
                            </a>
                        </Link>
                    </div>
                ))}
*/