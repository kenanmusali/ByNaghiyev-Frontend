import React, { useState, useEffect, useRef } from 'react'
import Header1Img from "../assets/img/header/header1.png"
import Header2Img from "../assets/img/header/header2.png"
// Import more header images as needed
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"

const Header = () => {
    // Array of header images
    const headerImages = [
        { id: 1, src: Header1Img, alt: "Header 1" },
        { id: 2, src: Header2Img, alt: "Header 2" },
        // Add more images as you have them
    ]

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [nextImageIndex, setNextImageIndex] = useState(1)
    const [slideDirection, setSlideDirection] = useState('right')
    const [isAnimating, setIsAnimating] = useState(false)
    const timeoutRef = useRef(null)

    const nextImage = () => {
        if (isAnimating) return
        setSlideDirection('right')
        setNextImageIndex(currentImageIndex === headerImages.length - 1 ? 0 : currentImageIndex + 1)
        setIsAnimating(true)
    }

    const prevImage = () => {
        if (isAnimating) return
        setSlideDirection('left')
        setNextImageIndex(currentImageIndex === 0 ? headerImages.length - 1 : currentImageIndex - 1)
        setIsAnimating(true)
    }

    const goToImage = (index) => {
        if (isAnimating || index === currentImageIndex) return
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
    }, [currentImageIndex, isAnimating])

    return (
        <div className='Header-Group' id='home'>
            <div className="Header-Text-Group">
                <button className='ButtonOff' onClick={prevImage}>
                    <img src={LeftSvg} alt="Left" />
                </button>

                <div className="Text-Group">
                    <p>HAND MADE LUXURY</p>
                    <h1>Transform your home WITH bY NAGHIYEV,
                        Products and change the energy!</h1>
                    <div className="Button-Group">
                        <button className='ButtonOff'>dISCOVER cOLLECTION</button>
                        <button className='ButtonOn'>Order Now</button>
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
                    src={headerImages[currentImageIndex].src}
                    alt={headerImages[currentImageIndex].alt}
                    className="current-image"
                />
                
                {/* Next Image (slides over) */}
                {isAnimating && (
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