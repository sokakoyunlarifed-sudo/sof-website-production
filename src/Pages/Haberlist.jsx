import React, { useState, useEffect } from "react";
import Layout from "./Layout";
// import newsData from "../data/haberler.json"; // src/data/haberler.json
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchNews } from "../services/adminApi";

const Haberlist = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // her sayfada 6 haber

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchNews()
        if (mounted) setNews(data)
      } catch (e) {
        console.error("Haberler yüklenemedi:", e)
      }
    })()
    return () => { mounted = false }
  }, []);

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(news.length / itemsPerPage);

  // Şu anki sayfada gösterilecek haberler
  const paginatedNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sayfa değiştirme
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // sayfa yukarı kayar
    }
  };

  return (
    <Layout>
      <section className="py-10 bg-gray-100 dark:bg-gray-900 dark:text-white min-h-[60vh]">
        <div className="container mx-auto px-6">
  <h1 className="text-3xl font-bold mb-6">Haberler</h1>
  <p className="text-gray-600 dark:text-gray-400 mb-8">
    Burada federasyonumuzun tüm güncel haberlerini bulabilirsiniz.
  </p>

  {paginatedNews.length === 0 ? (
    <div className="text-center text-gray-500 dark:text-gray-400 py-16">
      Şu anda görüntülenecek haber bulunmuyor.
    </div>
  ) : (
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {paginatedNews.map((item, index) => (
      <Link
        to={`/haber/${item.id}`}
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
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {item.date}
          </span>
          <h3 className="text-xl font-semibold line-clamp-1">
            {item.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
            {item.shortText}
          </p>

          {/* Sağ ok */}
          <div className="flex justify-end pt-3 text-gray-500 dark:text-gray-400">
            <FaArrowRight className="group-hover:text-primary group-hover:translate-x-2 duration-300" />
          </div>
        </div>
      </Link>
    ))}
  </div>
  )}

  {/* Pagination Kontrolleri */}
  {totalPages > 1 && (
  <div className="flex justify-center items-center mt-10 gap-2">
    <button
      onClick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
    >
      Önceki
    </button>

    {/* Sayfa numaraları */}
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

export default Haberlist;
