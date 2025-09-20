import React, { useEffect, useState } from "react";
import Layout from "../Pages/Layout";
import { FaBars } from "react-icons/fa";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchNews,
  fetchAnnouncements,
  fetchCommittees,
  createNews,
  updateNews,
  deleteNews,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createCommittee,
  updateCommittee,
  deleteCommittee,
  uploadMedia,
} from "../services/adminApi";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const displayTab = (key) => ({
    haberler: "News",
    duyurular: "Announcements",
    kurullar: "Committees",
  })[key] || key;
  const displayTabSingular = (key) => ({
    haberler: "News",
    duyurular: "Announcement",
    kurullar: "Committee",
  })[key] || key;

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [haberler, duyurular, kurullar] = await Promise.all([
        fetchNews(),
        fetchAnnouncements(),
        fetchCommittees(),
      ]);
      setItems({ haberler, duyurular, kurullar });
    } catch (e) {
      console.error("Load error:", e);
      setError(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openModal = (item = null) => {
    setEditItem(item);
    setFormData(item || {});
    setModalOpen(true);
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || uploading) return;
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("Image exceeds 5MB. Please select a smaller file.");
      return;
    }
    try {
      setUploading(true);
      const folder = tab === 'haberler' ? 'news' : (tab === 'duyurular' ? 'announcements' : 'committees')
      const url = await uploadMedia(file, folder)
      setFormData((p) => ({ ...p, image: url }));
    } catch (err) {
      alert(err?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === "haberler") await deleteNews(id);
      if (type === "duyurular") await deleteAnnouncement(id);
      if (type === "kurullar") await deleteCommittee(id);
      setItems((prev) => ({ ...prev, [type]: prev[type].filter((i) => i.id !== id) }));
    } catch (e) {
      alert(e?.message || "Delete failed");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (tab === "haberler") {
        if (editItem) {
          await updateNews(editItem.id, formData);
        } else {
          await createNews(formData);
        }
        const fresh = await fetchNews();
        setItems((p) => ({ ...p, haberler: fresh }));
      }

      if (tab === "duyurular") {
        if (editItem) {
          await updateAnnouncement(editItem.id, formData);
        } else {
          await createAnnouncement(formData);
        }
        const fresh = await fetchAnnouncements();
        setItems((p) => ({ ...p, duyurular: fresh }));
      }

      if (tab === "kurullar") {
        if (editItem) {
          await updateCommittee(editItem.id, formData);
        } else {
          await createCommittee(formData);
        }
        const fresh = await fetchCommittees();
        setItems((p) => ({ ...p, kurullar: fresh }));
      }

      setFormData({});
      setEditItem(null);
      setModalOpen(false);
    } catch (e) {
      console.error("Save error:", e);
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none";

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
              <span className="capitalize">{displayTab(tab)}</span>
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
                    {displayTab(type)}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{displayTab(tab)} Management</h2>
              {loading && <span className="text-sm text-gray-400">Loading...</span>}
              {error && <span className="text-sm text-red-400">{error}</span>}
            </div>

            {/* Grids */}
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
                {editItem ? "Edit" : "New"} {displayTabSingular(tab)}
              </h2>

              {/* Upload Hero */}
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
                    {uploading ? 'Uploading image...' : 'Upload image (optional)'}
                  </h2>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 tracking-wide text-sm">
                    SVG, PNG, JPG, GIF (max 5MB)
                  </p>
                  <input
                    id="admin-dropzone"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                    onChange={handleImageFile}
                    disabled={uploading}
                  />
                </label>
                {formData.image ? (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={formData.image}
                      alt="Selected image"
                      className="max-h-40 rounded shadow"
                    />
                  </div>
                ) : null}
              </div>

              {/* URL input (upload alternative) */}
              <div className="mb-4">
                <input
                  className={inputCls}
                  type="text"
                  placeholder="Image URL (auto-filled after upload)"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  disabled={uploading}
                />
              </div>

              {/* Form fields by tab */}
              {tab === "haberler" && (
                <div className="grid gap-3">
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Title"
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
                    placeholder="Short description"
                    value={formData.shortText || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, shortText: e.target.value })
                    }
                  />
                  <textarea
                    className={inputCls}
                    rows={4}
                    placeholder="Full text"
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
                    placeholder="Title"
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
                    placeholder="Location"
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                  <textarea
                    className={inputCls}
                    rows={4}
                    placeholder="Description"
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
                    placeholder="Name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Role"
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
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
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
