import React from 'react'
import { FaRunning, FaHandsHelping, FaChild, FaTrophy } from "react-icons/fa";

const skilldata = [
  {
    id: 1,
    name: "Misyonumuz",
    icon: <FaRunning className="text-primary text-4xl" />,
    link: "#",
    description: "Sokak oyunlarını yeniden canlandırarak çocuklara hareket, eğlence ve dayanışma kültürünü kazandırmak.",
    aosDelay: "0",
  },
  {
    id: 2,
    name: "Geleneklerimiz",
    icon: <FaHandsHelping className="text-primary text-4xl" />,
    link: "#",
    description: "Unutulmaya yüz tutmuş oyunları koruyarak, kültürümüzü gelecek nesillere aktarmak.",
    aosDelay: "200",
  },
  {
    id: 3,
    name: "Çocuk ve Toplum",
    icon: <FaChild className="text-primary text-4xl" />,
    link: "#",
    description: "Çocukların oyun yoluyla sosyalleşmesini, birlikte oynamayı ve paylaşmayı öğrenmesini sağlamak.",
    aosDelay: "400",
  },
  {
    id: 4,
    name: "Etkinlikler",
    icon: <FaTrophy className="text-primary text-4xl" />,
    link: "#",
    description: "Turnuvalar, festivaller ve eğitimlerle sokak oyunlarını yaşatmak ve yaygınlaştırmak.",
    aosDelay: "600",
  },
];

const Services = () => {
  return (
    <>
    <div className='bg-gray-100 dark:bg-black dark:text-white py-12 sm:grid sm:place-items-center' >
        <div className="container">
            {/* Başlık ve Açıklama Bölümü */}
            <div className='pb-12 text-center space-y-2'>
                <h1 data-aos="fade-up" className='text-3xl font-semibold text-secondary dark:text-primary'>Sokak Oyunlarını Yaşatıyoruz</h1>
                <p data-aos="fade-up" data-aos-delay="300">Geleneklerimizi koruyor, oyunları gelecek nesillere aktarıyoruz.</p>
            </div>
            {/* Card Bölümü */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
                {skilldata.map((skill) => (
                    <div
                        key={skill.id}
                        data-aos="fade-up"  
                        data-aos-delay={skill.aosDelay}
                        className="card space-y-3 sm:space-y-4 p-4"
                    >
                    <div>{skill.icon}</div>
                    <h1 className='text-lg font-semibold'>{skill.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{skill.description}</p>
                    </div>
                ))}
            </div>
            {/* Button Bölümü */}
            <div data-aos="fade-up" data-aos-delay="900" data-aos-offset="0"  className='text-center mt-4 sm:mt-8'>
                <button className="btn-primary">Daha Fazla</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Services