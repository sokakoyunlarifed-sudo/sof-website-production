import React, { useState } from 'react'
import Logo from '../../assets/Website/Logo.png'
import DarkMode from './DarkMode'
import { HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi'
import ResponsiveMenu from './ResponsiveMenu'
import { Link } from 'react-router-dom'

export const MenuLinks = [
  { id: 1, name: "Anasayfa", link: "/" },
  { id: 2, name: "Haberler", link: "/haberler" },
  { id: 3, name: "Duyurular", link: "/duyurular" },
  { id: 4, name: "Kurullar", link: "/kurullar" },
  { id: 5, name: "İletişim", link: "/iletisim" },
  { id: 6, name: "Hakkımızda", link: "/hakkimizda" },
]

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)

  return (
    <nav className="bg-white dark:bg-black dark:text-white duration-300">
      <div className="container mx-auto px-4 py-3 md:py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="logo" className="w-12" />
            <span className="text-2xl sm:text-3xl font-semibold">Sokak Oyunları</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {MenuLinks.map(({ id, name, link }) => (
                <li key={id} className="cursor-pointer py-4">
                  <Link
                    to={link}
                    className="text-lg font-medium hover:text-primary py-2 hover:border-b-2 hover:border-primary transition-all duration-300"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
            <button className="btn-primary">Turnuva Kayıt</button>
            <DarkMode />
          </div>

          {/* Mobile view */}
          <div className="flex items-center gap-4 md:hidden">
            <DarkMode />
            {showMenu ? (
              <HiMenuAlt1 onClick={toggleMenu} className="cursor-pointer text-2xl" />
            ) : (
              <HiMenuAlt3 onClick={toggleMenu} className="cursor-pointer text-2xl" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ResponsiveMenu showMenu={showMenu} />
    </nav>
  )
}
