import {useState,useEffect} from 'react';
import { UserContext } from '../../../../../contexts/userContext.js'
import {  useContext } from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Link from 'next/link'

const BASE_URL = 'http://127.0.0.1:8000';

export const getStaticPaths = async () =>{
    const res = await fetch(`${BASE_URL}/posts/`);
    const data = await res.json();
    console.log(res.status)
    const paths = data.map(post => {
        return{
            params: {slug:post.slug.toString(),status:res.status}
        }
    })

    return {
        paths,
        fallback:true,
    }
}
export const getStaticProps = async ({params}) => {
    const slug = params.slug;
    console.log(slug)
    const res = await fetch(`${BASE_URL}/posts/${slug}/`);
    const data = await res.json();
    console.log(data)
    return {
        props: { post: data },
       revalidate:10
    }
}

const Details = ({ post,status })=>{
    if(status == 404) return <ErrorPage statusCode={404}/>
    const [title,setTitle] = useState(post?.title);
    const {BASE_URL,user, isUserLoggedIn,authRequest} = useContext(UserContext)
    const [deleted,setDeleted] = useState(false)
    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        authRequest.delete(`/posts/${post?.slug}/`)
        .then(res => {
              console.log(res.data);
              let slug = res.data.slug
              setDeleted(true)  
            })
            .catch(err => console.log(err))
    };
    return (
        <>
            {deleted == false ? 
                (isUserLoggedIn ?
                    ( user.is_staff
                        && (
                            <div className="delete">
                                <h2>Do you want to really <span className="red">Delete</span> the blog - <span className="head"> {title}</span></h2>
                                <form noValidate>
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                                className="button"
                                            >
                                                Delete {title}
                                            </button>
                                </form>
                            </div>
                        )
                        ):
                        (
                            <ErrorPage statusCode={404}/>
                        )
                ):
                (
                    <div className="delete">
                    <h2>You have deleted the blog - <span className="head">{title}</span></h2>
                        <form noValidate>
                                    <Link
                                        
                                        href="/"
                                    >
                                        <a className="button">Back Home🏠</a>
                                    </Link>
                        </form>
                    </div> 
                )
                
            }
        </>
    );
}

export default Details