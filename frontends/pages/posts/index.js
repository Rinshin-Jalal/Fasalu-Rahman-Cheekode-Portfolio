import Metadata from '../../comps/Metadata';
import Link from 'next/link';
import { UserContext } from '../../contexts/userContext.js'
import {  useContext } from 'react';
import Image from 'next/image';




const BASE_URL = 'https://fasalcheekodeserver.herokuapp.com';

export const getStaticProps = async () => {
    const res = await fetch(`${BASE_URL}/posts/`);
    const data = await res.json();
    return {
        props: { posts:  data},
        revalidate:1
    }
}

function Post({posts}) {
    const {isUserLoggedIn,user,} = useContext(UserContext)
  return (
    <div className="blog">
        <Metadata title={`Fasal Cheekode Creative Corner | Blogs`}  description={'Fasal Cheekode Creative Corner is The Corner of Education'}/>
        <div>
            <p className="styled-head blog-styled">Blog</p>
            <h2 className="primarytext">Fasal Cheekode's Blogs</h2>
            <p className="intro">Lorem ipsum dolor sit amet, consectetur adipiscing egestasLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis at nunc auctor ornare netus in amet, pulvinar. Risus diam quis volutpat eu eget sit egestas.</p>
            <div className="line"></div>
            {posts.length >= 1 ?(
                <div>
                    <h1 className="allposts">All Posts</h1>
                    <div className="posts">
                        {posts.map(post=>(
                            <div className="blog-box" key={post.id}>
                            <Link  href={`/posts/${post.slug}`}>
                                <img className="blog-image" src={post.image?post.image : "/Blog.png"} alt={`Blog - ${post.title}`} title={`Blog - ${post.title}`} />
                            </Link>
                                    <Link href={`/posts/${post.slug}`}>  
                                        <a>
                                            <h3 className="blog-title">{post.title.length >= 40 ? (`${post.title.slice(0,40)}...`):(`${post.title}`)}</h3>
                                        </a>
                                    </Link>
                                <div>
                                    {isUserLoggedIn ? 
                                        user.is_staff ? <p className="blog-smallbody big">
                                            <Link href={`/admin/fasalcheekode/blog/edit/${post.slug}/`}>  Edit🪄 </Link> 
                                            .
                                            <Link href={`/admin/fasalcheekode/blog/delete/${post.slug}/`}> Delete🚮 </Link> 
                                            </p> :  
                                            <p className="blog-smallbody">Written by {post.owner}</p> 
                                        
                                        :
                                        <p className="blog-smallbody">Written by {post.owner}</p> 
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ):(
                <h1 className="allposts">No Post Available!! </h1>
            )}
        </div>
    </div>
  );
}
export default Post;
