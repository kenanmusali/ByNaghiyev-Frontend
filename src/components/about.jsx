import React, { useState } from 'react'
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"
import LogoTextSvg from "../assets/svg/logo-text.svg"
import About1Img from "../assets/img/about/about1.png"
import About2Img from "../assets/img/about/about2.png"
import About3Img from "../assets/img/about/about3.png"

const About = () => {

    const [images, setImages] = useState([
        About1Img,
        About2Img,
        About3Img
    ])

    const handleRight = () => {
        setImages((prev) => {
            const newArr = [...prev]
            const first = newArr.shift()
            newArr.push(first)
            return newArr
        })
    }

    const handleLeft = () => {
        setImages((prev) => {
            const newArr = [...prev]
            const last = newArr.pop()
            newArr.unshift(last)
            return newArr
        })
    }

    return (
        <div className='About-Group Section-Slot' id='about'>
            <h1 className='Section-Title'>About us</h1>

            <div className="Slider-Group">
                <div className="SubSlider">

                    <button className='ButtonOff2' onClick={handleLeft}>
                        <img src={LeftSvg} alt="Left" />
                    </button>

                    <div className="ImageStacks">
                        {images.map((img) => (
                            <img key={img} src={img} alt="about" />
                        ))}
                    </div>

                    <button className='ButtonOff2' onClick={handleRight}>
                        <img src={RightSvg} alt="Right" />
                    </button>

                </div>

                <div className="SubText">
                    <p>The</p>
                    <img src={LogoTextSvg} />
                    <p>Azerbaijani brand. It is engaged in the production of decorative items for the home, scented and variously designed candles, epoxy pots.</p>
                    <p>The products are handmade, made to order. Delivery to any address is possible. Hurry up to order.</p>
                    <p>With By Naghiyev products, you can also give your home an aesthetic touch and change the energy!</p>
                </div>
            </div>
        </div>
    )
}

export default About