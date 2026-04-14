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
  const [colorTheme, setColorTheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Apply theme with dynamic colors from data
  const applyTheme = (themeMode) => {
    const root = document.documentElement
    
    // Get color variants from data, fallback to defaults
    const colorVariants = colorTheme?.colorVariants || {}
    const preset = colorTheme?.preset || 'green-primary'
    const selectedVariant = colorVariants[preset] || colorVariants['green-primary']
    
    const colors = themeMode === 'dark' ? selectedVariant?.dark : selectedVariant?.light

    if (colors) {
      root.style.setProperty('--black-color', colors.black)
      root.style.setProperty('--white-color', colors.white)
      root.style.setProperty('--green-color', colors.green)
      root.style.setProperty('--lime-color', colors.lime)
      root.style.setProperty('--green-gradient-primary', colors.gradient)
      
      // Filter for SVG icons (approximate filter to match primary color)
      const greenFilter = generateSvgFilter(colors.green, themeMode)
      root.style.setProperty('--green-filter-color', greenFilter)
    }
    
    // Always set these (theme-agnostic)
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

  // Simple SVG filter generator from hex color
  const generateSvgFilter = (hexColor, mode) => {
    // This is a simplified approach - in production, you might want to use a library
    // to generate accurate SVG filters for any color
    const hue = getHueFromColor(hexColor)
    
    if (mode === 'dark') {
      return `brightness(0) saturate(100%) invert(70%) sepia(30%) saturate(400%) hue-rotate(${hue}deg) brightness(95%) contrast(91%)`
    } else {
      return `brightness(0) saturate(100%) invert(22%) sepia(39%) saturate(579%) hue-rotate(${hue}deg) brightness(95%) contrast(91%)`
    }
  }

  // Extract hue from hex color
  const getHueFromColor = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 122; // default green hue
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    
    if (max !== min) {
      let d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: break;
      }
    }
    
    return Math.round(h * 360);
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
  }, [theme, colorTheme]) // Re-apply when color theme changes

  // Fetch navbar data including color theme
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
        if (data.colorTheme) setColorTheme(data.colorTheme)
        
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