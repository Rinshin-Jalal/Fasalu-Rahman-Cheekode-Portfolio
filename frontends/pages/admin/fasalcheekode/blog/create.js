import React, { useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts/userContext.js'
import {  useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import MarkdownIt from 'markdown-it'
import 'react-markdown-editor-lite/lib/index.css';
import ErrorPage from 'next/error';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});
const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function Create() {
    const {BASE_URL,user, setUser, isUserLoggedIn,authRequest} = useContext(UserContext)
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
    const [title,setTitle] = useState('');
    const [body,setBody] = useState('');
    const [notifyuser,setNotifyUser] = useState(false);
    const [categories,setCategories] = useState([]);
    // const [checked, setChecked] = useState(false);
    const [postimage, setPostImage] = useState(null);
    const [err,setErr] = useState('')
    const router = useRouter()
    const handleChange = (e) => {
        if ([e.target.name] == 'image') {
            setPostImage({
                image: e.target.files,
            });
        }
        if ([e.target.name] == 'notifyuser') {
            setNotifyUser(!notifyuser);
            console.log(!notifyuser)
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
        
            form_data.append("image", postimage?.image?.[0]);
            console.log(postimage?.image?.[0])
            
            form_data.append("title", title);       
            form_data.append("body", body);
            console.log(notifyuser)
            form_data.append("notify_users", notifyuser);
            console.log(form_data.get('notify_users'))
            if (body===""){setErr('Body is Empty')}
            else if (title===""){setErr('Title is Empty')}
            else if (postimage===null){setErr('Thumbnail is None')}
            else{
            authRequest.post('/posts/',form_data,{
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
                .catch(err => {

                })
        }

    };
    return (
        <>
            {isUserLoggedIn ?
            ( user.is_staff ? 
                (
                <div className="ceadmin">
                    <h1>Create Blog Post</h1>
                    <form noValidate>
                                <input
                                    type="text"
                                    id="title"
                                    label="Post Title"
                                    name="title"
                                    placeholder="Title"
                                    autoComplete="title"
                                    value={title}
                                    onChange={handleChange}
                                />
                                <MdEditor
                                    style={{ height: "500px" }}
                                    renderHTML={(text) => mdParser.render(text)}
                                    onChange={handleEditorChange}
                                    onImageUpload={onImageUpload}
                                />

                                <label
                                htmlFor="post-image" className="for">
                                Upload Thumbnail
                                </label>
                                <input
                                    accept="image/jpeg,image/png,image/jpg"
                                    id="post-image"
                                    onChange={handleChange}
                                    name="image"
                                    type="file"
                                />
        
                                <label htmlFor="toggle2" className="toggle-2">
                                <input
                                type="checkbox"
                                id="toggle2"
                                name="notifyuser"
                                value="notifyuser"
                                className="toggle-2__input"
                                checked={notifyuser}
                                onChange={handleChange}
                                />
                                <span className="toggle-2__button">Send Notifications</span>
                                </label>
                                <button type="submit" onClick={handleSubmit}>
                                    Create Post
                                </button>
                    </form>
                    <h1>{err}</h1>
                </div>):(
                <ErrorPage statusCode={404}/>
                )
            ):
            (
                <ErrorPage statusCode={404}/>
            )
            }
        </>

    );
}
