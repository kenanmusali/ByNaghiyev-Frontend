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
    const [slideAnim, setSlideAnim] = useState('');
    const [isSliding, setIsSliding] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [sectionTitle, setSectionTitle] = useState({ en: 'Blogs', az: 'Bloqlar' });
    const [readMoreText, setReadMoreText] = useState({ en: 'Read More', az: 'Daha Ətraflı' });
const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const activeRef = useRef(null);
    const timeoutRef = useRef(null);
    const slideTimeoutRef = useRef(null);
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

    const runSlide = (direction, updateIndex) => {
        if (isSliding || blogs.length === 0) return;

        setIsSliding(true);
        setActiveIndex(null);
        setSlideAnim(direction === 'next' ? 'anim-next' : 'anim-prev');
        updateIndex();

        if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
        slideTimeoutRef.current = setTimeout(() => {
            setSlideAnim('');
            setIsSliding(false);
        }, 480);
    };

    const nextSlide = () => {
        runSlide('next', () => {
            setStartIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                return nextIndex >= blogs.length ? 0 : nextIndex;
            });
        });
    };

    const prevSlide = () => {
        runSlide('prev', () => {
            setStartIndex((prevIndex) => {
                const prevIndexCalc = prevIndex - 1;
                return prevIndexCalc < 0 ? blogs.length - 1 : prevIndexCalc;
            });
        });
    };

    useEffect(() => {
        return () => {
            if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
        };
    }, []);

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

    useEffect(() => {
        if (!selectedBlog) return
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeModal()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [selectedBlog])

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
                        <button
                            className={`ButtonOff2 Slider-Nav Slider-Nav--prev${isSliding ? ' is-busy' : ''}`}
                            onClick={prevSlide}
                            aria-label="Previous blogs"
                            disabled={isSliding}
                        >
                            <img src={LeftSvg} alt="" />
                        </button>

                        <div className={`ItemStacks ${slideAnim}`} key={`blogs-${startIndex}`}>
                            {visibleBlogs.map((blog, idx) => {
                                const globalIndex = (startIndex + idx) % blogs.length;
                                
                                return (
                                    <div 
                                        key={`${blog.id}-${startIndex}-${idx}`} 
                                        className="ItemStack"
                                        style={{ '--card-index': idx }}
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

                        <button
                            className={`ButtonOff2 Slider-Nav Slider-Nav--next${isSliding ? ' is-busy' : ''}`}
                            onClick={nextSlide}
                            aria-label="Next blogs"
                            disabled={isSliding}
                        >
                            <img src={RightSvg} alt="" />
                        </button>
                    </div>
                </div>
            </div>

            {selectedBlog && (
                <div className="blog-modal-overlay" onClick={handleModalClickOutside}>
                    <div className="blog-modal-container" ref={modalRef} role="dialog" aria-modal="true">
                        <button className="blog-modal-close" onClick={closeModal} aria-label="Close">
                            <img src={CloseSvg} alt="" />
                        </button>

                        <div className="blog-modal-frame">
                            <span className="blog-modal-corner blog-modal-corner--tl" aria-hidden="true" />
                            <span className="blog-modal-corner blog-modal-corner--tr" aria-hidden="true" />
                            <span className="blog-modal-corner blog-modal-corner--bl" aria-hidden="true" />
                            <span className="blog-modal-corner blog-modal-corner--br" aria-hidden="true" />

                            <div className="blog-modal-content">
                                <div className="blog-modal-hero">
                                    <img src={selectedBlog.image} alt={selectedBlog.expandedContent.title[language]} />
                                    <div className="blog-modal-hero-fade" aria-hidden="true" />
                                </div>

                                <div className="blog-modal-header">
                                    <div className="blog-modal-meta">
                                        <span>{selectedBlog.time[language]}</span>
                                        <span className="blog-modal-meta-dot" aria-hidden="true" />
                                        <span>{selectedBlog.name[language]}</span>
                                    </div>
                                    <h1>{selectedBlog.expandedContent.title[language]}</h1>
                                    <div className="blog-modal-ornament" aria-hidden="true">
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                </div>

                                <div className="blog-modal-body">
                                    {selectedBlog.expandedContent.paragraphs[language].map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}

                                    {selectedBlog.expandedContent.images?.length > 0 && (
                                        <div className="blog-modal-gallery">
                                            {selectedBlog.expandedContent.images.map((img, idx) => (
                                                <div key={idx} className="blog-modal-gallery-item">
                                                    <img src={img} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
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