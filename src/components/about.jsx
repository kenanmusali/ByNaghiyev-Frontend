import React, { useState, useEffect } from 'react'
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"
import BgBodySvg from "../assets/svg/bg-body1.svg"
import { useLanguage } from '../context/LanguageContext.jsx';

const About = () => {
    const [images, setImages] = useState([]);
    const [logoTextSvg, setLogoTextSvg] = useState('');
    const [sectionTitle, setSectionTitle] = useState({ en: 'About us', az: 'Haqqımızda' });
    const [texts, setTexts] = useState([]);
const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setLoading(true);
                const timestamp = new Date().getTime();
                const response = await fetch(`https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/about-data.json?_=${timestamp}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch about data');
                }
                
                const data = await response.json();
                
                if (data.images) setImages(data.images);
                if (data.logoTextSvg) setLogoTextSvg(data.logoTextSvg);
                if (data.sectionTitle) setSectionTitle(data.sectionTitle);
                if (data.texts) setTexts(data.texts);
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching about data:', err);
            }
        };

        fetchAboutData();
    }, []);

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

    if (loading) {
        return (
            <div className='About-Group Section-Slot' id='about'>
                <h1 className='Section-Title'>{sectionTitle[language]}</h1>
                <div className="loading-container">
                    <p>Loading about content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='About-Group Section-Slot' id='about'>
                <h1 className='Section-Title'>{sectionTitle[language]}</h1>
                <div className="error-container">
                    <p>Error loading about content: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='About-Group Section-Slot' id='about'>
            <h1 className='Section-Title'>{sectionTitle[language]}</h1>

            <div className="Slider-Group">
                <div className="SubSlider">

                    <button className='ButtonOff2' onClick={handleLeft}>
                        <img src={LeftSvg} alt="Left" />
                    </button>

                    <div className="ImageStacks">
                        {images.map((img, index) => (
                            <img key={index} src={img} alt="about" />
                        ))}
                    </div>

                    <button className='ButtonOff2' onClick={handleRight}>
                        <img src={RightSvg} alt="Right" />
                    </button>

                </div>

                <div className="SubText">
                    <p>{texts[language]?.[0] || ''}</p>
                    <img src={logoTextSvg} alt="Logo Text" />
                    <p>{texts[language]?.[1] || ''}</p>
                    <p>{texts[language]?.[2] || ''}</p>
                    <p>{texts[language]?.[3] || ''}</p>
                </div>
            </div>
        </div>
    )
}

export default About