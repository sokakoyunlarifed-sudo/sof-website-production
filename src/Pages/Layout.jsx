import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'

const Layout = ({ children }) => {
  return (
    <div className="overflow-x-hidden bg-white dark:bg-black duration-300">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
