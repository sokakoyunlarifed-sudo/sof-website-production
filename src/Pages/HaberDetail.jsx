import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "./Layout";
import { FcCalendar } from "react-icons/fc";
import { useEffect, useState } from "react";
import { STATIC_NEWS } from "../data/staticData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

const HaberDetail = () => {
  const { id } = useParams();
  const [haber, setHaber] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const item = (Array.isArray(STATIC_NEWS) ? STATIC_NEWS : []).find((n) => String(n.id) === String(id));
    if (item) {
      setHaber(item);
      setNotFound(false);
    } else {
      setHaber(null);
      setNotFound(true);
    }
  }, [id]);

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
    );
  }

  const embedUrl = getYouTubeEmbedUrl(haber.video_url);

  const imagesToShow = Array.isArray(haber.images) && haber.images.length > 0
    ? [haber.image, ...haber.images].filter(Boolean)
    : [haber.image].filter(Boolean);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false,
  };

  return (
    <Layout>
      <main className="bg-white dark:bg-gray-950 dark:text-white duration-300">
        <div className="container min-h-[620px] flex flex-col mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Görsel Slider */}
            <div data-aos="zoom-in" className="relative w-full overflow-hidden mb-6 md:mb-0">
              {imagesToShow.length > 1 ? (
                <Slider {...sliderSettings} className="w-full">
                  {imagesToShow.map((imgUrl, i) => (
                    <div key={i} className="outline-none">
                      <img
                        src={imgUrl}
                        alt={`${haber.title} - \${i + 1}`}
                        className="rounded-lg shadow-lg w-full h-[300px] md:h-[450px] object-cover"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                imagesToShow.length === 1 && (
                  <img
                    src={imagesToShow[0]}
                    alt={haber.title}
                    className="rounded-lg shadow-lg w-full h-[300px] md:h-[450px] object-cover"
                  />
                )
              )}

              <div
                data-aos="slide-right"
                data-aos-delay="300"
                className="bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-md absolute -bottom-5 right-5 sm:-right-8"
              >
                <div className="flex items-center gap-2">
                  <FcCalendar className="text-lg" />
                  <span>{haber.date?.slice(0, 10)}</span>
                </div>
              </div>
            </div>

            {/* Metin ve Video */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold leading-tight">{haber.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {haber.fullText}
              </p>

              {embedUrl && (
                <div className="mt-8 rounded-lg overflow-hidden shadow-lg aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="mt-6">
                <Link
                  to="/haberler"
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  &larr; Tüm haberler
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
