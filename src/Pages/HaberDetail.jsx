import React from "react";
import { useParams, Link } from "react-router-dom";
// import newsData from "../data/haberler.json";
import Layout from "./Layout";
import { FcCalendar } from "react-icons/fc";
import { useEffect, useState } from "react";
import { fetchNewsById } from "../services/adminApi";
const HaberDetail = () => {
  const { id } = useParams();
  const [haber, setHaber] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchNewsById(id)
        if (mounted) setHaber(data)
      } catch (_e) {
        if (mounted) setNotFound(true)
      }
    })()
    return () => { mounted = false }
  }, [id])

  if (notFound) {
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

  if (!haber) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold">Yükleniyor...</h1>
        </div>
      </Layout>
    )
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
              <h1 className="text-3xl font-bold">{haber.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {haber.fullText}
              </p>
              <div className="mt-4">
                <Link
                  to="/haberler"
                  className="inline-block text-primary hover:underline"
                >
                  Tüm haberler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default HaberDetail;
