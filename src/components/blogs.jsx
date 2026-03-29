import React, { useState, useEffect, useRef } from 'react'
import RightSvg from "../assets/svg/right.svg"
import LeftSvg from "../assets/svg/left.svg"
import BgBodySvg from "../assets/svg/bg-body1.svg"
import CloseSvg from "../assets/svg/close.svg"
import { useLanguage } from '../context/LanguageContext.jsx';

const Blogs = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(null);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [sectionTitle, setSectionTitle] = useState({ en: 'Blogs', az: 'Bloqlar' });
    const [readMoreText, setReadMoreText] = useState({ en: 'Read More', az: 'Daha Ətraflı' });
const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const activeRef = useRef(null);
    const timeoutRef = useRef(null);
    const modalRef = useRef(null);


    useEffect(() => {
    const fetchBlogs = async () => {
    try {
        setLoading(true);
        // Add cache-busting query parameter
        const timestamp = new Date().getTime();
        const response = await fetch(`https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/blog-data.json?_=${timestamp}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch blogs data');
        }
        
        const data = await response.json();
        setBlogs(data.blogs);
        if (data.sectionTitle) setSectionTitle(data.sectionTitle);
        if (data.readMoreText) setReadMoreText(data.readMoreText);
        setLoading(false);
    } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching blogs:', err);
    }
};

        fetchBlogs();
    }, []);

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

    const nextSlide = () => {
        setStartIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex >= blogs.length ? 0 : nextIndex;
        });
        setActiveIndex(null);
    };

    const prevSlide = () => {
        setStartIndex((prevIndex) => {
            const prevIndexCalc = prevIndex - 1;
            return prevIndexCalc < 0 ? blogs.length - 1 : prevIndexCalc;
        });
        setActiveIndex(null);
    };

    const getVisibleBlogs = () => {
        if (blogs.length === 0) return [];
        const visible = [];
        for (let i = 0; i < itemsToShow; i++) {
            const index = (startIndex + i) % blogs.length;
            visible.push(blogs[index]);
        }
        return visible;
    };

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedBlog(null);
        document.body.style.overflow = 'auto';
    };

    const handleModalClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal();
        }
    };

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
            <div className='About-Group FreeResponsive-Group Section-Slot' id='blogs'>
                <h1 className='Section-Title'>{sectionTitle[language]}</h1>
                <div className="loading-container">
                    <p>Loading blogs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='About-Group FreeResponsive-Group Section-Slot' id='blogs'>
                <h1 className='Section-Title'>{sectionTitle[language]}</h1>
                <div className="error-container">
                    <p>Error loading blogs: {error}</p>
                </div>
            </div>
        );
    }

    const visibleBlogs = getVisibleBlogs();

    return (
        <>
            <div className='About-Group FreeResponsive-Group Section-Slot' id='blogs'>
                <h1 className='Section-Title'>{sectionTitle[language]}</h1>

                <div className="Slider-Group">
                    <div className="SubSlider">
                        <button className='ButtonOff2' onClick={prevSlide}>
                            <img src={LeftSvg} alt="Left" />
                        </button>

                        <div className="ItemStacks">
                            {visibleBlogs.map((blog, idx) => {
                                const globalIndex = (startIndex + idx) % blogs.length;
                                
                                return (
                                    <div 
                                        key={`${blog.id}-${globalIndex}`} 
                                        className="ItemStack"
                                        onClick={() => handleBlogClick(blog)}
                                        ref={activeIndex === globalIndex ? activeRef : null}
                                    >
                                        <img src={blog.image} alt={blog.name[language]} />
                                        <h5>{blog.time[language]}</h5>
                                        <h2>{blog.name[language]}</h2>
                                        <p>{blog.description[language]}</p>
                                        <div 
                                            className="ButtonInteract"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBlogClick(blog);
                                            }}
                                        >
                                            <button className='ButtonOn'>
                                                <p>{readMoreText[language]}</p>
                                            </button>
                                        </div>
                                        <img className='ItemStackBg' src={BgBodySvg} alt="Background" />
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

            {/* Modal Popup */}
            {selectedBlog && (
                <div className="blog-modal-overlay" onClick={handleModalClickOutside}>
                    <div className="blog-modal-container" ref={modalRef}>
                        <button className="blog-modal-close" onClick={closeModal}>
                            <img src={CloseSvg} alt="Close" />
                        </button>
                        
                        <div className="blog-modal-content">
                            {/* Hero Image */}
                            <div className="blog-modal-hero">
                                <img src={selectedBlog.image} alt={selectedBlog.expandedContent.title[language]} />
                            </div>
                            
                            {/* Title and Meta */}
                            <div className="blog-modal-header">
                                <h1>{selectedBlog.expandedContent.title[language]}</h1>
                                <div className="blog-modal-meta">
                                    <span>{selectedBlog.time[language]}</span>
                                    <span>•</span>
                                    <span>{selectedBlog.name[language]}</span>
                                </div>
                            </div>
                            
                            {/* Article Content */}
                            <div className="blog-modal-body">
                                {selectedBlog.expandedContent.paragraphs[language].map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                                
                                {/* Image Gallery */}
                                <div className="blog-modal-gallery">
                                    {selectedBlog.expandedContent.images.map((img, idx) => (
                                        <div key={idx} className="blog-modal-gallery-item">
                                            <img src={img} alt={`Gallery ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Blogs