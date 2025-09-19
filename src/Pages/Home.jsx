import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Hero from '../Components/Hero/Hero'
import BrandLogo from '../Components/BrandLogo/BrandLogo'
import Services from '../Components/Services/Services'
import Games from '../Components/Games/Games'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Haberler from '../Components/Haberler/Haberler'
import Footer from '../Components/Footer/Footer'

export default function Home() {
  return (
    <div className='overflow-x-hidden bg-white dark:bg-black duration-300'>
      <Navbar />
      <Hero />
      <BrandLogo />
      <Services />
      <Games />
      <Haberler />
      <Footer />
    </div>
  )
}
