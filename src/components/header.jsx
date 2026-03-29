import React, { useState, useEffect, useRef } from 'react'
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"
 import { useLanguage } from '../context/LanguageContext.jsx';

const Header = () => {
    const [headerImages, setHeaderImages] = useState([])
    const [headerText, setHeaderText] = useState({})
    const [buttonTexts, setButtonTexts] = useState({})
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [nextImageIndex, setNextImageIndex] = useState(1)
    const [slideDirection, setSlideDirection] = useState('right')
    const [isAnimating, setIsAnimating] = useState(false)
const { language } = useLanguage();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const timeoutRef = useRef(null)

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                setLoading(true)
                const timestamp = new Date().getTime()
                const response = await fetch(`https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/header-data.json?_=${timestamp}`)
                
                if (!response.ok) {
                    throw new Error('Failed to fetch header data')
                }
                
                const data = await response.json()
                
                if (data.images) setHeaderImages(data.images)
                if (data.headerText) setHeaderText(data.headerText)
                if (data.buttonTexts) setButtonTexts(data.buttonTexts)
                
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
                console.error('Error fetching header:', err)
            }
        }

        fetchHeaderData()
    }, [])

    // Reset indices when images load
    useEffect(() => {
        if (headerImages.length > 0) {
            setNextImageIndex(currentImageIndex === headerImages.length - 1 ? 0 : currentImageIndex + 1)
        }
    }, [headerImages])

    const nextImage = () => {
        if (isAnimating || headerImages.length === 0) return
        setSlideDirection('right')
        setNextImageIndex(currentImageIndex === headerImages.length - 1 ? 0 : currentImageIndex + 1)
        setIsAnimating(true)
    }

    const prevImage = () => {
        if (isAnimating || headerImages.length === 0) return
        setSlideDirection('left')
        setNextImageIndex(currentImageIndex === 0 ? headerImages.length - 1 : currentImageIndex - 1)
        setIsAnimating(true)
    }

    const goToImage = (index) => {
        if (isAnimating || index === currentImageIndex || headerImages.length === 0) return
        setSlideDirection(index > currentImageIndex ? 'right' : 'left')
        setNextImageIndex(index)
        setIsAnimating(true)
    }

    // Handle animation end
    const handleAnimationEnd = () => {
        setCurrentImageIndex(nextImageIndex)
        setIsAnimating(false)
    }

    // Auto-play functionality
    useEffect(() => {
        if (headerImages.length === 0) return
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            nextImage()
        }, 5000)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [currentImageIndex, isAnimating, headerImages.length])

    if (loading) {
        return (
            <div className='Header-Group' id='home'>
                <div className="loading-container">
                    <p>Loading header...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='Header-Group' id='home'>
                <div className="error-container">
                    <p>Error loading header: {error}</p>
                </div>
            </div>
        )
    }

    if (headerImages.length === 0) {
        return null
    }

    return (
        <div className='Header-Group' id='home'>
            <div className="Header-Text-Group">
                <button className='ButtonOff' onClick={prevImage}>
                    <img src={LeftSvg} alt="Left" />
                </button>

                <div className="Text-Group">
                    <p>{headerText.subtitle?.[language] || ''}</p>
                    <h1>{headerText.title?.[language] || ''}</h1>
                    <div className="Button-Group">
                        <button className='ButtonOff'>{buttonTexts.discoverCollection?.[language] || ''}</button>
                        <button className='ButtonOn'>{buttonTexts.orderNow?.[language] || ''}</button>
                    </div>
                    {/* Dots indicator */}
                    {headerImages.length > 1 && (
                        <div className="Carousel-Dots">
                            {headerImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`Dot ${index === currentImageIndex ? 'Active' : ''}`}
                                    onClick={() => goToImage(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <button className='ButtonOff' onClick={nextImage}>
                    <img src={RightSvg} alt="Right" />
                </button>
            </div>

            <div className="image-container">
                {/* Current Image (stays in place) */}
                <img
                    src={headerImages[currentImageIndex]?.src}
                    alt={headerImages[currentImageIndex]?.alt}
                    className="current-image"
                />
                
                {/* Next Image (slides over) */}
                {isAnimating && headerImages[nextImageIndex] && (
                    <img
                        src={headerImages[nextImageIndex].src}
                        alt={headerImages[nextImageIndex].alt}
                        className={`next-image slide-from-${slideDirection}`}
                        onAnimationEnd={handleAnimationEnd}
                    />
                )}
            </div>
        </div>
    )
}

export default Header