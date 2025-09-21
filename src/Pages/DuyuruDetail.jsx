import React from "react";
import { useParams, Link } from "react-router-dom";
// import duyuruData from "../data/duyurular.json";
import Layout from "./Layout";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { fetchAnnouncementById } from "../services/adminApi";

const DuyuruDetail = () => {
  const { id } = useParams();
  const [duyuru, setDuyuru] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchAnnouncementById(id)
        if (mounted) setDuyuru(data)
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
          <h1 className="text-2xl font-bold">Duyuru bulunamadı</h1>
          <Link to="/duyurular" className="text-blue-600 underline">
            Duyurular sayfasına dön
          </Link>
        </div>
      </Layout>
    );
  }

  if (!duyuru) {
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
                src={duyuru.image}
                alt={duyuru.title}
                className="rounded-lg shadow-lg"
              />
              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-md absolute -bottom-5 right-0 sm:-right-8"
              >
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaCalendarAlt /> <span>{duyuru.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaMapMarkerAlt /> <span>{duyuru.location}</span>
                </div>
              </div>
            </div>

            {/* Metin */}
            <div className="space-y-5 order-2 sm:order-1 xl:pr-10">
              <h1 className="text-3xl font-bold">{duyuru.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {duyuru.description}
              </p>
              <div className="mt-4">
                <Link
                  to="/duyurular"
                  className="inline-block text-primary hover:underline"
                >
                  Tüm duyurular
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default DuyuruDetail;
