import {useState,useEffect} from 'react';
import { UserContext } from '../../../../../contexts/userContext.js'
import {  useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css'
import ErrorPage from 'next/error';

const BASEs_URL = 'http://127.0.0.1:8000';
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});
const mdParser = new MarkdownIt(/* Markdown-it options */);
export const getStaticPaths = async () =>{
    const res = await fetch(`${BASEs_URL}/posts/`);
    const data = await res.json();
    const paths = data.map(post => {
        return{
            params: {slug:post.slug.toString()}
        }
    })

    return {
        paths,
        fallback:true,
    }
}
export const getStaticProps = async ({params}) => {
    const slug = params.slug;
    // console.log(slug)
    const res = await fetch(`${BASEs_URL}/posts/${slug}/`);
    const data = await res.json();
    // console.log("eee:::::",res.status)
    return {
        props: { post: data ,status:res.status},
        revalidate:10  
    }
}

const Details = ({ post,status })=>{
    if (status == 404) return <ErrorPage statusCode={404}/>
    const [title,setTitle] = useState(post?.title);
    const [image,setImage] = useState(post?.image);
    const [body,setBody]   = useState(post?.body);
    const [postimage,setPostImage] = useState(null);
    const {BASE_URL,user, setUser, isUserLoggedIn,authRequest} = useContext(UserContext);
    const router = useRouter();
    const onImageUpload = file =>{
        return new Promise(resolve =>{
            console.log(file)
            const image = file;
            const name = file.name;
            let link = ''
            let form_data = new FormData();
            form_data.append("image", image);       
            form_data.append("name", name);
            console.log(form_data.get("image"))
            // fetch(`${BASE_URL}/images/post/`,{
            // // timeout:5000,  /// Is the main
            //     method:'POST',
            //     body:form_data,
            //     headers: {
            //         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            //     }
            // })
            authRequest.post('/images/post/',form_data,{
                timeout:12000,  /// Is the main
                headers: {
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                }
            })
                .then(res => {

                //   let slug = res.data.
                //   console.log(slug)
                //   router.push(`/posts/${slug}`)
                link = res.data.image
                // console.log("res",res)
                // return link
                resolve(link)
                })
                .catch(err => console.log(err))
        })
    }

    const handleChange = (e) => {
        if ([e.target.name] == 'image') {
            setPostImage({
                image: e.target.files,
            });
        }
        if ([e.target.name] == 'title') {
            setTitle(e.target.value);
        }
        // }if ([e.target.name] == 'body') {
        //     setBody(e.target.value);
        // } 
    };
    const handleEditorChange=({html, text})=> {  
        setBody(text)
        // console.log(text)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let form_data = new FormData();
        if (postimage){
            form_data.append("image", postimage?.image?.[0]);
            console.log(postimage?.image?.[0])
        }//else{
        //     form_data.append("image",image)
        // }
        form_data.append("title", title);       
        form_data.append("body", body);
        authRequest.patch(`/posts/${post?.slug}/`,form_data,{
          timeout:12000,  /// Is the main
          headers: {
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
          }
        })
            .then(res => {
              console.log(res.data);
              let slug = res.data.slug
              console.log(slug)
              router.push(`/posts/${slug}`)
            })
            .catch(err => console.log(err))
    };
    return (
        <>
            {isUserLoggedIn ?
                ( user.is_staff
                    && <div className="ceadmin">
                        <h1>Edit Blog - {title}</h1>
                                <form noValidate>
                                            <input
                                                type="text"
                                                id="title"
                                                label="Post Title"
                                                name="title"
                                                placeholder="title"
                                                autoComplete="title"
                                                value={title}
                                                onChange={handleChange}
                                                required
                                            />
                                            <MdEditor
                                                style={{ height: "500px" }}
                                                renderHTML={(text) => mdParser.render(text)}
                                                onChange={handleEditorChange}
                                                value={body}
                                                onImageUpload={onImageUpload}
                                            />
                                            <label
                                            htmlFor="post-image" className="for">
                                            Upload Thumbnail
                                            </label>
                                            <input
                                                accept="image/jpeg,image/png"
                                                id="post-image"
                                                onChange={handleChange}
                                                name="image"
                                                type="file"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                            >
                                                Edit Post
                                            </button>
                                </form>
                            </div>
                    ):
                (
                    <ErrorPage statusCode={404}/>
            )}
        </>
    );
}

export default Details;