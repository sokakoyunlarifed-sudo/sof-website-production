import React from 'react'
import { FaGamepad, FaRunning, FaWheelchair, FaTrophy, FaHandsHelping, FaHome } from "react-icons/fa";

const BrandLogo = () => {
  return (
    <>
    <div className='dark:bg-gray-900 dark:text-white'>
    <div className='container py-12 '>
        <h1 data-aos="fade-up" className='text-center'> Sokak oyunlarıyla <span className="text-primary">geleneklerimizi</span> yaşatıyoruz</h1>
        <div data-aos="fade-up" data-aos-delay="300" className='flex flex-wrap animate-marquee items-center justify-evenly gap-3 py-6 md:px-100'>
            <FaGamepad />
    <FaRunning />
    <FaWheelchair />
    <FaTrophy />
    <FaHandsHelping />
    <FaHome />
        </div>
    </div>
    </div>
    </>
  )
}

export default BrandLogo