import React, { useState, useEffect } from 'react'
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
  const [selectedColor, setSelectedColor] = useState('#1F4A44')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Helper functions
  const lighten = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };

  const darken = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };

  const getHue = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 122;
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
  };

  // Apply colors based on theme and selected color
  const applyColors = (themeMode, baseColor) => {
    const root = document.documentElement
    const color = baseColor || selectedColor
    
    if (themeMode === 'dark') {
      const darkGreen = lighten(color, 30);
      const darkLime = darken(color, 85);
      const darkGradient = `linear-gradient(180deg, ${lighten(color, 20)} 0%, ${darken(color, 30)} 100%)`;
      const darkFilter = `brightness(0) saturate(100%) invert(70%) sepia(30%) saturate(400%) hue-rotate(${getHue(color)}deg) brightness(95%) contrast(91%)`;
      
      root.style.setProperty('--green-color', darkGreen)
      root.style.setProperty('--lime-color', darkLime)
      root.style.setProperty('--green-gradient-primary', darkGradient)
      root.style.setProperty('--green-filter-color', darkFilter)
      
      root.style.setProperty('--a-green', darkGreen)
      root.style.setProperty('--a-green-dark', darken(color, 45))
      root.style.setProperty('--a-green-light', lighten(color, 20))
      root.style.setProperty('--a-lime', darkLime)
      root.style.setProperty('--a-lime-dark', darken(color, 75))
      root.style.setProperty('--a-success', darkGreen)
      root.style.setProperty('--a-success-bg', darkLime)
    } else {
      const lightGreen = color;
      const lightLime = lighten(color, 75);
      const lightGradient = `linear-gradient(180deg, ${lighten(color, 30)} 0%, ${color} 100%)`;
      const lightFilter = `brightness(0) saturate(100%) invert(22%) sepia(39%) saturate(579%) hue-rotate(${getHue(color)}deg) brightness(95%) contrast(91%)`;
      const glowGreen = `0 0 20px rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.5)`;
      
      root.style.setProperty('--green-color', lightGreen)
      root.style.setProperty('--lime-color', lightLime)
      root.style.setProperty('--green-gradient-primary', lightGradient)
      root.style.setProperty('--green-filter-color', lightFilter)
      root.style.setProperty('--glow-green', glowGreen)
      
      root.style.setProperty('--a-green', lightGreen)
      root.style.setProperty('--a-green-dark', darken(color, 15))
      root.style.setProperty('--a-green-light', lighten(color, 20))
      root.style.setProperty('--a-lime', lightLime)
      root.style.setProperty('--a-lime-dark', lighten(color, 65))
      root.style.setProperty('--a-success', lightGreen)
      root.style.setProperty('--a-success-bg', lightLime)
    }
    
    // Theme-agnostic variables
    root.style.setProperty('--shadow-soft', '0px 2px 5px 0px rgba(0, 0, 0, 0.15)')
    root.style.setProperty('--drop-shadow-soft', 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.15))')
    root.style.setProperty('--drop-shadow-soft-hover', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.45))')
    
    if (themeMode === 'dark') {
      root.style.setProperty('--black-color', '#ffffff')
      root.style.setProperty('--white-color', '#000000')
      root.style.setProperty('--black-filter', 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7434%) hue-rotate(16deg) brightness(110%) contrast(101%)')
      root.style.setProperty('--white-filter', 'brightness(0) saturate(100%) invert(0%) sepia(20%) saturate(2546%) hue-rotate(235deg) brightness(84%) contrast(100%)')
    } else {
      root.style.setProperty('--black-color', '#000000')
      root.style.setProperty('--white-color', '#ffffff')
      root.style.setProperty('--black-filter', 'brightness(0) saturate(100%) invert(0%) sepia(20%) saturate(2546%) hue-rotate(235deg) brightness(84%) contrast(100%)')
      root.style.setProperty('--white-filter', 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7434%) hue-rotate(16deg) brightness(110%) contrast(101%)')
    }
  }

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference')
    if (savedTheme && (savedTheme === 'auto' || savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    } else {
      localStorage.setItem('theme-preference', 'auto')
    }
  }, [])

  // Handle theme + color changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (theme === 'auto') {
        applyColors(getSystemTheme(), selectedColor)
      } else {
        applyColors(theme, selectedColor)
      }
    }
    handleThemeChange()
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme === 'auto') {
        applyColors(getSystemTheme(), selectedColor)
      }
    }
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme, selectedColor])

  // Fetch navbar data including selectedColor
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
        // IMPORTANT: Read the color from JSON
        if (data.selectedColor) setSelectedColor(data.selectedColor)
        
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
            window.scrollBy({ top: -110, behavior: 'smooth' })
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