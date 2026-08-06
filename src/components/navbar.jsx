import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

/* ── Hex shade helper ────────────────────────────────────────────── */
const adjustHex = (hex, amount) => {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

const DEFAULT_GREEN = '#1F4A44'
let baseGreenColor = DEFAULT_GREEN

const LIGHT_GREEN_FILTER =
  'brightness(0) saturate(100%) invert(22%) sepia(39%) saturate(579%) hue-rotate(122deg) brightness(95%) contrast(91%)'
const LIGHT_GREEN_FILTER_SOFT =
  'brightness(0) saturate(100%) invert(26%) sepia(6%) saturate(3529%) hue-rotate(122deg) brightness(88%) contrast(91%)'
const DARK_GREEN_FILTER =
  'brightness(0) saturate(100%) invert(48%) sepia(18%) saturate(650%) hue-rotate(122deg) brightness(98%) contrast(88%)'
const DARK_GREEN_FILTER_SOFT =
  'brightness(0) saturate(100%) invert(52%) sepia(12%) saturate(700%) hue-rotate(122deg) brightness(98%) contrast(88%)'

/* Apply --green-color (and gradient) to the document root */
const applyGreenColor = (hex, themeMode) => {
  if (hex && /^#[0-9a-fA-F]{6}$/.test(hex)) {
    baseGreenColor = hex
  }

  const root = document.documentElement
  const mode =
    themeMode ||
    root.dataset.theme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  const activeGreen = mode === 'dark' ? adjustHex(baseGreenColor, 58) : baseGreenColor

  root.style.setProperty('--green-color', activeGreen)
  root.style.setProperty(
    '--green-gradient-primary',
    `linear-gradient(180deg, ${adjustHex(activeGreen, 30)} 0%, ${activeGreen} 100%)`
  )
  /* Navbar keeps the original brand green in every theme */
  root.style.setProperty('--navbar-green-color', baseGreenColor)
  root.style.setProperty(
    '--navbar-green-gradient',
    `linear-gradient(180deg, ${adjustHex(baseGreenColor, 30)} 0%, ${baseGreenColor} 100%)`
  )
  root.style.setProperty(
    '--green-filter-color',
    mode === 'dark' ? DARK_GREEN_FILTER : LIGHT_GREEN_FILTER
  )
  root.style.setProperty(
    '--green-filter',
    mode === 'dark' ? DARK_GREEN_FILTER_SOFT : LIGHT_GREEN_FILTER_SOFT
  )
}

const Navbar = () => {
  const { language, setLanguage } = useLanguage()
  const [theme, setTheme] = useState('auto')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024)

  const [logos, setLogos] = useState({})
  const [icons, setIcons] = useState({})
  const [navItems, setNavItems] = useState([])
  const [mobileNavItems, setMobileNavItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ── Theme helpers ── */
  const applyTheme = (themeMode) => {
    const root = document.documentElement
    root.dataset.theme = themeMode
    if (themeMode === 'dark') {
      root.style.setProperty('--black-color', '#ffffff')
            root.style.setProperty('--dim-bg-color', '#0a0a0a')
            root.style.setProperty('--invert-filter', 'invert(1)')
      root.style.setProperty('--white-color', '#000000')
      root.style.setProperty('--lime-color', '#1a2a28')
      root.style.setProperty('--shadow-soft', '0px 2px 5px 0px rgba(0, 0, 0, 0.15)')
      root.style.setProperty('--drop-shadow-soft', 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.15))')
      root.style.setProperty('--drop-shadow-soft-hover', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.45))')
      root.style.setProperty('--black-filter', 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7434%) hue-rotate(16deg) brightness(110%) contrast(101%)')
      root.style.setProperty('--white-filter', 'brightness(0) saturate(100%) invert(0%) sepia(20%) saturate(2546%) hue-rotate(235deg) brightness(84%) contrast(100%)')
    } else {
      root.style.setProperty('--black-color', '#000000')
      root.style.setProperty('--dim-bg-color', '#ffffff')

      root.style.setProperty('--white-color', '#ffffff')
      root.style.setProperty('--invert-filter', 'invert(0)')
      root.style.setProperty('--lime-color', '#F2FDFB')
      root.style.setProperty('--shadow-soft', '0px 2px 5px 0px rgba(0, 0, 0, 0.15)')
      root.style.setProperty('--drop-shadow-soft', 'drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.15))')
      root.style.setProperty('--drop-shadow-soft-hover', 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.45))')
      root.style.setProperty('--black-filter', 'brightness(0) saturate(100%) invert(0%) sepia(20%) saturate(2546%) hue-rotate(235deg) brightness(84%) contrast(100%)')
      root.style.setProperty('--white-filter', 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7434%) hue-rotate(16deg) brightness(110%) contrast(101%)')
    }

    applyGreenColor(null, themeMode)
  }

  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  /* Load saved theme */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference')
    if (savedTheme && ['auto', 'light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      localStorage.setItem('theme-preference', 'auto')
    }
  }, [])

  /* Apply theme on change */
  useEffect(() => {
    const activeTheme = theme === 'auto' ? getSystemTheme() : theme
    applyTheme(activeTheme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => { if (theme === 'auto') applyTheme(getSystemTheme()) }
    mediaQuery.addEventListener('change', onSystemChange)
    return () => mediaQuery.removeEventListener('change', onSystemChange)
  }, [theme])

  /* Fetch navbar data (includes themeColors) */
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        setLoading(true)
        const timestamp = new Date().getTime()
        const response = await fetch(
          `https://raw.githubusercontent.com/kenanmusali/ByNaghiyev-Backend/refs/heads/main/src/data/navbar-data.json?_=${timestamp}`
        )
        if (!response.ok) throw new Error('Failed to fetch navbar data')

        const data = await response.json()

        /* ── Apply brand green color from JSON ── */
        if (data.themeColors?.greenColor) {
          const pref = localStorage.getItem('theme-preference') || 'auto'
          const mode = pref === 'auto'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : pref
          applyGreenColor(data.themeColors.greenColor, mode)
        }

        if (data.logos)          setLogos(data.logos)
        if (data.icons)          setIcons(data.icons)
        if (data.navItems)       setNavItems(data.navItems)
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

  /* Scroll + resize */
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 1024) setScrolled(window.scrollY > 50)
    }
    const handleResize = () => setIsDesktop(window.innerWidth > 1024)

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

    if (window.scrollTimeouts) window.scrollTimeouts.forEach(t => clearTimeout(t))
    window.scrollTimeouts = []

    for (let i = 0; i < 7; i++) {
      const timeoutId = setTimeout(() => {
        section.scrollIntoView({
          behavior: 'smooth',
          block: window.innerWidth > 1024 ? 'end' : 'start',
        })
        if (i === 6 && window.innerWidth < 1024) {
          setTimeout(() => window.scrollBy({ top: -110, behavior: 'smooth' }), 50)
        }
      }, i * 200)
      window.scrollTimeouts.push(timeoutId)
    }

    setMenuOpen(false)
  }

  const handleNavClick = (e, id) => { e.preventDefault(); e.stopPropagation(); scrollFourTimes(id) }
  const handleLanguageChange = (newLang) => setLanguage(newLang)
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme-preference', newTheme)
  }

  if (loading) return (
    <div className="Navbar-Group">
      <div className="loading-container"><p>Loading navigation...</p></div>
    </div>
  )

  if (error) return (
    <div className="Navbar-Group">
      <div className="error-container"><p>Error loading navigation: {error}</p></div>
    </div>
  )

  return (
    <>
      <div className={`Navbar-Group ${isDesktop && scrolled ? 'scrolled' : ''}`}>
        <div
          className="Navbar-Items-Menu Items-Left"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
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
          <img className="Navbar-Logo" src={logoToShow} alt="logo" />
        </p>

        <div className="Navbar-Items Items-Right">
          <div className="Navbar-i18n">
            <img src={icons.azFlag} onClick={(e) => { e.stopPropagation(); handleLanguageChange('az') }} className={language === 'az' ? 'lang-active' : 'lang-inactive'} alt="AZ" />
            <img src={icons.enFlag} onClick={(e) => { e.stopPropagation(); handleLanguageChange('en') }} className={language === 'en' ? 'lang-active' : 'lang-inactive'} alt="EN" />
          </div>
          <div className="Navbar-Theme">
            <img src={icons.autoTheme}  onClick={(e) => { e.stopPropagation(); handleThemeChange('auto')  }} className={theme === 'auto'  ? 'theme-active' : 'theme-inactive'} alt="Auto"  />
            <img src={icons.lightTheme} onClick={(e) => { e.stopPropagation(); handleThemeChange('light') }} className={theme === 'light' ? 'theme-active' : 'theme-inactive'} alt="Light" />
            <img src={icons.darkTheme}  onClick={(e) => { e.stopPropagation(); handleThemeChange('dark')  }} className={theme === 'dark'  ? 'theme-active' : 'theme-inactive'} alt="Dark"  />
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
              <img src={icons.azFlag} onClick={(e) => { e.stopPropagation(); handleLanguageChange('az'); setMenuOpen(false) }} className={language === 'az' ? 'lang-active' : 'lang-inactive'} alt="AZ" />
              <img src={icons.enFlag} onClick={(e) => { e.stopPropagation(); handleLanguageChange('en'); setMenuOpen(false) }} className={language === 'en' ? 'lang-active' : 'lang-inactive'} alt="EN" />
            </div>
            <div className="Navbar-Theme">
              <img src={icons.autoTheme}  onClick={(e) => { e.stopPropagation(); handleThemeChange('auto');  setMenuOpen(false) }} className={theme === 'auto'  ? 'theme-active' : 'theme-inactive'} alt="Auto"  />
              <img src={icons.lightTheme} onClick={(e) => { e.stopPropagation(); handleThemeChange('light'); setMenuOpen(false) }} className={theme === 'light' ? 'theme-active' : 'theme-inactive'} alt="Light" />
              <img src={icons.darkTheme}  onClick={(e) => { e.stopPropagation(); handleThemeChange('dark');  setMenuOpen(false) }} className={theme === 'dark'  ? 'theme-active' : 'theme-inactive'} alt="Dark"  />
            </div>
          </div>
          <img className="bgPattern" src={icons.bgPattern} alt="background pattern" />
        </div>
      </div>

      {menuOpen && <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />}
    </>
  )
}

export default Navbar