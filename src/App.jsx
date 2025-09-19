import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import AdminLogin from "./admin-panel(eklenmeli)/AdminLogin"
import AdminPanel from "./admin-panel(eklenmeli)/AdminPanel"
import PrivateRoute from "./admin-panel(eklenmeli)/PrivateRoute"
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
    <Router>
      <Routes>
        {/* Ana sayfa */}
        <Route path="/" element={<Home />} />
        {/* İleride başka sayfalar için buraya Route ekleyebilirsin */}
        <Route path="/haberler" element={<Haberlist />} />
        <Route path="/haber/:id" element={<HaberDetail />} />

        <Route path="/duyurular" element={<Duyurular />} />
        <Route path="/duyuru/:id" element={<DuyuruDetail />} />

        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route path="/kurullar" element={<Kurullar />} />

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

        {/* Fallback */}
        <Route path="*" element={<Home />} />

      </Routes>
    </Router>
  )
}
