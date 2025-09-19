import React, { useEffect, useState } from "react";
import Layout from "../Pages/Layout";
import newsData from "../data/haberler.json";
import duyuruData from "../data/duyurular.json";
import kurullarData from "../data/kurullar.json";
import { FaBars } from "react-icons/fa";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const LS_KEY = "sof_admin_data_v1";

const AdminPanel = () => {
  const [tab, setTab] = useState("haberler");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState({
    haberler: [],
    duyurular: [],
    kurullar: [],
  });

  // ---- storage helpers ----
  const saveToLS = (data) => localStorage.setItem(LS_KEY, JSON.stringify(data));
  const loadFromLS = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  };

  // init
  useEffect(() => {
    const cached = loadFromLS();
    if (cached) {
      setItems(cached);
    } else {
      const seed = {
        haberler: newsData,
        duyurular: duyuruData,
        kurullar: kurullarData,
      };
      setItems(seed);
      saveToLS(seed);
    }
  }, []);

  // ---- delete ----
  const handleDelete = (type, id) => {
    const next = { ...items, [type]: items[type].filter((i) => i.id !== id) };
    setItems(next);
    saveToLS(next);
  };

  // ---- modal open (add/edit) ----
  const openModal = (item = null) => {
    setEditItem(item);
    setFormData(item || {});
    setModalOpen(true);
  };

  // ---- file -> b64 ----
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Görsel 2MB üstü. Daha küçük seç kanka.");
      return;
    }
    try {
      const b64 = await toBase64(file);
      setFormData((p) => ({ ...p, image: b64 }));
    } catch {
      alert("Görsel okunamadı.");
    }
  };

  // ---- save (add/edit) ----
  const handleSave = () => {
    const next = { ...items };

    if (tab === "haberler") {
      const newEntry = {
        id: editItem ? editItem.id : Date.now(),
        title: formData.title || "",
        date: formData.date || "",
        shortText: formData.shortText || "",
        fullText: formData.fullText || "",
        image: formData.image || "",
        aosDelay: editItem
          ? editItem.aosDelay
          : String(((items.haberler?.length || 0) % 4) * 200), // 0/200/400/600
      };
      next.haberler = editItem
        ? items.haberler.map((i) => (i.id === editItem.id ? newEntry : i))
        : [...items.haberler, newEntry];
    }

    if (tab === "duyurular") {
      const newEntry = {
        id: editItem ? editItem.id : Date.now(),
        title: formData.title || "",
        date: formData.date || "",
        location: formData.location || "",
        description: formData.description || "",
        image: formData.image || "",
      };
      next.duyurular = editItem
        ? items.duyurular.map((i) => (i.id === editItem.id ? newEntry : i))
        : [...items.duyurular, newEntry];
    }

    if (tab === "kurullar") {
      const newEntry = {
        id: editItem ? editItem.id : Date.now(),
        name: formData.name || "",
        role: formData.role || "",
        image: formData.image || "",
      };
      next.kurullar = editItem
        ? items.kurullar.map((i) => (i.id === editItem.id ? newEntry : i))
        : [...items.kurullar, newEntry];
    }

    setItems(next);
    saveToLS(next);
    setFormData({});
    setEditItem(null);
    setModalOpen(false);
  };

  // ortak input cls
  const inputCls =
    "w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none";

  // ---- card renderers (kendi sayfa tasarımına yakın) ----
  const NewsCard = (item, index) => (
    <div
      key={item.id}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden relative"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover group-hover:scale-105 duration-300"
      />
      <div className="p-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {item.date}
        </span>
        <h3 className="text-xl font-semibold mt-2 mb-3 text-gray-800 dark:text-gray-100 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {item.shortText}
        </p>
      </div>

      {/* overlay fablar */}
      <div className="absolute top-3 right-3 flex gap-2">
        <Fab
          size="small"
          color="primary"
          aria-label="edit"
          onClick={() => openModal(item)}
        >
          <EditIcon fontSize="small" />
        </Fab>
        <Fab
          size="small"
          color="error"
          aria-label="delete"
          onClick={() => handleDelete("haberler", item.id)}
        >
          <DeleteIcon fontSize="small" />
        </Fab>
      </div>
    </div>
  );

  const DuyuruCard = (item, index) => (
    <div
      key={item.id}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden relative"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover group-hover:scale-105 duration-300"
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
          {item.description}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          📅 {item.date}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          📍 {item.location}
        </div>
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        <Fab
          size="small"
          color="primary"
          aria-label="edit"
          onClick={() => openModal(item)}
        >
          <EditIcon fontSize="small" />
        </Fab>
        <Fab
          size="small"
          color="error"
          aria-label="delete"
          onClick={() => handleDelete("duyurular", item.id)}
        >
          <DeleteIcon fontSize="small" />
        </Fab>
      </div>
    </div>
  );

  const KurulCard = (item, index) => (
    <div
      key={item.id}
      className="h-full flex items-center border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-slate-950 relative"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <img
        alt={item.name}
        className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
        src={item.image}
      />
      <div className="flex-grow">
        <h2 className="text-gray-900 dark:text-white title-font font-medium">
          {item.name}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{item.role}</p>
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        <Fab
          size="small"
          color="primary"
          aria-label="edit"
          onClick={() => openModal(item)}
        >
          <EditIcon fontSize="small" />
        </Fab>
        <Fab
          size="small"
          color="error"
          aria-label="delete"
          onClick={() => handleDelete("kurullar", item.id)}
        >
          <DeleteIcon fontSize="small" />
        </Fab>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="menu"
            >
              <FaBars />
            </button>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <span className="text-green-700 font-medium">
                <a href="/">Home</a>
              </span>
              <span>/</span>
              <span className="text-base">Admin</span>
              <span>/</span>
              <span className="capitalize">{tab}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 flex gap-6">
          {/* Sidebar */}
          <aside
            className={`fixed md:static inset-y-0 left-0 z-20 w-64 transform md:transform-none transition-transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } bg-white dark:bg-slate-950 shadow p-4`}
          >
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <ul className="space-y-2">
              {["haberler", "duyurular", "kurullar"].map((type) => (
                <li key={type}>
                  <button
                    onClick={() => {
                      setTab(type);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded ${
                      tab === type
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold capitalize">{tab} Yönetimi</h2>
            </div>

            {/* Grid listeleri sayfa tasarımlarına benzer */}
            {tab === "haberler" && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.haberler.map((item, idx) => NewsCard(item, idx))}
              </div>
            )}

            {tab === "duyurular" && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.duyurular.map((item, idx) => DuyuruCard(item, idx))}
              </div>
            )}

            {tab === "kurullar" && (
              <div className="flex flex-wrap -m-2">
                {items.kurullar.map((item, idx) => (
                  <div key={item.id} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    {KurulCard(item, idx)}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Global Add FAB */}
        <div className="fixed bottom-6 right-6 z-40">
          <Fab color="primary" aria-label="add" onClick={() => openModal()}>
            <AddIcon />
          </Fab>
        </div>

        {/* Modal (Add/Edit) */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-slate-950 p-6 rounded shadow-lg w-[680px] max-h-[92vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editItem ? "Düzenle" : "Yeni"}{" "}
                {tab.charAt(0).toUpperCase() + tab.slice(1, -1)}
              </h2>

              {/* Upload Hero (drag-drop görünüm) */}
              <div className="w-full mb-5">
                <label
                  htmlFor="admin-dropzone"
                  className="mx-auto cursor-pointer flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white dark:bg-slate-900 p-6 text-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-800 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <h2 className="mt-3 text-lg font-medium text-gray-700 dark:text-gray-200 tracking-wide">
                    Görsel yükle (isteğe bağlı)
                  </h2>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 tracking-wide text-sm">
                    SVG, PNG, JPG, GIF (max 2MB)
                  </p>
                  <input
                    id="admin-dropzone"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                    onChange={handleImageFile}
                  />
                </label>
              </div>

              {/* URL inputu (upload alternatifi) */}
              <div className="mb-4">
                <input
                  className={inputCls}
                  type="text"
                  placeholder="Görsel URL (yüklersen otomatik dolar)"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              {/* Form alanları (tab’a göre) */}
              {tab === "haberler" && (
                <div className="grid gap-3">
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Başlık"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Kısa Açıklama (shortText)"
                    value={formData.shortText || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, shortText: e.target.value })
                    }
                  />
                  <textarea
                    className={inputCls}
                    rows={4}
                    placeholder="Detay (fullText)"
                    value={formData.fullText || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fullText: e.target.value })
                    }
                  />
                </div>
              )}

              {tab === "duyurular" && (
                <div className="grid gap-3">
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Başlık"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Yer (location)"
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                  <textarea
                    className={inputCls}
                    rows={4}
                    placeholder="Açıklama"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {tab === "kurullar" && (
                <div className="grid gap-3">
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Kurul Adı (name)"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Görev (role)"
                    value={formData.role || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setEditItem(null);
                    setFormData({});
                  }}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;
