import React, { useState, useEffect, useRef } from 'react'
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"
import BgBodySvg from "../assets/svg/bg-body1.svg"
import Product1Img from "../assets/img/product/product1.png"
import EbaySvg from "../assets/svg/EBay.svg"
import InstagramSvg from "../assets/svg/instagram.svg"

const Products = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(4);
    const activeRef = useRef(null);
    const timeoutRef = useRef(null);

    // Sample product data
    const products = [
        { id: 1, name: "Scented Candle 1", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 2, name: "Scented Candle 2", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 3, name: "Scented Candle 3", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 4, name: "Scented Candle 4", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 5, name: "Scented Candle 5", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 6, name: "Scented Candle 6", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 7, name: "Scented Candle 7", description: "Natural Waxes & Essential Oils", image: Product1Img },
        { id: 8, name: "Scented Candle 8", description: "Natural Waxes & Essential Oils", image: Product1Img },
    ];

    // Handle responsive items per slide
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else if (window.innerWidth < 1204) {
                setItemsToShow(3);
            } else {
                setItemsToShow(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle next slide - proper circular sliding
    const nextSlide = () => {
        setStartIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            // If next index would go beyond array, wrap around
            return nextIndex >= products.length ? 0 : nextIndex;
        });
        setActiveIndex(null);
    };

    // Handle previous slide - proper circular sliding
    const prevSlide = () => {
        setStartIndex((prevIndex) => {
            const prevIndexCalc = prevIndex - 1;
            // If previous index is negative, wrap to end
            return prevIndexCalc < 0 ? products.length - 1 : prevIndexCalc;
        });
        setActiveIndex(null);
    };

    // Get current items to display with circular array
    const getVisibleProducts = () => {
        const visible = [];
        for (let i = 0; i < itemsToShow; i++) {
            const index = (startIndex + i) % products.length;
            visible.push(products[index]);
        }
        return visible;
    };

    // Handle opening ItemStackActive
    const handleItemClick = (index) => {
        const newActiveIndex = activeIndex === index ? null : index;
        setActiveIndex(newActiveIndex);
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        if (newActiveIndex !== null) {
            timeoutRef.current = setTimeout(() => {
                setActiveIndex(null);
            }, 5000);
        }
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeRef.current && !activeRef.current.contains(event.target)) {
                setActiveIndex(null);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const visibleProducts = getVisibleProducts();

    return (
        <div className='About-Group FreeResponsive-Group Section-Slot' id='products'>
            <h1 className='Section-Title'>Products</h1>

            <div className="Slider-Group">
                <div className="SubSlider">
                    <button className='ButtonOff2' onClick={prevSlide}>
                        <img src={LeftSvg} alt="Left" />
                    </button>

                    <div className="ItemStacks">
                        {visibleProducts.map((product, idx) => {
                            const globalIndex = (startIndex + idx) % products.length;
                            
                            return (
                                <div 
                                    key={`${product.id}-${globalIndex}`} 
                                    className="ItemStack"
                                    onClick={() => handleItemClick(globalIndex)}
                                    ref={activeIndex === globalIndex ? activeRef : null}
                                >
                                    <img src={product.image} alt={product.name} />
                                    <h2>{product.name}</h2>
                                    <p>{product.description}</p>
                                    <div 
                                        className="ButtonInteract"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleItemClick(globalIndex);
                                        }}
                                    >
                                        <button className='ButtonOn'>
                                            <p>Order Now</p>
                                        </button>
                                    </div>
                                    <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                                    
                                    {activeIndex === globalIndex && (
                                        <div className="ItemStackActive">
                                            <div className="ItemStackActiveItem">
                                                <img src={InstagramSvg} alt="Instagram" />
                                                <div className="ButtonInteract">
                                                    <button className='ButtonOn'>
                                                        <p>Order in Instagram</p>
                                                    </button>
                                                </div>
                                                <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                                            </div>
                                            <div className="hr-line-y"></div>
                                            <div className="ItemStackActiveItem">
                                                <img src={EbaySvg} alt="eBay" />
                                                <div className="ButtonInteract">
                                                    <button className='ButtonOn'>
                                                        <p>Order in EBay</p>
                                                    </button>
                                                </div>
                                                <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button className='ButtonOff2' onClick={nextSlide}>
                        <img src={RightSvg} alt="Right" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Products