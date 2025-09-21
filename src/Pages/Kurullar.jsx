import React, { useEffect, useState } from "react";
import Layout from "./Layout";
// import kurullarData from "../data/kurullar.json";
import { fetchCommittees } from "../services/adminApi";

const Kurullar = () => {
  const [kurullar, setKurullar] = useState([]);

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchCommittees()
        if (mounted) setKurullar(data)
      } catch (e) {
        console.error("Kurullar yüklenemedi:", e)
      }
    })()
    return () => { mounted = false }
  }, []);

  return (
    <Layout>
      <section className="bg-gray-100 dark:bg-gray-900 dark:text-white py-16">
        <div className="container px-5 mx-auto">
          {/* Başlık */}
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Kurullarımız
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-600 dark:text-gray-300">
              Federasyonumuzun işleyişinde görev alan farklı kurullar aşağıda listelenmiştir.
            </p>
          </div>

          {/* Grid */}
          <div className="flex flex-wrap -m-2">
            {kurullar.map((kurul, index) => (
              <div key={kurul.id} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div
                  className="h-full flex items-center border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-slate-950"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <img
                    alt={kurul.name}
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    src={kurul.image}
                  />
                  <div className="flex-grow">
                    <h2 className="text-gray-900 dark:text-white title-font font-medium">
                      {kurul.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {kurul.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kurullar;
