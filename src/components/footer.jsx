import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx';

const Footer = () => {
    const [footerData, setFooterData] = useState({})
    const [socials, setSocials] = useState([])
    const [logo, setLogo] = useState('')
    const [description, setDescription] = useState({})
    const [socialsTitle, setSocialsTitle] = useState({})
    const [newsletterTitle, setNewsletterTitle] = useState({})
    const [emailPlaceholder, setEmailPlaceholder] = useState({})
    const [subscribeText, setSubscribeText] = useState({})
    const [copyrightText, setCopyrightText] = useState({})
    const [termsText, setTermsText] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { language } = useLanguage();

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                setLoading(true)
                const timestamp = new Date().getTime()
                const response = await fetch(`https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/footer-data.json?_=${timestamp}`)
                
                if (!response.ok) {
                    throw new Error('Failed to fetch footer data')
                }
                
                const data = await response.json()
                
                if (data.logo) setLogo(data.logo)
                if (data.description) setDescription(data.description)
                if (data.socials) setSocials(data.socials)
                if (data.socialsTitle) setSocialsTitle(data.socialsTitle)
                if (data.newsletterTitle) setNewsletterTitle(data.newsletterTitle)
                if (data.emailPlaceholder) setEmailPlaceholder(data.emailPlaceholder)
                if (data.subscribeText) setSubscribeText(data.subscribeText)
                if (data.copyrightText) setCopyrightText(data.copyrightText)
                if (data.termsText) setTermsText(data.termsText)
                
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
                console.error('Error fetching footer:', err)
            }
        }

        fetchFooterData()
    }, [])

    const handleSubscribe = (e) => {
        e.preventDefault()
        const email = e.target.querySelector('input').value
        if (email) {
            console.log('Subscribed with email:', email)
            alert(`Subscribed with: ${email}`)
            e.target.reset()
        }
    }

    if (loading) {
        return (
            <div className='Footer-Group' id='socials'>
                <div className="loading-container">
                    <p>Loading footer...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='Footer-Group' id='socials'>
                <div className="error-container">
                    <p>Error loading footer: {error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='Footer-Group' id='socials'>
            <div className='Footer-Section'>
                <div className="LogoSection">
                    <img src={logo} alt="Logo" />
                    <p>{description[language]}</p>
                </div>
                <div className="SlotSection">
                    <h2>{socialsTitle[language]}</h2>
                    <div className="Socials-Group">
                        {socials.map((social, index) => (
                            <a 
                                key={index} 
                                href={social.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <img src={social.icon} alt={social.name} />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="SlotSection">
                    <h2>{newsletterTitle[language]}</h2>
                    <div className="Socials-Group">
                        <form onSubmit={handleSubscribe} className="Button-Group Social-Button-Group">
                            <input 
                                type="email" 
                                className="ButtonOff InputOn" 
                                placeholder={emailPlaceholder[language]}
                                required
                            />
                            <button type="submit" className='ButtonOn'>
                                {subscribeText[language]}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='Footer-Section'>
                <p>{copyrightText[language]}</p>
                <p>{termsText}</p>
            </div>
        </div>
    )
}

export default Footer