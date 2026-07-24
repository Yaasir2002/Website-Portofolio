import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Tags } from 'lucide-react';
import api from '../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name, description });
        setStatus({ type: 'success', text: 'Kategori berhasil diperbarui!' });
      } else {
        await api.post('/categories', { name, description });
        setStatus({ type: 'success', text: 'Kategori baru ditambahkan!' });
      }

      setName('');
      setDescription('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Gagal menyimpan kategori.',
      });
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus kategori ini? Portofolio terkait mungkin terdampak.')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Gagal menghapus kategori.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Category Form */}
      <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <Tags className="w-5 h-5 text-accent-cyan" />
          <span>{editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
        </h2>

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
            <label className="font-semibold text-gray-300">Nama Kategori *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: AI & Data Visualization"
              className="w-full px-4 py-2.5 rounded-xl glass-input"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-300">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan cakupan karya dalam kategori ini..."
              className="w-full px-4 py-2.5 rounded-xl glass-input resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet text-dark-900 font-display font-bold shadow-glow-cyan hover:scale-[1.01] transition-all"
            >
              {editingId ? 'Simpan Kategori' : 'Tambah Kategori'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setDescription('');
                }}
                className="px-4 py-3 rounded-xl glass-card text-gray-300 hover:text-white"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right Column: Category List */}
      <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
        <h2 className="font-display font-bold text-xl text-white">Daftar Kategori Aktif</h2>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/5"
            >
              <div>
                <span className="font-bold text-white block">{cat.name}</span>
                <span className="text-xs text-gray-400 font-mono">Slug: {cat.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan/30"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
