import React, { useEffect, useState } from 'react'
// import HaberData from '../../data/haberler.json'
import HaberCard from './HaberCard'
import { Link } from 'react-router-dom'
// import { fetchNews } from '../../services/adminApi'
import { STATIC_NEWS } from '../../data/staticData'
const Haberler = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const top3 = (Array.isArray(STATIC_NEWS) ? STATIC_NEWS : []).slice(0, 3)
    setItems(top3)
  }, [])
  return (
    <>
    <div className='bg-gray-100 dark:bg-gray-900 dark:text-white py-10 pb-14'>
    <div className="container">
        <h1 data-aos="fade-up" className='my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-semibold'>Haberlerimiz</h1>
        {/* Haber kartlari*/}
       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'> {items.map((haber, idx) => (
            <HaberCard key={haber.id} {...haber} aosDelay={idx * 100} />
        ))
    }</div>
    <div className="text-center" data-aos="fade-up" data-aos-offset="0">
  <Link to="/haberler" className="btn-primary inline-block">
    Hepsine Bak
  </Link>
</div>

    </div></div>
    </>
  )
}

export default Haberler