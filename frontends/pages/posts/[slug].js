// import 'github-markdown-css'
import Metadata from '../../comps/Metadata';
import {useState} from 'react';
// import ReactMarkdown from 'react-markdown';
import ReactMarkdown from 'react-markdown/with-html';
import Link from 'next/link'
import { Icon, InlineIcon } from '@iconify/react';
import arrowRightCircleFill from '@iconify/icons-bi/arrow-right-circle-fill';
import { UserContext } from '../../contexts/userContext';
import {  useContext } from 'react';




const BASE_URL = 'https://fasalcheekodeserver.herokuapp.com';

export const getStaticPaths = async () =>{
    const res = await fetch(`${BASE_URL}/posts/`);
    const data = await res.json();
    const paths = data.map(post => {
        return{
            params: {slug:post.slug.toString()}
        }
    })

    return {
        paths,
        fallback:false,
    }
}
export const getStaticProps = async ({params}) => {
    const slug = params.slug;
    const res = await fetch(`${BASE_URL}/posts/${slug}/`);
    const data = await res.json();

    const postsres = await fetch(`${BASE_URL}/posts/`);
    const postselection = await postsres.json();

    const posts =  postselection.sort(() => Math.random() - Math.random()).slice(0, 3)

    return {
        props: { post: data,posts:posts ,status:res.status},
        revalidate:1
    }
}


const Details = ({ post,posts,status })=>{
    if(status == 404 ) return <ErrorPage statusCode={404}/>
    const {isUserLoggedIn,user,} = useContext(UserContext)

    return (
     <div className="blog-view">
        <Metadata title={`${post?.title} | Fasal Cheekode Creative Corner`}  description={` ${post?.body?.[100]}....`}/>
            <h1 className="title">{ post?.title }</h1>
            {isUserLoggedIn ? 
                user.is_staff ? <p className="author big">
                    <Link href={`/admin/fasalcheekode/blog/edit/${post.slug}/`}>  Edit🪄 </Link> 
                    .
                    <Link href={`/admin/fasalcheekode/blog/delete/${post.slug}/`}> Delete🚮 </Link> 
                    </p> :  
                    <p className="author">Hello by {post.owner}</p> 
                
                :
                <p className="author">Hello by {post.owner}</p> 
            }
            {post.image &&  <img className="main-img"
                src={`${post?.image}`}
                alt={post?.title}
                /> }
            {post?.body && 
            <div className="body">
                <div className='markdown-body'> 
                    <ReactMarkdown source={post.body}/>
                </div> 
            </div>
            }

            <div className="line1"></div>
            <h1 className="what">What to read next</h1>
            <div className="posts">
                {posts.map(post=>(
                    <div className="blog-box" key={post.id}>
                    <Link href={`/posts/${post.slug}`}>
                        <img className="blog-image" src={post.image?post.image : "/Blog.png"} alt={`Blog - ${post.title}`} title={`Blog - ${post.title}`} />
                    </Link>
                            <Link href={`/posts/${post.slug}`}>  
                                <a>
                                    <h3 title={`Blog - ${post.title}`} className="blog-title">{post.title.slice(0,40)}...</h3>
                                </a>
                            </Link>
                        <div>
                            {isUserLoggedIn ? 
                                user.is_staff ? <p className="author big">
                                    <Link href={`/admin/fasalcheekode/blog/edit/${post.slug}/`}>  Edit🪄 </Link> 
                                    .
                                    <Link href={`/admin/fasalcheekode/blog/delete/${post.slug}/`}> Delete🚮 </Link> 
                                    </p> :  
                                    <p className="author">Written by {post.owner}</p> 
                                
                                :
                                <p className="author">Written by {post.owner}</p> 
                            }
                        </div>
                    </div>
                ))}
            </div>
            <Link href="/posts/"><h2 className="seemore">See more <InlineIcon icon={arrowRightCircleFill} style={{color: '#61ffbd', fontSize: '40px'}} /></h2></Link>
     </div>
    );
}

export default Details;