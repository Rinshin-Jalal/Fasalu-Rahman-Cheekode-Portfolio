import { Icon, InlineIcon } from '@iconify/react';
import youtubeIcon from '@iconify/icons-bi/youtube';
import facebookIcon from '@iconify/icons-bi/facebook';
import telegramIcon from '@iconify/icons-bi/telegram';
import whatsappIcon from '@iconify/icons-dashicons/whatsapp';
import {UserContext} from "../contexts/userContext";
import {useContext,useState} from "react";
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'


const Home = ()=>{
    const {user, setUser, isUserLoggedIn,BASE_URL} = useContext(UserContext);
    const [name,setName] = useState("");
    const [no,setNo] = useState("");
    const [message,setMessage] = useState("");
    const [err,setErr] = useState("")
    const onFormSubmit = (event) => {
        event.preventDefault();

        if(isValidPhoneNumber(no)){
            fetch(`${BASE_URL}/contact/form/mailer`, {
                method: 'post',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({name,no,message})
              }).then(res => res.json())
                .then(res => {
                    console.log(res)
                    setErr("")
                    setMessage("")
                    setName("")
                    setNo("")
                });
        }else{
            setErr("Type a valid phone number")
        }
      }

    return (
        <div className="home">
            <section className="hero">
                <div className="container">
                    <div className="fasal-sir"></div>
                    <div className="right-col">
                        <p className="subhead">educator/vlogger/motivater</p>
                        <h1>I am Fasalu Rahman Cheekode</h1>
                        <div className="social-btns">
                            <div className="social-btn"> <a href="https://www.youtube.com/channel/UCz6KjxlPss6zK4dl8Yay0Fw"> <Icon className="icon" icon={youtubeIcon} /> </a> </div>
                            <div className="social-btn"> <a href="https://www.facebook.com/fasalcheekodeCreativecorner/"><Icon className="icon" icon={facebookIcon}/></a> </div>
                            <div className="social-btn"> <a href=""><Icon className="icon" icon={telegramIcon}/></a> </div>
                            <div className="social-btn"> <a href="https://www.wa.me/+919745322902"><Icon className="icon" icon={whatsappIcon}/></a> </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="about">
                <div className="container">
                    <div className="l-col">
                        <p className="styled-head about-styled">About</p>
                        <p className="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sem porttitor lorem condimentum. Pulvinar non pharetra nibh bibendum in ac, convallis nisi senectus. Id sed dui quis etiam pretium fermentum condimentum dui. Posuere in facilisis nisi est nec feugiat in. Leo vitae fermentum felis dui ornare.</p>
                    </div>
                    <div className="about-img"></div>
                </div>
            </section>
            <section className="contact">
                <div className="container">
                    <div className="cont-l">
                        <p className="styled-head contact-styled">Contact</p>
                        <form onSubmit={onFormSubmit}>
                            <input type="text" id="name" name="name" placeholder="Name" required value={name} onChange={(event)=>{setName(event.target.value)}} />

                            {/* <input type="text" id="number" name="number" placeholder="Phone/mobile Number" required value={no} onChange={(event)=>{setNo(event.target.value)}} style={{marginTop:"20px"}}/> */}

                            <PhoneInput defaultCountry="IN" value={no} onChange={setNo} className="phone" rules={{ required: true }} />
                            <p style={{color:"red",fontSize:"10px"}}>{err}</p>
                            <textarea name="message" id="message" cols="30" rows="10" placeholder="Message" required value={message} onChange={(event)=>{setMessage(event.target.value)}} ></textarea>
 
                            <input type="submit" className="send-message-cta" value="Send"/>

                        </form>

                    </div>
                    
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22137.925864006946!2d75.97748823946093!3d11.226841384928722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba645d73d210ad9%3A0x963225291209bd77!2sCheekkode%2C%20Kerala!5e0!3m2!1sen!2sin!4v1627742838393!5m2!1sen!2sin" width="600" height="450" style={{border:0}} loading="lazy"></iframe>
                </div>
            </section>
        </div>
    )
}
export default Home;