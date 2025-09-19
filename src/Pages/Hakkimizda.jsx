import React from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import Logo from "../assets/Website/logo.png";
const Hakkimizda = () => {
  return (
    <Layout>
      <section className="bg-gray-100 dark:bg-gray-900 dark:text-white body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          {/* Sol taraf: Logo */}
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 flex justify-center">
            <img
              className="object-contain w-64 h-64 rounded-full shadow-lg bg-white p-4"
              alt="Federasyon Logosu"
              src={Logo} // logoyu public/logo.png içine koy
            />
          </div>

          {/* Sağ taraf: Metin */}
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="sm:text-4xl text-3xl mb-4 font-bold">
              Sokak Oyunları Federasyonu
            </h1>
            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
              Kültürümüzün en değerli miraslarından biri olan sokak oyunlarını
              yaşatmak ve gelecek nesillere aktarmak amacıyla kurulan
              federasyonumuz, turnuvalar, etkinlikler ve eğitim programlarıyla
              çocuklarımızı hem eğlendirmeyi hem de kültürel bağlarını
              güçlendirmeyi hedeflemektedir.
            </p>

            <div className="flex justify-center gap-4"><Link
  to="/"
  className="btn-primary inline-flex items-center justify-center"
>
  Daha Fazla
</Link>
              <Link
                to="/iletisim"
                className="inline-flex items-center px-6 py-2 rounded text-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Hakkimizda;
