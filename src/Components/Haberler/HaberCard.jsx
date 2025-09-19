import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const HaberCard = ({ id, image, title, shortText, aosDelay }) => {
  return (
    <div
      className="dark:text-white group"
      data-aos="fade-up"
      data-aos-delay={aosDelay}
    >
      <Link
        to={`/haber/${id}`}
        className="block overflow-hidden"
      >
        <img
          src={image}
          alt={title}
          className="mx-auto h-[420px] w-full object-cover group-hover:scale-105 duration-300"
        />
        <div className="space-y-2 p-4 ml-6 bg-white dark:bg-slate-950 -translate-y-16">
          <h1 className="line-clamp-1 text-xl font-semibold">{title}</h1>
          <h1 className="line-clamp-4 text-gray-500 text-sm">{shortText}</h1>
          <div className="flex justify-end pr-4 text-gray-500">
            <FaArrowRight className="group-hover:text-primary group-hover:translate-x-2 duration-300" />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default HaberCard
