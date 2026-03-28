import React, { useState, useEffect } from 'react'
import LogoSvg from "../assets/svg/logo.svg"
import LogoTextSvg from "../assets/svg/logo-text.svg"
import MenuSvg from "../assets/svg/menu.svg"
import CloseSvg from "../assets/svg/close.svg"
import AzImg from "../assets/img/az_i18n.png"
import bgSvg from "../assets/svg/bg-pattern.svg"
import EnImg from "../assets/img/en_i18n.png"
import AutoSvg from "../assets/svg/auto_theme.svg"
import LightSvg from "../assets/svg/light_theme.svg"
import DarkSvg from "../assets/svg/dark_theme.svg"

const Navbar = () => {
  const [lang, setLang] = useState("az")
  const [theme, setTheme] = useState("auto")
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024)

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

  const logoToShow = (!isDesktop || (isDesktop && scrolled)) ? LogoSvg : LogoTextSvg

  // 7x scroll with responsive block alignment
  const scrollFourTimes = (id) => {
    const section = document.getElementById(id)
    if (!section) return

    // Clear any existing timeouts
    if (window.scrollTimeouts) {
      window.scrollTimeouts.forEach(timeout => clearTimeout(timeout))
    }
    
    window.scrollTimeouts = []

    // Scroll 7 times
    for (let i = 0; i < 7; i++) {
      const timeoutId = setTimeout(() => {
        section.scrollIntoView({ 
          behavior: 'smooth', 
          block: window.innerWidth > 1024 ? 'end' : 'start'
        })
        console.log(`Scroll ${i + 1} of 7`)
        
        // On the LAST scroll (i === 6), if mobile, scroll UP 110px immediately after
        if (i === 6 && window.innerWidth < 1024) {
          setTimeout(() => {
            window.scrollBy({
              top: -110,
              behavior: 'smooth'
            })
            console.log('Scrolling up 110px on mobile')
          }, 50) // Just 50ms delay after the last scroll
        }
      }, i * 200)
      
      window.scrollTimeouts.push(timeoutId)
    }

    setMenuOpen(false)
  }

  const scrollFourTimesWithOffset = (id) => {
    const section = document.getElementById(id)
    if (!section) return

    if (window.scrollTimeouts) {
      window.scrollTimeouts.forEach(timeout => clearTimeout(timeout))
    }
    
    window.scrollTimeouts = []

    const offsets = [0, 50, 100, 150, 200, 250, 300]

    for (let i = 0; i < 7; i++) {
      const timeoutId = setTimeout(() => {
        const elementPosition = section.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - offsets[i]
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
        console.log(`Scroll ${i + 1} of 7 with offset ${offsets[i]}`)
        
        // On the LAST scroll (i === 6), if mobile, scroll UP 110px immediately after
        if (i === 6 && window.innerWidth < 1024) {
          setTimeout(() => {
            window.scrollBy({
              top: -110,
              behavior: 'smooth'
            })
            console.log('Scrolling up 110px on mobile')
          }, 50) // Just 50ms delay after the last scroll
        }
      }, i * 300)
      
      window.scrollTimeouts.push(timeoutId)
    }

    setMenuOpen(false)
  }

  const handleNavClick = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    scrollFourTimes(id)
    // scrollFourTimesWithOffset(id) // optional alternative
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
          <img src={menuOpen ? CloseSvg : MenuSvg} alt="Menu" />
          <p>MENU</p>
        </div>

        <div className="Navbar-Items Items-Left">
          <p onClick={(e) => handleNavClick(e, 'about')}>About us</p>
          <p onClick={(e) => handleNavClick(e, 'products')}>Products</p>
          <p onClick={(e) => handleNavClick(e, 'blogs')}>Blogs</p>
          <p onClick={(e) => handleNavClick(e, 'socials')}>Socials</p>
        </div>

        <p className="Navbar-Items Items-Center" onClick={(e) => handleNavClick(e, 'home')}>
          <img className='Navbar-Logo' src={logoToShow} alt="logo" />
        </p>

        <div className="Navbar-Items Items-Right">
          <div className="Navbar-i18n">
            <img
              src={AzImg}
              onClick={(e) => {
                e.stopPropagation()
                setLang("az")
              }}
              className={lang === "az" ? "lang-active" : "lang-inactive"}
              alt="AZ"
            />
            <img
              src={EnImg}
              onClick={(e) => {
                e.stopPropagation()
                setLang("en")
              }}
              className={lang === "en" ? "lang-active" : "lang-inactive"}
              alt="EN"
            />
          </div>
          <div className="Navbar-Theme">
            <img
              src={AutoSvg}
              onClick={(e) => {
                e.stopPropagation()
                setTheme("auto")
              }}
              className={theme === "auto" ? "theme-active" : "theme-inactive"}
              alt="Auto"
            />
            <img
              src={LightSvg}
              onClick={(e) => {
                e.stopPropagation()
                setTheme("light")
              }}
              className={theme === "light" ? "theme-active" : "theme-inactive"}
              alt="Light"
            />
            <img
              src={DarkSvg}
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
          <p onClick={(e) => handleNavClick(e, 'about')}>About us</p>
          <p onClick={(e) => handleNavClick(e, 'home')}>Products</p>
          <p onClick={(e) => handleNavClick(e, 'projects')}>Blogs</p>
          <p onClick={(e) => handleNavClick(e, 'socials')}>Socials</p>

          <div className="mobile-menu-bottom">
            <div className="Navbar-i18n">
              <img
                src={AzImg}
                onClick={(e) => {
                  e.stopPropagation()
                  setLang("az")
                  setMenuOpen(false)
                }}
                className={lang === "az" ? "lang-active" : "lang-inactive"}
                alt="AZ"
              />
              <img
                src={EnImg}
                onClick={(e) => {
                  e.stopPropagation()
                  setLang("en")
                  setMenuOpen(false)
                }}
                className={lang === "en" ? "lang-active" : "lang-inactive"}
                alt="EN"
              />
            </div>
            <div className="Navbar-Theme">
              <img
                src={AutoSvg}
                onClick={(e) => {
                  e.stopPropagation()
                  setTheme("auto")
                  setMenuOpen(false)
                }}
                className={theme === "auto" ? "theme-active" : "theme-inactive"}
                alt="Auto"
              />
              <img
                src={LightSvg}
                onClick={(e) => {
                  e.stopPropagation()
                  setTheme("light")
                  setMenuOpen(false)
                }}
                className={theme === "light" ? "theme-active" : "theme-inactive"}
                alt="Light"
              />
              <img
                src={DarkSvg}
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
          <img className='bgPattern' src={bgSvg} alt="background pattern" />
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}

export default Navbar