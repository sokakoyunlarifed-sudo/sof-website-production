import React, { useEffect, useState } from "react";
import Layout from "./Layout";
// import duyuruData from "../data/duyurular.json";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
// import { fetchAnnouncements } from "../services/adminApi";
import { STATIC_ANNOUNCEMENTS } from "../data/staticData";

const Duyurular = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // her sayfada kaç duyuru gösterilsin

  useEffect(() => {
    const data = Array.isArray(STATIC_ANNOUNCEMENTS) ? STATIC_ANNOUNCEMENTS : []
    // Yaklaşanlar (>= bugün) önce artan, geçmişler sonra azalan
    const today = new Date(); today.setHours(0,0,0,0)
    const sorted = [...data].sort((a, b) => {
      const da = new Date(a.date); da.setHours(0,0,0,0)
      const db = new Date(b.date); db.setHours(0,0,0,0)
      const aFuture = da >= today
      const bFuture = db >= today
      if (aFuture && !bFuture) return -1
      if (!aFuture && bFuture) return 1
      if (aFuture && bFuture) return da - db // yaklaşanlar: en yakın önce
      return db - da // geçmiş: en yeni önce
    })
    setAnnouncements(sorted)
  }, []);

  // toplam sayfa
  const totalPages = Math.ceil(announcements.length / itemsPerPage);

  // bu sayfada gösterilecek duyurular
  const paginated = announcements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // sayfa değiştir
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <section className="py-10 bg-gray-100 dark:bg-gray-900 dark:text-white min-h-[60vh]">
        <div className="container mx-auto px-6">
  <h1 className="text-3xl font-bold mb-6">Duyurular</h1>
  <p className="text-gray-600 dark:text-gray-400 mb-8">
    Gelecek etkinliklerimizi ve kayıt tarihlerini buradan takip edebilirsiniz.
  </p>

  {paginated.length === 0 ? (
    <div className="text-center text-gray-500 dark:text-gray-400 py-16">
      Şu anda görüntülenecek duyuru bulunmuyor.
    </div>
  ) : (
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {paginated.map((item, index) => (
      <Link
        to={`/duyuru/${item.id}`}
        key={item.id}
        className="group bg-white dark:bg-slate-950 rounded-lg shadow hover:shadow-lg transition overflow-hidden block"
        data-aos="fade-up"
        data-aos-delay={index * 100}
      >
        {/* Görsel */}
        <div className="overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 duration-300"
          />
        </div>

        {/* İçerik */}
        <div className="p-5 space-y-2">
          <h3 className="text-xl font-semibold line-clamp-1">
            {item.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
            {item.description}
          </p>

          <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
            <FaCalendarAlt /> <span>{item.date}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 gap-2">
            <FaMapMarkerAlt /> <span>{item.location}</span>
          </div>
        </div>
      </Link>
    ))}
  </div>
  )}

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex justify-center items-center mt-10 gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
      >
        Önceki
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => goToPage(i + 1)}
          className={`px-4 py-2 rounded ${
            currentPage === i + 1
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
      >
        Sonraki
      </button>
    </div>
  )}
  </div>
</section>

    </Layout>
  );
};

export default Duyurular;
