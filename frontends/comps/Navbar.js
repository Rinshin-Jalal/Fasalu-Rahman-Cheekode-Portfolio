import {BASE_URL} from '../api/auth';
import { useState } from 'react';
import Link from "next/link";
import {UserContext} from "../contexts/userContext";
import {useContext} from "react";
import closeFill from '@iconify/icons-eva/close-fill';
import menuIcon from '@iconify-icons/majesticons/menu';
import { Icon, InlineIcon } from '@iconify/react';
import LogoutPopup from './Logoutpopup';



const Navbar = () => {
    
    const [isOpen, setIsOpen] = useState(false);
 
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    const {user, setUser, isUserLoggedIn} = useContext(UserContext)
    const  [className,setClassName] = useState(``)
    const respochanger = () => {
        if (className === ""){
            setClassName('opened')
        }
        if (className === "opened"){
            setClassName("")
        }
    }
        return (
            <div className="navbar">
                <div className="container">
                    <Link href="/"  ><a className="logo">Fasal Cheekode</a></Link>
                        
                    <div className="mobile-menu-wrapper">
                            <Icon icon={menuIcon} style={{color: '#aeaeae'}} className="mobile-menu" id="mobile-cta" onClick={respochanger} /> 
                    </div>

                    <nav className={className}>
                        <Icon icon={closeFill} className="mobile-menu-exit" id="mobile-exit" onClick={respochanger}/>
                        <ul className="primary-nav">
                            <li><Link href="/"><a>Home</a></Link></li>
                            <li><Link href="/quiz"><a>Quiz</a></Link> </li>
                            <li> <Link href="/gallery"><a>Gallery</a></Link> </li>
                            <li> <Link href="/posts"><a>Blog</a></Link> </li>
                        </ul>
                        <ul className="secondary-nav">
                            {isUserLoggedIn ?
                                (user.is_staff ?  (<li>  <Link href="/admin/fasalcheekode"><a className="nav-main-btn">Admin</a></Link>  </li>):( <li onClick={togglePopup}> <a className="nav-main-btn">Logout</a> </li> ) )
                                :( <li> <p className="nav-main-btn lr"><Link href="/register"><a>Sign Up</a></Link><Link href="/login"><a> Sign In</a></Link></p> </li> )
                            }
                        </ul>
                    </nav>
                </div>
                    {isOpen && <LogoutPopup handleClose={togglePopup}/>}
            </div>
     );
}
 
export default Navbar;