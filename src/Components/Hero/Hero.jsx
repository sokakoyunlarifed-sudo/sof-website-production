import React from 'react'
import HeroImg from '../../Assets/blog/Boyalicocuk.jpg'
const Hero = () => {
  return (
    <>
    <main className='bg-white dark:bg-gray-950 dark:text-white duration-300'>
    <div className="container min-h-[620px] flex mt-10 sm:mt-0">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 place-items-center'>
            {/* Image Section */}
            <div data-aos="zoom-in" className='order-1 sm:order-2 relative'>
                <img src={HeroImg} alt="" />
                <div data-aos='slide-right' data-aos-delay="300" className='bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-md absolute -bottom-5 right-0 sm:-right-8 '>
                    <p>⭐ Etkinlikler</p>
                    <h1 className='font-bold'> 600+ <span className='font-normal'>Yapıldı!</span></h1>
                </div>
            </div>                
            {/* Text content section*/}
            <div className='space-y-5 order2 sm:order-1 xl:pr-10'>
                <h1 data-aos="fade-up" className='text-4xl sm:text-5xl font-smibold'>Sokak oyunlarını <span className='text-primary'>gelecek nesillere</span> taşıyoruz.</h1>
                <p data-aos="fade-up" data-aos-delay="300">
                    Sokak Oyunları Federasyonu, kültürümüzün en değerli miraslarından biri olan sokak oyunlarını yaşatmak ve gelecek nesillere aktarmak için kurulmuştur. Çocuklarımızın hem eğlenerek vakit geçirmesini hem de birlikte hareket ederek dostluk, dayanışma ve paylaşma gibi değerleri öğrenmesini hedefliyoruz. Düzenlediğimiz turnuvalar, etkinlikler ve eğitim programlarıyla unutulmaya yüz tutmuş oyunlarımızı yeniden canlandırıyor, ülkemizin dört bir yanında gençleri ve yetişkinleri bu kültürün etrafında bir araya getiriyoruz
                </p>
                <button data-aos="fade-up" data-aos-delay="500" className='btn-primary transition-all duration-300'>Get Started</button>
            </div>
            
            </div>
        </div>
    
    </main>
    </>
  )
}

export default Hero