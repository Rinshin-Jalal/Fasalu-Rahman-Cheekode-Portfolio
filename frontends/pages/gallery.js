import { authRequest } from "../api/auth";
import  Image  from "next/image";


const BASE_URL = 'https://fasalcheekodeserver.herokuapp.com';

export const getStaticProps = async () => {
    const res = await fetch(`${BASE_URL}/gallery/`);
    const data = await res.json();
    const resp = await fetch(`${BASE_URL}/awardgallery`);
    const awards = await resp.json();
    return {
        props: { galleries:  data,awards:awards},
        revalidate:10
    }
}

const myLoader = ({src}) => {
  return src
}

const DateRenderer = ({date}) =>{
    let d = new Date(date);
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[d.getMonth()]
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    let day = days[d.getDay()]
    console.log(`${day}, ${d.getDate()} ${month} ${d.getFullYear()}`)

    return (
        <>{day}, {d.getDate()} {month} {d.getFullYear()}</>
    );
}

const Gallery = ({galleries,awards}) => {
    return ( 
        <div className="gallery">

            <p className="styled-head gallery-styled">Gallery</p>
            
            <a className="maina" href="/main.jpg"><img className="mainimg" src="/main.jpg" alt="" /></a>

            <div className="award-gallery">
                {awards.map(award =>(
                  <a key={award.id} href={award.image}><img className="image" src={award.image} alt={award.award_name} /></a> 
                ))}
            </div>
            <div className="gbox">
                {galleries.map(gallery => (
                    <div className="gallery-main" key={gallery.id}>
                        <h2 className="desc">{gallery.desc}</h2>
                        <div className="gallery-box">
                            <a href={gallery.image_1}><img className="image" src={gallery.image_1} alt={gallery.desc} /></a> 
                            {gallery.image_2 && <a  href={gallery.image_2}><img className="image" src={gallery.image_2} alt={gallery.desc} /></a>}
                            {gallery.image_3 && <a href={gallery.image_3}><img className="image" src={gallery.image_3} alt={gallery.desc} /></a>}
                            {gallery.image_2 &&  <a href={gallery.image_4}><img className="image" src={gallery.image_4} alt={gallery.desc} /></a>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="line"></div>
        </div>
     );
}
 

{/* <DateRenderer date={photo.uploaded_at}/> */}

export default Gallery;