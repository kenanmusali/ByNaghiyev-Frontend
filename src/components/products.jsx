import React, { useState, useEffect, useRef } from 'react'
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"
import BgBodySvg from "../assets/svg/bg-body1.svg"
import { useLanguage } from '../context/LanguageContext.jsx';

const Products = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [products, setProducts] = useState([]);
    const [sectionTitle, setSectionTitle] = useState({ en: 'Products', az: 'Məhsullar' });
    const [orderNowText, setOrderNowText] = useState({ en: 'Order Now', az: 'Sifariş Et' });
    const [orderInstagramText, setOrderInstagramText] = useState({ en: 'Order in Instagram', az: 'Instagram-da Sifariş Et' });
    const [orderEbayText, setOrderEbayText] = useState({ en: 'Order in EBay', az: 'EBay-da Sifariş Et' });
 const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const activeRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                setLoading(true);
                const timestamp = new Date().getTime();
                const response = await fetch(`https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/product-data.json?_=${timestamp}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products data');
                }
                
                const data = await response.json();
                
                if (data.products) setProducts(data.products);
                if (data.sectionTitle) setSectionTitle(data.sectionTitle);
                if (data.orderNowText) setOrderNowText(data.orderNowText);
                if (data.orderInstagramText) setOrderInstagramText(data.orderInstagramText);
                if (data.orderEbayText) setOrderEbayText(data.orderEbayText);
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProductsData();
    }, []);

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
            return nextIndex >= products.length ? 0 : nextIndex;
        });
        setActiveIndex(null);
    };

    // Handle previous slide - proper circular sliding
    const prevSlide = () => {
        setStartIndex((prevIndex) => {
            const prevIndexCalc = prevIndex - 1;
            return prevIndexCalc < 0 ? products.length - 1 : prevIndexCalc;
        });
        setActiveIndex(null);
    };

    // Get current items to display with circular array
    const getVisibleProducts = () => {
        if (products.length === 0) return [];
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
            }, 50000);
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

    if (loading) {
        return (
            <div className='About-Group FreeResponsive-Group Section-Slot' id='products'>
                <h1 className='Section-Title'>{sectionTitle[language]}</h1>
                <div className="loading-container">
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='About-Group FreeResponsive-Group Section-Slot' id='products'>
                <h1 className='Section-Title'>{sectionTitle[language]}</h1>
                <div className="error-container">
                    <p>Error loading products: {error}</p>
                </div>
            </div>
        );
    }

    const visibleProducts = getVisibleProducts();

    return (
        <div className='About-Group FreeResponsive-Group Section-Slot' id='products'>
            <h1 className='Section-Title'>{sectionTitle[language]}</h1>

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
                                    <img src={product.image} alt={product.name[language]} />
                                    <h2>{product.name[language]}</h2>
                                    <p>{product.description[language]}</p>
                                    <div 
                                        className="ButtonInteract"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleItemClick(globalIndex);
                                        }}
                                    >
                                        <button className='ButtonOn'>
                                            <p>{orderNowText[language]}</p>
                                        </button>
                                    </div>
                                    <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                                    
                                    {activeIndex === globalIndex && (
                                        <div className="ItemStackActive">
                                            <div className="ItemStackActiveItem">
                                                <img src={product.instagramIcon} alt="Instagram" />
                                                <div className="ButtonInteract">
                                                    <button className='ButtonOn'>
                                                        <p>{orderInstagramText[language]}</p>
                                                    </button>
                                                </div>
                                                <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
                                            </div>
                                            <div className="hr-line-y"></div>
                                            <div className="ItemStackActiveItem">
                                                <img src={product.ebayIcon} alt="eBay" />
                                                <div className="ButtonInteract">
                                                    <button className='ButtonOn'>
                                                        <p>{orderEbayText[language]}</p>
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