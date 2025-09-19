import React from "react";
import { useParams, Link } from "react-router-dom";
import duyuruData from "../data/duyurular.json";
import Layout from "./Layout";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const DuyuruDetail = () => {
  const { id } = useParams();
  const duyuru = duyuruData.find((item) => item.id === parseInt(id));

  if (!duyuru) {
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
              <h1
                data-aos="fade-up"
                className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100"
              >
                {duyuru.title}
              </h1>
              <p
                data-aos="fade-up"
                data-aos-delay="300"
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {duyuru.description}
              </p>
              <Link
                to="/duyurular"
                data-aos="fade-up"
                data-aos-delay="500"
                className="btn-primary inline-block"
              >
                ← Duyurular listesine dön
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default DuyuruDetail;
