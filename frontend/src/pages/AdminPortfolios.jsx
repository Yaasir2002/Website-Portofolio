import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Upload, Eye, ExternalLink, Search, CheckCircle2, AlertCircle, X, Sparkles, MoveUp, MoveDown } from 'lucide-react';
import api from '../services/api';

export default function AdminPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'UI/UX Design',
    thumbnail: '',
    mediaType: 'image',
    videoUrl: '',
    tools: '',
    demoLink: '',
    githubLink: '',
    date: '2026',
    tags: '',
    isFeatured: false,
  });

  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchPortfolios();
    fetchCategories();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/portfolios');
      setPortfolios(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: categories[0]?.name || 'UI/UX Design',
      thumbnail: '',
      mediaType: 'image',
      videoUrl: '',
      tools: '',
      demoLink: '',
      githubLink: '',
      date: new Date().getFullYear().toString(),
      tags: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      thumbnail: item.thumbnail,
      mediaType: item.mediaType || 'image',
      videoUrl: item.videoUrl || '',
      tools: Array.isArray(item.tools) ? item.tools.join(', ') : item.tools || '',
      demoLink: item.demoLink || '',
      githubLink: item.githubLink || '',
      date: item.date || '2026',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      isFeatured: item.isFeatured || false,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('media', file);

    try {
      setUploading(true);
      const res = await api.post('/portfolios/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({
        ...prev,
        thumbnail: res.data.filePath,
        mediaType: res.data.mediaType,
      }));
    } catch (err) {
      alert('Upload file gagal: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.thumbnail) {
      toast.error('Upload gambar/video thumbnail terlebih dahulu!');
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/portfolios/${editingItem._id}`, formData);
        const msg = 'Portofolio berhasil diperbarui!';
        setStatus({ type: 'success', text: msg });
        toast.success(msg);
      } else {
        await api.post('/portfolios', formData);
        const msg = 'Portofolio baru berhasil ditambahkan!';
        setStatus({ type: 'success', text: msg });
        toast.success(msg);
      }

      fetchPortfolios();
      setTimeout(() => {
        setModalOpen(false);
        setStatus(null);
      }, 1000);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Gagal menyimpan portofolio.';
      setStatus({
        type: 'error',
        text: errMsg,
      });
      toast.error(errMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item portofolio ini?')) {
      try {
        await api.delete(`/portfolios/${id}`);
        toast.success('Portofolio berhasil dihapus!');
        fetchPortfolios();
      } catch (err) {
        toast.error('Gagal menghapus portofolio.');
      }
    }
  };

  const filteredPortfolios = portfolios.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Kelola Portofolio (CRUD)
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Tambah, edit, hapus, atau atur urutan karya di galeri publik.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-violet text-dark-900 font-display font-bold text-sm flex items-center gap-2 shadow-glow-cyan hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Portofolio Baru</span>
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari judul portofolio atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
        />
      </div>

      {/* Portfolios Table / Cards */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                <th className="px-6 py-4">Thumbnail</th>
                <th className="px-6 py-4">Judul & Kategori</th>
                <th className="px-6 py-4">Tools & Tech</th>
                <th className="px-6 py-4">Tayangan</th>
                <th className="px-6 py-4 text-right">Aksi Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
              {filteredPortfolios.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-dark-800 border border-white/10 relative">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-white block">{item.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.tools &&
                        item.tools.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">
                            {t}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-medium">
                    {item.views || 0} views
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan/30 transition-colors"
                        title="Edit Portofolio"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Hapus Portofolio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPortfolios.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 text-xs">
                    Belum ada data portofolio. Klik tombol "Tambah Portofolio Baru" untuk membuat baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Portfolio Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-dark-900/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-dark-800 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-display font-bold text-xl text-white">
                  {editingItem ? 'Edit Portofolio' : 'Tambah Portofolio Baru'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {status && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    status.type === 'success'
                      ? 'bg-accent-emerald/15 text-accent-emerald'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{status.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Judul Karya *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: NovaFin — AI Banking App"
                    className="w-full px-4 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Kategori *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input bg-dark-900"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id || cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Tahun *</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="2026"
                      className="w-full px-4 py-2.5 rounded-xl glass-input"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Upload Media / Gambar *</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-input"
                    />
                    <label
                      htmlFor="file-upload-input"
                      className="px-4 py-2.5 rounded-xl bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/25 cursor-pointer font-semibold flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Mengunggah...' : 'Pilih File (Gambar/Video)'}</span>
                    </label>
                    <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                      {formData.thumbnail ? formData.thumbnail : 'Belum ada file dipilih'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Atau Gunakan URL Gambar/Video</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Deskripsi Lengkap *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan cerita proyek, tantangan, dan hasil akhir..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Tools / Tech Stack (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={formData.tools}
                    onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                    placeholder="React, Figma, Tailwind CSS, Node.js"
                    className="w-full px-4 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Link Live Demo</label>
                    <input
                      type="text"
                      value={formData.demoLink}
                      onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2.5 rounded-xl glass-input"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Link GitHub Repository</label>
                    <input
                      type="text"
                      value={formData.githubLink}
                      onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                      placeholder="https://github.com/username/repo"
                      className="w-full px-4 py-2.5 rounded-xl glass-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold text-sm shadow-glow-cyan hover:scale-[1.01] transition-all"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Publikasikan Portofolio'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
