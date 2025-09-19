import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"

import Home from "./Pages/Home"
import Haberlist from "./Pages/Haberlist"
import HaberDetail from "./Pages/HaberDetail"
import Duyurular from "./Pages/Duyurular"
import DuyuruDetail from "./Pages/DuyuruDetail"
import Hakkimizda from "./Pages/Hakkimizda"
import Iletisim from "./Pages/Iletisim"
import Kurullar from "./Pages/Kurullar"

import AdminLogin from "./Pages/AdminLogin"
import AdminPanel from "./Pages/AdminPanel"
import PrivateRoute from "./Pages/PrivateRoute"

export default function App() {
  React.useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 100,
      delay: 100,
    })
    AOS.refresh()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Ana sayfa */}
        <Route path="/" element={<Home />} />
        <Route path="/Haberler" element={<Haberlist />} />
        <Route path="/haber/:id" element={<HaberDetail />} />

        <Route path="/Duyurular" element={<Duyurular />} />
        <Route path="/duyuru/:id" element={<DuyuruDetail />} />

        <Route path="/Hakkimizda" element={<Hakkimizda />} />
        <Route path="/Iletisim" element={<Iletisim />} />
        <Route path="/Kurullar" element={<Kurullar />} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
