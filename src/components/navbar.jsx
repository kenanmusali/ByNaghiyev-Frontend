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

  // Apply theme to root element
  const applyTheme = (themeMode) => {
    const root = document.documentElement
    
    if (themeMode === 'dark') {
      root.style.setProperty('--black-color', '#ffffff')
      root.style.setProperty('--white-color', '#000000')
      root.style.setProperty('--green-color', '#2b655d')
      root.style.setProperty('--lime-color', '#1a2a28')
      root.style.setProperty('--green-filter-color', 'brightness(0) saturate(100%) invert(70%) sepia(30%) saturate(400%) hue-rotate(122deg) brightness(95%) contrast(91%)')
      root.style.setProperty('--green-gradient-primary', 'linear-gradient(180deg, #1a4a44 0%, #0f302a 100%)')
      root.style.setProperty('--shadow-soft', '0px 2px 5px 0px rgba(0, 0, 0, 0.15)')
      root.style.setProperty('--drop-shadow-soft', 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.15))')
      root.style.setProperty('--drop-shadow-soft-hover', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.45))')
      root.style.setProperty(
        '--black-filter',
        'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7434%) hue-rotate(16deg) brightness(110%) contrast(101%)'
      )
      root.style.setProperty(
        '--white-filter',
        'brightness(0) saturate(100%) invert(0%) sepia(20%) saturate(2546%) hue-rotate(235deg) brightness(84%) contrast(100%)'
      )
    } else if (themeMode === 'light') {
      root.style.setProperty('--black-color', '#000000')
      root.style.setProperty('--white-color', '#ffffff')
      root.style.setProperty('--green-color', '#1F4A44')
      root.style.setProperty('--lime-color', '#F2FDFB')
      root.style.setProperty('--green-filter-color', 'brightness(0) saturate(100%) invert(22%) sepia(39%) saturate(579%) hue-rotate(122deg) brightness(95%) contrast(91%)')
      root.style.setProperty('--green-gradient-primary', 'linear-gradient(180deg, #2b655d 0%, #1F4A44 100%)')
      root.style.setProperty('--shadow-soft', '0px 2px 5px 0px rgba(0, 0, 0, 0.15)')
      root.style.setProperty('--drop-shadow-soft', 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.15))')
      root.style.setProperty('--drop-shadow-soft-hover', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.45))')
      root.style.setProperty(
        '--black-filter',
        'brightness(0) saturate(100%) invert(0%) sepia(20%) saturate(2546%) hue-rotate(235deg) brightness(84%) contrast(100%)'
      )
      root.style.setProperty(
        '--white-filter',
        'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7434%) hue-rotate(16deg) brightness(110%) contrast(101%)'
      )
    }
  }

  // Detect system theme
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference')
    if (savedTheme && (savedTheme === 'auto' || savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    } else {
      // If no saved preference, default to 'auto'
      localStorage.setItem('theme-preference', 'auto')
    }
  }, [])

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (theme === 'auto') {
        const systemTheme = getSystemTheme()
        applyTheme(systemTheme)
      } else {
        applyTheme(theme)
      }
    }

    handleThemeChange()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'auto') {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme-preference', newTheme)
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
                handleThemeChange("auto")
              }}
              className={theme === "auto" ? "theme-active" : "theme-inactive"}
              alt="Auto"
            />
            <img
              src={icons.lightTheme}
              onClick={(e) => {
                e.stopPropagation()
                handleThemeChange("light")
              }}
              className={theme === "light" ? "theme-active" : "theme-inactive"}
              alt="Light"
            />
            <img
              src={icons.darkTheme}
              onClick={(e) => {
                e.stopPropagation()
                handleThemeChange("dark")
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
                  handleThemeChange("auto")
                  setMenuOpen(false)
                }}
                className={theme === "auto" ? "theme-active" : "theme-inactive"}
                alt="Auto"
              />
              <img
                src={icons.lightTheme}
                onClick={(e) => {
                  e.stopPropagation()
                  handleThemeChange("light")
                  setMenuOpen(false)
                }}
                className={theme === "light" ? "theme-active" : "theme-inactive"}
                alt="Light"
              />
              <img
                src={icons.darkTheme}
                onClick={(e) => {
                  e.stopPropagation()
                  handleThemeChange("dark")
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