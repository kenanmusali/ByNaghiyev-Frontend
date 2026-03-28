import React from 'react'
import Section1Svg from '../assets/svg/footer-bg-1.svg'
import Section2Svg from '../assets/svg/footer-bg-2.svg'

import Socail1Svg from '../assets/svg/ebayIcon.svg'
import Socail2Svg from '../assets/svg/instagramIcon.svg'
import Socail3Svg from '../assets/svg/xIcon.svg'
import Socail4Svg from '../assets/svg/whatsaapIcon.svg'
import Socail5Svg from '../assets/svg/youtubeIcon.svg'
import LogoSvg from '../assets/svg/logo.svg'

const Footer = () => {
    return (
        <div className='Footer-Group' id='socials'>
            <div className='Footer-Section'>
                <div className="LogoSection">
                    <img src={LogoSvg} />
                    <p>Turn your home into work of art. The right address for aesthetic touch and positive energy</p>
                </div>
                <div className="SlotSection">
                    <h2>Socials</h2>
                    <div className="Socials-Group">
                        <img src={Socail1Svg} />
                        <img src={Socail2Svg} />
                        <img src={Socail3Svg} />
                        <img src={Socail4Svg} />
                        <img src={Socail5Svg} />

                    </div>
                </div>
                <div className="SlotSection">
                    <h2>Newsletter</h2>
                    <div className="Socials-Group">
                               <div className="Button-Group Social-Button-Group">
                        <input type="email" className="ButtonOff InputOn" placeholder="Email address"/>
                        <button className='ButtonOn'>Subscribe</button>
                    </div>

                    </div>
                </div>

            </div>
            <div className='Footer-Section'>
                <p>© 2026, By Naghiyev, All right reserved</p>
                <p>Terms of use  |  Privacy Policy</p>
            </div>
        </div>
    )
}

export default Footer