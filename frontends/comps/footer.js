import { Icon, InlineIcon } from '@iconify/react';
import githubFill from '@iconify/icons-akar-icons/github-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';

const Footer = () => {

        return (
            <div className="footer">
                <h1>Website by Rinshin Jalal</h1>
                <a href="https://github.com/Rinz-Code"><Icon style={{fontSize:"20px"}} icon={githubFill}/>Rinz-Code</a>
                <a href="https://www.instagram.com/124rinshin_jalal/?hl=en"><Icon style={{fontSize:"20px",marginLeft:"7px"}} icon={instagramFilled}/>124rinshin_jalal </a>
            </div>
     );
}
 
export default Footer;