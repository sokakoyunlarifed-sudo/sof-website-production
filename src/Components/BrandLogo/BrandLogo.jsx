import React from "react";

// 3 logoyu import et
import AlfazLogo from "../assets/logos/Alfaz_Logo.png";
import CankiriLogo from "../assets/logos/Cankiri_Logo.png";
import PgLogo from "../assets/logos/Pg_Logo.png";

const BrandLogo = () => {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <div className="container py-12">
        <h1 data-aos="fade-up" className="text-center">
          Sokak oyunlarıyla{" "}
          <span className="text-primary">geleneklerimizi</span> yaşatıyoruz
        </h1>
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex flex-wrap animate-marquee items-center justify-evenly gap-6 py-6 md:px-100"
        >
          <img
            src={AlfazLogo}
            alt="Alfaz Logo"
            className="w-24 h-24 object-contain"
          />
          <img
            src={CankiriLogo}
            alt="Çankırı Logo"
            className="w-24 h-24 object-contain"
          />
          <img
            src={PgLogo}
            alt="PG Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandLogo;
