import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle, MapPin, Phone, Github, Linkedin, Dribbble, Instagram, Twitter } from 'lucide-react';
import api from '../services/api';

export default function Contact({ profile }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await api.post('/messages', formData);
      setStatus({
        type: 'success',
        text: res.data?.message || 'Pesan Anda berhasil terkirim! Saya akan merespon sesegera mungkin.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi atau kirim via email langsung.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: profile?.socialLinks?.github || 'https://github.com' },
    { name: 'LinkedIn', icon: Linkedin, url: profile?.socialLinks?.linkedin || 'https://linkedin.com' },
    { name: 'Dribbble', icon: Dribbble, url: profile?.socialLinks?.dribbble || 'https://dribbble.com' },
    { name: 'Instagram', icon: Instagram, url: profile?.socialLinks?.instagram || 'https://instagram.com' },
    { name: 'Twitter', icon: Twitter, url: profile?.socialLinks?.twitter || 'https://x.com' },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent-cyan font-display text-sm font-semibold tracking-widest uppercase">
            Hubungi Saya
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Mari <span className="text-gradient">Bicara Proyek</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Punya ide produk digital luar biasa atau penawaran posisi menarik? Kirim pesan langsung di bawah ini.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Social Icons */}
          <motion.div
            className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-white/10 space-y-8 shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-4">
              <h3 className="font-display font-bold text-2xl text-white">Informasi Kontak</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Saya selalu terbuka untuk diskusi proyek freelance, kolaborasi tim, atau pertanyaan teknis.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-200 text-sm">
                <div className="w-10 h-10 rounded-xl bg-accent-cyan/15 flex items-center justify-center text-accent-cyan">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-medium">Email Resmi</span>
                  <a
                    href={`mailto:${profile?.email || 'contact@alexrivera.dev'}`}
                    className="font-semibold hover:text-accent-electric transition-colors"
                  >
                    {profile?.email || 'contact@alexrivera.dev'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-200 text-sm">
                <div className="w-10 h-10 rounded-xl bg-accent-violet/15 flex items-center justify-center text-accent-violet">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-medium">Lokasi Kunci</span>
                  <span className="font-semibold">{profile?.location || 'Jakarta, Indonesia'}</span>
                </div>
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400">
                Temukan Saya Di Media Sosial
              </h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-gray-300 hover:text-accent-electric hover:border-accent-cyan transition-all duration-300 hover:scale-110"
                    title={soc.name}
                  >
                    <soc.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-display font-bold text-2xl text-white">Kirim Pesan Langsung</h3>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-3 ${
                  status.type === 'success'
                    ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30'
                    : 'bg-red-500/15 text-red-400 border border-red-500/30'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{status.text}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Alamat Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Subjek / Topik</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Contoh: Penawaran Redesain Website"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Pesan / Detail Proyek *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tuliskan rincian kebutuhan atau pesan Anda..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold text-base flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Mengirim Pesan...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Pesan Sekarang</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
