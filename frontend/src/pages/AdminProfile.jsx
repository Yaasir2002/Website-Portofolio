import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  User,
  Mail,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Briefcase,
  GraduationCap,
  Cpu,
  Plus,
  Trash2,
  Edit2,
  X,
  Code,
} from 'lucide-react';
import api from '../services/api';

export default function AdminProfile() {
  const { user, updateProfileData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatar: '',
    location: '',
    email: '',
    socialLinks: {
      github: '',
      linkedin: '',
      dribbble: '',
      instagram: '',
      twitter: '',
    },
    stats: {
      yearsExperience: 5,
      completedProjects: 42,
      happyClients: 30,
    },
    experiences: [],
    education: [],
    skillCategories: [],
    toolsIcons: [],
  });

  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Modal / Editing states for Experience
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState(null);
  const [expForm, setExpForm] = useState({ period: '', role: '', company: '', description: '' });

  // Modal / Editing states for Education
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState(null);
  const [eduForm, setEduForm] = useState({ period: '', degree: '', institution: '', description: '' });

  // Skill category form
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCatIndex, setEditingCatIndex] = useState(null);
  const [catForm, setCatForm] = useState({ title: '', accent: 'accent-cyan', skillsText: '' });

  // Tool icon form
  const [toolForm, setToolForm] = useState({ name: '', icon: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        location: user.location || '',
        email: user.email || '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          dribbble: user.socialLinks?.dribbble || '',
          instagram: user.socialLinks?.instagram || '',
          twitter: user.socialLinks?.twitter || '',
        },
        stats: {
          yearsExperience: user.stats?.yearsExperience || 5,
          completedProjects: user.stats?.completedProjects || 42,
          happyClients: user.stats?.happyClients || 30,
        },
        experiences: user.experiences || [],
        education: user.education || [],
        skillCategories: user.skillCategories || [],
        toolsIcons: user.toolsIcons || [],
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    try {
      setUploading(true);
      const res = await api.post('/auth/upload-avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, avatar: res.data.filePath }));
    } catch (err) {
      alert('Upload foto profil gagal');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setStatus(null);

    try {
      await updateProfileData(formData);
      setStatus({ type: 'success', text: 'Perubahan berhasil disimpan dan langsung diperbarui di landing page!' });
    } catch (err) {
      setStatus({ type: 'error', text: 'Gagal menyimpan perubahan profil.' });
    }
  };

  // --- EXPERIENCE HANDLERS ---
  const handleOpenAddExp = () => {
    setEditingExpIndex(null);
    setExpForm({ period: '', role: '', company: '', description: '' });
    setExpModalOpen(true);
  };

  const handleOpenEditExp = (index) => {
    setEditingExpIndex(index);
    setExpForm(formData.experiences[index]);
    setExpModalOpen(true);
  };

  const handleSaveExp = (e) => {
    e.preventDefault();
    const updated = [...formData.experiences];
    if (editingExpIndex !== null) {
      updated[editingExpIndex] = expForm;
    } else {
      updated.push(expForm);
    }
    const newFormData = { ...formData, experiences: updated };
    setFormData(newFormData);
    setExpModalOpen(false);
    updateProfileData(newFormData);
    setStatus({ type: 'success', text: 'Pengalaman kerja diperbarui!' });
  };

  const handleDeleteExp = (index) => {
    if (window.confirm('Hapus item pengalaman kerja ini?')) {
      const updated = formData.experiences.filter((_, i) => i !== index);
      const newFormData = { ...formData, experiences: updated };
      setFormData(newFormData);
      updateProfileData(newFormData);
      setStatus({ type: 'success', text: 'Pengalaman kerja dihapus!' });
    }
  };

  // --- EDUCATION HANDLERS ---
  const handleOpenAddEdu = () => {
    setEditingEduIndex(null);
    setEduForm({ period: '', degree: '', institution: '', description: '' });
    setEduModalOpen(true);
  };

  const handleOpenEditEdu = (index) => {
    setEditingEduIndex(index);
    setEduForm(formData.education[index]);
    setEduModalOpen(true);
  };

  const handleSaveEdu = (e) => {
    e.preventDefault();
    const updated = [...formData.education];
    if (editingEduIndex !== null) {
      updated[editingEduIndex] = eduForm;
    } else {
      updated.push(eduForm);
    }
    const newFormData = { ...formData, education: updated };
    setFormData(newFormData);
    setEduModalOpen(false);
    updateProfileData(newFormData);
    setStatus({ type: 'success', text: 'Edukasi / sertifikasi diperbarui!' });
  };

  const handleDeleteEdu = (index) => {
    if (window.confirm('Hapus item edukasi ini?')) {
      const updated = formData.education.filter((_, i) => i !== index);
      const newFormData = { ...formData, education: updated };
      setFormData(newFormData);
      updateProfileData(newFormData);
      setStatus({ type: 'success', text: 'Edukasi dihapus!' });
    }
  };

  // --- SKILLS HANDLERS ---
  const handleOpenAddCat = () => {
    setEditingCatIndex(null);
    setCatForm({ title: '', accent: 'accent-cyan', skillsText: '' });
    setCatModalOpen(true);
  };

  const handleOpenEditCat = (index) => {
    setEditingCatIndex(index);
    const cat = formData.skillCategories[index];
    const skillsStr = cat.skills ? cat.skills.map((s) => `${s.name}:${s.level}`).join('\n') : '';
    setCatForm({ title: cat.title, accent: cat.accent || 'accent-cyan', skillsText: skillsStr });
    setCatModalOpen(true);
  };

  const handleSaveCat = (e) => {
    e.preventDefault();
    const parsedSkills = catForm.skillsText
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const parts = line.split(':');
        return {
          name: parts[0]?.trim() || line.trim(),
          level: parseInt(parts[1]) || 90,
        };
      });

    const newCategory = {
      title: catForm.title,
      accent: catForm.accent,
      skills: parsedSkills,
    };

    const updated = [...formData.skillCategories];
    if (editingCatIndex !== null) {
      updated[editingCatIndex] = newCategory;
    } else {
      updated.push(newCategory);
    }

    const newFormData = { ...formData, skillCategories: updated };
    setFormData(newFormData);
    setCatModalOpen(false);
    updateProfileData(newFormData);
    setStatus({ type: 'success', text: 'Kategori keahlian diperbarui!' });
  };

  const handleDeleteCat = (index) => {
    if (window.confirm('Hapus kategori keahlian ini?')) {
      const updated = formData.skillCategories.filter((_, i) => i !== index);
      const newFormData = { ...formData, skillCategories: updated };
      setFormData(newFormData);
      updateProfileData(newFormData);
      setStatus({ type: 'success', text: 'Kategori keahlian dihapus!' });
    }
  };

  // --- TOOL BADGE HANDLERS ---
  const handleAddTool = (e) => {
    e.preventDefault();
    if (!toolForm.name || !toolForm.icon) return;

    const updated = [...formData.toolsIcons, toolForm];
    const newFormData = { ...formData, toolsIcons: updated };
    setFormData(newFormData);
    setToolForm({ name: '', icon: '' });
    updateProfileData(newFormData);
    setStatus({ type: 'success', text: 'Badgik tool ditambahkan!' });
  };

  const handleDeleteTool = (index) => {
    const updated = formData.toolsIcons.filter((_, i) => i !== index);
    const newFormData = { ...formData, toolsIcons: updated };
    setFormData(newFormData);
    updateProfileData(newFormData);
    setStatus({ type: 'success', text: 'Badgik tool dihapus!' });
  };

  return (
    <div className="max-w-5xl mx-auto glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 shadow-2xl">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Pengaturan Konten Profile & Bio
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Kelola profil utama, pengalaman kerja, edukasi, serta keahlian & tools yang tampil di landing page.
          </p>
        </div>
        <Sparkles className="w-8 h-8 text-accent-cyan" />
      </div>

      {/* Alert Status */}
      {status && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
            status.type === 'success'
              ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30'
              : 'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{status.text}</span>
        </div>
      )}

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-accent-cyan/20 text-accent-electric border border-accent-cyan/40 shadow-glow-cyan'
              : 'text-gray-400 hover:text-white glass-card'
          }`}
        >
          <User className="w-4 h-4 text-accent-cyan" />
          <span>Profil & Sosmed</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-all flex items-center gap-2 ${
            activeTab === 'experience'
              ? 'bg-accent-cyan/20 text-accent-electric border border-accent-cyan/40 shadow-glow-cyan'
              : 'text-gray-400 hover:text-white glass-card'
          }`}
        >
          <Briefcase className="w-4 h-4 text-accent-cyan" />
          <span>Pengalaman Kerja ({formData.experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-all flex items-center gap-2 ${
            activeTab === 'education'
              ? 'bg-accent-violet/20 text-accent-electric border border-accent-violet/40 shadow-glow-violet'
              : 'text-gray-400 hover:text-white glass-card'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-accent-violet" />
          <span>Edukasi & Sertifikasi ({formData.education.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-all flex items-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-accent-pink/20 text-accent-electric border border-accent-pink/40 shadow-glow-cyan'
              : 'text-gray-400 hover:text-white glass-card'
          }`}
        >
          <Cpu className="w-4 h-4 text-accent-pink" />
          <span>Keahlian & Tools</span>
        </button>
      </div>

      {/* TAB 1: MAIN PROFILE & SOCIAL LINKS */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 text-xs sm:text-sm">
          {/* Avatar & Logo Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/10">
              <img
                src={
                  formData.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                }
                alt="Profile Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-accent-cyan shadow-glow-cyan"
              />
              <div className="space-y-1.5 flex-1">
                <label className="font-semibold text-white block text-xs">Foto Profil (Organic Shape)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-input"
                />
                <label
                  htmlFor="avatar-input"
                  className="px-3 py-1.5 rounded-xl bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/25 cursor-pointer font-semibold text-xs inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Mengunggah...' : 'Upload Foto'}</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-2">
              <label className="font-semibold text-white block text-xs">Logo Custom Navbar (Opsional Image URL)</label>
              <input
                type="text"
                value={formData.logo || ''}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="Biarkan kosong untuk inisial otomatis dari nama"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
              <span className="text-[11px] text-gray-400 block">
                Jika dikosongkan, logo navbar akan otomatis menampilkan inisial dari Nama Lengkap.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Nama Lengkap</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Tagline Profesional</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Lokasi Dominan</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Email Publik</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300">Bio Ringkas (About Section)</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input resize-none"
            />
          </div>

          {/* Stats Metrics Counter */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="font-display font-bold text-base text-white">Statistik Kunci Landing Hero</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Tahun Pengalaman</label>
                <input
                  type="number"
                  value={formData.stats.yearsExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, yearsExperience: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Proyek Selesai</label>
                <input
                  type="number"
                  value={formData.stats.completedProjects}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, completedProjects: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Klien Puas</label>
                <input
                  type="number"
                  value={formData.stats.happyClients}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, happyClients: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="font-display font-bold text-base text-white">Tautan Media Sosial</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400">GitHub URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.github}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, github: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">LinkedIn URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Dribbble URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.dribbble}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, dribbble: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Instagram URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold text-base shadow-glow-cyan hover:scale-[1.01] transition-all"
          >
            Simpan Profil & Perbarui Landing Page
          </button>
        </form>
      )}

      {/* TAB 2: PENGALAMAN KERJA */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white">Daftar Pengalaman Kerja</h3>
            <button
              onClick={handleOpenAddExp}
              className="px-4 py-2 rounded-xl bg-accent-cyan text-dark-900 font-display font-bold text-xs flex items-center gap-2 shadow-glow-cyan hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengalaman Kerja</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.experiences.map((exp, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan font-semibold text-xs">
                      {exp.period}
                    </span>
                    <span className="text-xs text-accent-violet font-bold">{exp.company}</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">{exp.role}</h4>
                  <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">{exp.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditExp(index)}
                    className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan/30"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExp(index)}
                    className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {formData.experiences.length === 0 && (
              <div className="text-center py-10 glass-panel rounded-2xl text-gray-400 text-xs">
                Belum ada data pengalaman kerja. Klik "Tambah Pengalaman Kerja" di atas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EDUKASI & SERTIFIKASI */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-white">Daftar Edukasi & Sertifikasi</h3>
            <button
              onClick={handleOpenAddEdu}
              className="px-4 py-2 rounded-xl bg-accent-violet text-white font-display font-bold text-xs flex items-center gap-2 shadow-glow-violet hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Edukasi / Sertifikasi</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-violet/15 text-accent-violet font-semibold text-xs">
                      {edu.period}
                    </span>
                    <span className="text-xs text-accent-cyan font-bold">{edu.institution}</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">{edu.degree}</h4>
                  <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">{edu.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditEdu(index)}
                    className="p-2 rounded-lg bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan/30"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEdu(index)}
                    className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {formData.education.length === 0 && (
              <div className="text-center py-10 glass-panel rounded-2xl text-gray-400 text-xs">
                Belum ada data edukasi/sertifikasi. Klik "Tambah Edukasi / Sertifikasi" di atas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: KEAHLIAN & TOOLS */}
      {activeTab === 'skills' && (
        <div className="space-y-8">
          
          {/* Section A: Skill Categories Progress Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-white">Kategori Keahlian & Progress Bar</h3>
              <button
                onClick={handleOpenAddCat}
                className="px-4 py-2 rounded-xl bg-accent-pink text-dark-900 font-display font-bold text-xs flex items-center gap-2 shadow-glow-cyan hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori Keahlian</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.skillCategories.map((cat, catIdx) => (
                <div key={catIdx} className="p-5 rounded-2xl glass-card border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-display font-bold text-base text-white">{cat.title}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCat(catIdx)}
                        className="p-1.5 rounded bg-accent-cyan/15 text-accent-cyan"
                        title="Edit Kategori"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCat(catIdx)}
                        className="p-1.5 rounded bg-red-500/15 text-red-400"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {cat.skills &&
                      cat.skills.map((s, sIdx) => (
                        <div key={sIdx} className="flex justify-between text-xs text-gray-300">
                          <span>{s.name}</span>
                          <span className="font-semibold text-accent-cyan">{s.level}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Floating Tool Badges */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="font-display font-bold text-xl text-white">Badgik Ikon Tools (Scroll-Reveal)</h3>
            
            {/* Add Tool Badge Input Form */}
            <form onSubmit={handleAddTool} className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                required
                placeholder="Nama Tool (contoh: Figma)"
                value={toolForm.name}
                onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                className="px-4 py-2 rounded-xl glass-input text-xs"
              />
              <input
                type="text"
                required
                placeholder="Ikon / Emoji (contoh: 🎨 atau ⚛️)"
                value={toolForm.icon}
                onChange={(e) => setToolForm({ ...toolForm, icon: e.target.value })}
                className="px-4 py-2 rounded-xl glass-input text-xs w-36"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-accent-cyan text-dark-900 font-display font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tool</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-3 pt-2">
              {formData.toolsIcons.map((tool, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl glass-card border border-white/10 flex items-center gap-2 text-xs"
                >
                  <span>{tool.icon}</span>
                  <span className="font-semibold text-gray-200">{tool.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTool(idx)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- MODAL FOR EXPERIENCE --- */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-md" onClick={() => setExpModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-dark-800 border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-lg text-white">
                {editingExpIndex !== null ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}
              </h3>
              <button onClick={() => setExpModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Periode (contoh: 2024 — Sekarang)</label>
                <input
                  type="text"
                  required
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Posisi / Role *</label>
                <input
                  type="text"
                  required
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Nama Perusahaan / Studio *</label>
                <input
                  type="text"
                  required
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Deskripsi Pekerjaan *</label>
                <textarea
                  rows={3}
                  required
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-cyan text-dark-900 font-display font-bold shadow-glow-cyan hover:scale-[1.01] transition-all"
              >
                Simpan Pengalaman
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR EDUCATION --- */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-md" onClick={() => setEduModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-dark-800 border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-lg text-white">
                {editingEduIndex !== null ? 'Edit Edukasi / Sertifikasi' : 'Tambah Edukasi / Sertifikasi'}
              </h3>
              <button onClick={() => setEduModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Periode (contoh: 2017 — 2021)</label>
                <input
                  type="text"
                  required
                  value={eduForm.period}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Gelar / Nama Sertifikasi *</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Institusi / Penyelenggara *</label>
                <input
                  type="text"
                  required
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Deskripsi Singkat *</label>
                <textarea
                  rows={3}
                  required
                  value={eduForm.description}
                  onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-violet text-white font-display font-bold shadow-glow-violet hover:scale-[1.01] transition-all"
              >
                Simpan Edukasi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR SKILL CATEGORY --- */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-md" onClick={() => setCatModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-dark-800 border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-lg text-white">
                {editingCatIndex !== null ? 'Edit Kategori Keahlian' : 'Tambah Kategori Keahlian'}
              </h3>
              <button onClick={() => setCatModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Judul Kategori (contoh: Frontend Development) *</label>
                <input
                  type="text"
                  required
                  value={catForm.title}
                  onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">
                  Daftar Skill & Persentase (Satu per baris, format: <code className="text-accent-cyan">NamaSkill:85</code>)
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder={"React.js & Vite:95\nTailwind CSS:90\nNode.js:88"}
                  value={catForm.skillsText}
                  onChange={(e) => setCatForm({ ...catForm, skillsText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input font-mono text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-pink text-dark-900 font-display font-bold shadow-glow-cyan hover:scale-[1.01] transition-all"
              >
                Simpan Kategori Keahlian
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
