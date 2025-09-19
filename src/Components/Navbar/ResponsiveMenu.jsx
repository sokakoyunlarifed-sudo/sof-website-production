import React from 'react'
import Logo from '../../assets/Website/Logo.png'
import { MenuLinks } from './Navbar'

const ResponsiveMenu = ({ showMenu }) => {
  return (
    <div
      className={`fixed bottom-0 top-0 w-[75%] bg-white dark:bg-black transition-all duration-300 shadow-sm pt-16 px-8 bg-white dark:bg-gray-900 z-50 flex flex-col justify-between
        ${showMenu ? "left-0" : "-left-full"}`}
    >
      <div className="card ">
        {/* *Hosgeldiniz!* */}
        <div className='flex items-center justify-start gap-3'>
            <img src={Logo} alt="logo" className="w-10 h-auto" /> 
            <div><h1>Sokak Oyunları Federasyonu</h1>
            <h1 className='text-sm text-slate-500'>Resmi Websitesi</h1>
            </div>
        </div>
        {/* Menu Links */}
        <nav className="mt-12">
            <ul className="space-y-2 text-xl">{
                MenuLinks.map(({ id, name, link }) => (
                    <li key={id} className="cursor-pointer py-4">
                        <a
                            href={link}
                            className="mb-1 inline-block"
                        >   {" "}
                            {name}
                        </a>
                    </li>
                ))
                }
            </ul>
         </nav>
</div>
         {/* Footer Section */}
         <div>
            <h1>
                © 2025 Sokak Oyunları Federasyonu. Tüm hakları saklıdır.
            </h1>
         
      </div>
    </div>
  )
}

export default ResponsiveMenu
