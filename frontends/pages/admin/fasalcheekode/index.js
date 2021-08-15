import React, { useEffect, useState } from 'react';
import { UserContext } from '../../../contexts/userContext.js';
import {  useContext } from 'react';
import ErrorPage from 'next/error';
import Link from 'next/link';

const Index = () => {
    const {BASE_URL,user, setUser, isUserLoggedIn,authRequest} = useContext(UserContext)
    const [editSlug,setEditSlug] = useState('');
    const [deleteSlug,setDeleteSlug] = useState('');
    return ( 
        <div className="admin">
            {isUserLoggedIn ?
            ( user.is_staff
                 && <>
                    <h2>Hai Fasal Sir</h2>
                    <h1>For Administration of this website check below:</h1>
                    <div className="box big">
                        <h3 className="blog">Blog</h3>
                        <Link href='fasalcheekode/blog/create'><a className="go">create Blog</a></Link>
                        <div className="box">
                            <h4>To Edit a blog:</h4>
                            <div>
                                <p className="line"> Type Slug of the blog here: </p>
                                <input value={editSlug} onChange={e=>setEditSlug(e.target.value) }></input>
                                <br />

                                {editSlug  && <Link href={`fasalcheekode/blog/edit/${editSlug}/`}><a className="go">Go</a></Link>}
                            </div>                    
                        </div>
                        <div className="box">
                            <h4>To Delete a blog:</h4>
                            <div>
                                <p className="line"> Type Slug of the blog here: </p>
                                <input value={deleteSlug} onChange={e=>setDeleteSlug(e.target.value) }></input>
                                <br />
                                {deleteSlug &&  <Link href={`fasalcheekode/blog/delete/${deleteSlug}`}><a className="go">Go</a></Link>}
                            </div>
                        </div>
                    </div>
                    <div className="box">
                        <h3 className="blog">Quiz</h3>
                        <p className="line">To create, edit and administration of quizzes visit: </p>
                        <br /> <br />
                        <Link href={`${BASE_URL}/admin/quiz/`}><a className="go">Quiz server page</a></Link>
                    </div>
                    <div className="box">
                        <h3>For Gallery ,check this <Link href={`${BASE_URL}/admin/api/gallery/`}><a>Link</a></Link></h3>
                    </div>
                    <div className="box">
                        <h3>For more accessablity visit <Link href={`${BASE_URL}/admin/`}><a>server page</a></Link></h3>
                    </div>
                    
                 </>
                 ):
            (
                <ErrorPage statusCode={404}/>
            )}
        </div>
     );
}
 
export default Index;