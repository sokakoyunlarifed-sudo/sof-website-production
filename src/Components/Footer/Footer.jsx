import React from 'react'
import {
  FaInstagram, FaFacebookF, FaTwitter, FaYoutube,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope
} from 'react-icons/fa'
import Logo from '../../assets/Website/Logo.png'

// Menü linkleri
const FooterLinks = [
  { id: 1, name: "Anasayfa", link: "/" },
  { id: 2, name: "Haberler", link: "/haberler" },
  { id: 3, name: "Duyurular", link: "/duyurular" },
  { id: 4, name: "Kurullar", link: "/kurullar" },
  { id: 5, name: "İletişim", link: "/iletisim" },
  { id: 6, name: "Hakkımızda", link: "/hakkimizda" },
]

// İletişim bilgileri
const ContactInfo = [
  { id: 1, icon: <FaMapMarkerAlt />, text: "Ankara, Türkiye" },
  { id: 2, icon: <FaPhoneAlt />, text: "+90 312 123 45 67" },
  { id: 3, icon: <FaEnvelope />, text: "info@sof.web.tr" },
]

// Sosyal medya linkleri
const SocialLinks = [
  { id: 1, icon: <FaInstagram />, link: "https://www.instagram.com/sokakoyunlarifed?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
  { id: 2, icon: <FaFacebookF />, link: "https://m.facebook.com/100070227283707/" },
  { id: 3, icon: <FaTwitter />, link: "https://x.com/SokakoyunlarFed" },
  { id: 4, icon: <FaYoutube />, link: "https://www.youtube.com/@sokakoyunlarfederasyonu3268" },
]

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black dark:text-white duration-300">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* Sol: Logo + açıklama */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={Logo} alt="logo" className="w-12" />
            <h4 className="text-xl sm:text-2xl font-semibold">Sokak Oyunları Federasyonu</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Geleneksel oyunlarımızı yaşatmak ve gelecek nesillere aktarmak için çalışıyoruz.
          </p>
        </div>

        {/* Orta: Menü */}
        <div>
          <h5 className="text-lg font-semibold mb-3">Menü</h5>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {FooterLinks.map(({ id, name, link }) => (
              <li key={id}>
                <a href={link} className="hover:text-primary transition">{name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sağ: İletişim + sosyal medya */}
        <div>
          <h5 className="text-lg font-semibold mb-3">İletişim</h5>
          <ul className="space-y-2 text-sm">
            {ContactInfo.map(({ id, icon, text }) => (
              <li key={id} className="flex items-center gap-2">
                {icon} <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 mt-4 text-lg">
            {SocialLinks.map(({ id, icon, link }) => (
              <a
                key={id}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition hover:-translate-y-1"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Alt copyright */}
      <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-700 py-4">
        © {new Date().getFullYear()} Sokak Oyunları Federasyonu — Tüm hakları saklıdır.
      </div>
    </footer>
  )
}

export default Footer
