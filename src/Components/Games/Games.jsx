import React from 'react'
import Slider from "react-slick"
import oyun1 from "../../assets/Games/Cuval.jpg"
import oyun2 from "../../assets/games/ipcekme.jpg"
import oyun3 from "../../assets/games/ipatlama.jpg"
import oyun4 from "../../assets/games/Seksek.jpg"
import { useLocation } from "react-router-dom"
{/* Data for games */}
const gamesData = [
  {
    id: 1,
    name: "Çuval Koşusu",   // Çuval Yarışı yerine daha yaygın kullanılan
    text: "Çuval koşusu, özellikle köy düğünleri, bayramlar ve şenliklerde oynanan eğlenceli bir oyundur. Çocukların ve gençlerin çuval içine girerek zıplayıp yarışı tamamlaması hem eğlenceyi hem de topluluk ruhunu yansıtır. Türk kültüründe birlik, neşe ve dostluğun simgelerinden biridir.",
    img: oyun1,
  },
  {
    id: 2,
    name: "Halat Çekme",   // İp Çekme yerine geleneksel ismi
    text: "Halat çekme oyunu, iki takımın güç ve dayanışmasını ölçen geleneksel bir mücadeledir. Anadolu’nun pek çok köyünde şenliklerin vazgeçilmez oyunlarındandır. Takım ruhunu, stratejiyi ve dayanışmayı öne çıkarır; aynı zamanda geçmişten günümüze gelen en popüler sokak oyunlarından biridir.",
    img: oyun2,
  },
  {
    id: 3,
    name: "İp Atlama",   // Bu zaten doğru, halk arasında da böyle biliniyor
    text: "İp atlama, çocukların hem tek başına hem de grup halinde oynadığı keyifli bir oyundur. Özellikle kız çocuklarının sokakta vakit geçirirken tercih ettiği oyunlardan biri olmuştur. Türk kültüründe çocukların fiziksel gelişimini desteklemiş, ritim ve koordinasyon becerilerini güçlendirmiştir.",
    img: oyun3,
  },
  {
    id: 4,
    name: "Seksek",   // Bu da doğru ve geleneksel ismi bu
    text: "Seksek, yere çizilen şekiller üzerine taş atılarak oynanan, denge ve dikkat gerektiren geleneksel bir oyundur. Yüzyıllardır Anadolu’nun sokaklarında oynanan bu oyun, çocukların hem eğlenmesini hem de el-göz koordinasyonu geliştirmesini sağlamıştır. Türk kültüründe eğlence ile eğitimin birleştiği en bilindik oyunlardan biridir.",
    img: oyun4,
  },
];

{/* Slider settings */}
const Games = () => {
    const location = useLocation()

    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        cssEase: "linear",
        pauseOnHover: true,
        pauseOnFocus: true,
    accessibility: false, // aria-hidden uyarısını kapatır
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1 }
    }
  ]
    };
  return (
    <>
    <div className='py-10 dark:text-white'>
        <div data-aos="fade-up" className="container">{/* Gaming Section */}
            <div className='grid grid-cols-1 max-w-screen-xl mx-auto gap-6 '>
                <Slider {...settings}>
                    {gamesData.map(({id,name,text,img}) => (
                        <div key={id} className='my-6'> 
                        <div className='flex flex-col sm:flex-row gap-5 md:gap-14 p-4 mx-4 rounded-xl dark:bg-gray-800 relative'>
                            <img src={img} alt="name"
                            className='block mx-auto h-[300px] w-full sm:2-[200px] object-cover' />
                       <div className='space-y-4'>
                            <p className='text-gray-500 text-black/80 dark:text-white/80 xl:pr-40'>{text}</p>
                            <h1 className='text-xl font-bold'>{name}</h1>
                        </div> 
                        <p className='text-black/10 text-[12rem] font-serif absolute bottom-0 right-0'>
                        ,,
                        </p>
                        </div>
                        </div>
                    ))}

                </Slider>
            </div>
        
        </div>
    </div>
    </>
  )
}

export default Games