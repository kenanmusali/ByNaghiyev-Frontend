import React, { useState, useEffect } from 'react'
import MenuSvg from "../assets/svg/menu.svg"
import CloseSvg from "../assets/svg/close.svg"
import { useLanguage } from '../context/LanguageContext.jsx'

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState("auto")
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024)
  
  const [logos, setLogos] = useState({})
  const [icons, setIcons] = useState({})
  const [navItems, setNavItems] = useState([])
  const [mobileNavItems, setMobileNavItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        setLoading(true)
        const timestamp = new Date().getTime()
        const response = await fetch(`https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/navbar-data.json?_=${timestamp}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch navbar data')
        }
        
        const data = await response.json()
        
        if (data.logos) setLogos(data.logos)
        if (data.icons) setIcons(data.icons)
        if (data.navItems) setNavItems(data.navItems)
        if (data.mobileNavItems) setMobileNavItems(data.mobileNavItems)
        
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
        console.error('Error fetching navbar:', err)
      }
    }

    fetchNavbarData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 1024) {
        setScrolled(window.scrollY > 50)
      }
    }
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const logoToShow = (!isDesktop || (isDesktop && scrolled)) ? logos.logo : logos.logoText

  const scrollFourTimes = (id) => {
    const section = document.getElementById(id)
    if (!section) return

    if (window.scrollTimeouts) {
      window.scrollTimeouts.forEach(timeout => clearTimeout(timeout))
    }
    
    window.scrollTimeouts = []

    for (let i = 0; i < 7; i++) {
      const timeoutId = setTimeout(() => {
        section.scrollIntoView({ 
          behavior: 'smooth', 
          block: window.innerWidth > 1024 ? 'end' : 'start'
        })
        
        if (i === 6 && window.innerWidth < 1024) {
          setTimeout(() => {
            window.scrollBy({
              top: -110,
              behavior: 'smooth'
            })
          }, 50)
        }
      }, i * 200)
      
      window.scrollTimeouts.push(timeoutId)
    }

    setMenuOpen(false)
  }

  const handleNavClick = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    scrollFourTimes(id)
  }

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
  }

  if (loading) {
    return (
      <div className="Navbar-Group">
        <div className="loading-container">
          <p>Loading navigation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="Navbar-Group">
        <div className="error-container">
          <p>Error loading navigation: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`Navbar-Group ${isDesktop && scrolled ? 'scrolled' : ''}`}>
        <div 
          className="Navbar-Items-Menu Items-Left" 
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          <img src={menuOpen ? icons.close : icons.menu} alt="Menu" />
          <p>MENU</p>
        </div>

        <div className="Navbar-Items Items-Left">
          {navItems.map((item) => (
            <p key={item.id} onClick={(e) => handleNavClick(e, item.sectionId)}>
              {item.label[language]}
            </p>
          ))}
        </div>

        <p className="Navbar-Items Items-Center" onClick={(e) => handleNavClick(e, 'home')}>
          <img className='Navbar-Logo' src={logoToShow} alt="logo" />
        </p>

        <div className="Navbar-Items Items-Right">
          <div className="Navbar-i18n">
            <img
              src={icons.azFlag}
              onClick={(e) => {
                e.stopPropagation()
                handleLanguageChange("az")
              }}
              className={language === "az" ? "lang-active" : "lang-inactive"}
              alt="AZ"
            />
            <img
              src={icons.enFlag}
              onClick={(e) => {
                e.stopPropagation()
                handleLanguageChange("en")
              }}
              className={language === "en" ? "lang-active" : "lang-inactive"}
              alt="EN"
            />
          </div>
          <div className="Navbar-Theme">
            <img
              src={icons.autoTheme}
              onClick={(e) => {
                e.stopPropagation()
                setTheme("auto")
              }}
              className={theme === "auto" ? "theme-active" : "theme-inactive"}
              alt="Auto"
            />
            <img
              src={icons.lightTheme}
              onClick={(e) => {
                e.stopPropagation()
                setTheme("light")
              }}
              className={theme === "light" ? "theme-active" : "theme-inactive"}
              alt="Light"
            />
            <img
              src={icons.darkTheme}
              onClick={(e) => {
                e.stopPropagation()
                setTheme("dark")
              }}
              className={theme === "dark" ? "theme-active" : "theme-inactive"}
              alt="Dark"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-fixed ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {mobileNavItems.map((item) => (
            <p key={item.id} onClick={(e) => handleNavClick(e, item.sectionId)}>
              {item.label[language]}
            </p>
          ))}

          <div className="mobile-menu-bottom">
            <div className="Navbar-i18n">
              <img
                src={icons.azFlag}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLanguageChange("az")
                  setMenuOpen(false)
                }}
                className={language === "az" ? "lang-active" : "lang-inactive"}
                alt="AZ"
              />
              <img
                src={icons.enFlag}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLanguageChange("en")
                  setMenuOpen(false)
                }}
                className={language === "en" ? "lang-active" : "lang-inactive"}
                alt="EN"
              />
            </div>
            <div className="Navbar-Theme">
              <img
                src={icons.autoTheme}
                onClick={(e) => {
                  e.stopPropagation()
                  setTheme("auto")
                  setMenuOpen(false)
                }}
                className={theme === "auto" ? "theme-active" : "theme-inactive"}
                alt="Auto"
              />
              <img
                src={icons.lightTheme}
                onClick={(e) => {
                  e.stopPropagation()
                  setTheme("light")
                  setMenuOpen(false)
                }}
                className={theme === "light" ? "theme-active" : "theme-inactive"}
                alt="Light"
              />
              <img
                src={icons.darkTheme}
                onClick={(e) => {
                  e.stopPropagation()
                  setTheme("dark")
                  setMenuOpen(false)
                }}
                className={theme === "dark" ? "theme-active" : "theme-inactive"}
                alt="Dark"
              />
            </div>
          </div>
          <img className='bgPattern' src={icons.bgPattern} alt="background pattern" />
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}

export default Navbar