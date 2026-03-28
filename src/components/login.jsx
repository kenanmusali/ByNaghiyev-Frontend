import React from 'react'
import bgSvg from '../assets/svg/bg-pattern.svg'
import LogoSvg from '../assets/svg/logo.svg'

const Login = () => {
    return (
        <div className='Login-Page'>
            <div className="Login">
<img className='Logo' src={LogoSvg}/>
<br />
              <div className="SlotSection">
                    <div className="Socials-Group">
                               <div className="Button-Group Social-Button-Group Social-Button-Group1">
                        <input type="email" className="ButtonOff InputOn" placeholder="Email address"/>
                        <button className='ButtonOn'>Login</button>
                    </div>

                    </div>
                </div>
<img src={bgSvg} className='img'/>
            </div>
        </div>
    )
}

export default Login