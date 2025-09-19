import React from "react";
import { useParams, Link } from "react-router-dom";
import newsData from "../data/haberler.json";
import Layout from "./Layout";
import { FcCalendar } from "react-icons/fc";
const HaberDetail = () => {
  const { id } = useParams();
  const haber = newsData.find((item) => item.id === parseInt(id));

  if (!haber) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold">Haber bulunamadı</h1>
          <Link to="/haberler" className="text-blue-600 underline">
            Haberler sayfasına dön
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="bg-white dark:bg-gray-950 dark:text-white duration-300">
        <div className="container min-h-[620px] flex flex-col mt-10 sm:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 place-items-center">
            {/* Görsel */}
            <div data-aos="zoom-in" className="order-1 sm:order-2 relative">
              <img
                src={haber.image}
                alt={haber.title}
                className="rounded-lg shadow-lg"
              />
              <div
  data-aos="slide-right"
  data-aos-delay="300"
  className="bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-md absolute -bottom-5 right-0 sm:-right-8"
>
  <div className="flex items-center gap-2">
    <FcCalendar className="text-lg" />
    <span>{haber.date}</span>
  </div>
</div>

            </div>

            {/* Metin */}
            <div className="space-y-5 order-2 sm:order-1 xl:pr-10">
              <h1
                data-aos="fade-up"
                className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100"
              >
                {haber.title}
              </h1>
              <p
                data-aos="fade-up"
                data-aos-delay="300"
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {haber.fullText}
              </p>
              <Link
                to="/haberler"
                data-aos="fade-up"
                data-aos-delay="500"
                className="btn-primary inline-block"
              >
                ← Haberler listesine dön
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default HaberDetail;
