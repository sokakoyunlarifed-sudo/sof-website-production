import React, { useRef } from "react";
import Layout from "./Layout";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const Iletisim = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_xxx",    // EmailJS Service ID
        "template_xxx",   // EmailJS Template ID
        form.current,
        "publicKey_xxx"   // EmailJS Public Key
      )
      .then(
        () => {
          alert("Mesajınız başarıyla gönderildi ✅");
          form.current.reset();
        },
        (error) => {
          alert("Mesaj gönderilemedi ❌ " + error.text);
        }
      );
  };

  return (
    <Layout>
      <section className="bg-gray-100 dark:bg-gray-900 dark:text-white body-font relative py-16">
        <div className="container px-5 mx-auto flex sm:flex-nowrap flex-wrap gap-10">
          
          {/* Sol taraf: Google Maps + İletişim bilgileri */}
          <div className="lg:w-2/3 md:w-1/2 relative rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              frameBorder="0"
              title="map"
              scrolling="no"
              src="https://maps.google.com/maps?width=100%&height=600&hl=tr&q=Ankara%20Çankaya%20Sokak%20Oyunlari%20Federasyonu&ie=UTF8&t=&z=14&iwloc=B&output=embed"
              style={{ filter: "grayscale(1) contrast(1.2) opacity(0.7)" }}
            ></iframe>
            <div className="bg-white dark:bg-slate-950 relative flex flex-wrap py-6 rounded shadow-md m-10">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 dark:text-white tracking-widest text-xs">
                  ADRES
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Ankara, Çankaya – Türkiye
                </p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 dark:text-white tracking-widest text-xs">
                  EMAIL
                </h2>
                <a className="text-primary leading-relaxed">info@sof.web.tr</a>
                <h2 className="title-font font-semibold text-gray-900 dark:text-white tracking-widest text-xs mt-4">
                  TELEFON
                </h2>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  +90 312 000 00 00
                </p>
              </div>
            </div>
          </div>

          {/* Sağ taraf: İletişim Formu */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="lg:w-1/3 md:w-1/2 bg-white dark:bg-slate-950 flex flex-col w-full md:py-8 mt-8 md:mt-0 rounded-lg shadow p-6 space-y-4"
          >
            <h2 className="text-gray-900 dark:text-white text-lg mb-1 font-medium title-font">
              Mesaj Gönder
            </h2>
            <p className="leading-relaxed mb-5 text-gray-600 dark:text-gray-300">
              Federasyonumuzla iletişime geçmek için formu doldurabilirsiniz.
            </p>

            <div>
              <label className="block mb-2 text-sm">Ad Soyad</label>
              <input
                type="text"
                name="user_name"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                placeholder="Adınızı giriniz"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">E-posta</label>
              <input
                type="email"
                name="user_email"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                placeholder="ornek@mail.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Mesajınız</label>
              <textarea
                name="message"
                rows="4"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                placeholder="Mesajınızı yazınız..."
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full">
              Gönder
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Iletisim;
