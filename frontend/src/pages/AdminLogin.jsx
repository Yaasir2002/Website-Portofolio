import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key, User, ArrowLeft, AlertCircle, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login gagal. Pastikan username & password benar.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Background Spheres */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-cyan/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/15 shadow-2xl relative z-10 space-y-6"
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Utama</span>
        </Link>

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-cyan via-accent-violet to-accent-pink p-[2px] mx-auto shadow-glow-cyan">
            <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center text-accent-cyan">
              <Shield className="w-7 h-7" />
            </div>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">Login Admin Panel</h1>
          <p className="text-xs text-gray-400">
            Masuk untuk mengelola portofolio, kategori, profil, dan statistik pengunjung.
          </p>
        </div>

        {/* Demo Credentials Tip */}
        <div className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-xs text-accent-cyan space-y-1">
          <span className="font-bold block">Kredensial Default Admin:</span>
          <p>Username: <code className="bg-dark-900 px-1.5 py-0.5 rounded text-white font-mono">admin</code> | Password: <code className="bg-dark-900 px-1.5 py-0.5 rounded text-white font-mono">admin123</code></p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-accent-cyan" />
              Username Admin
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              placeholder="Masukkan username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-accent-violet" />
              Password Admin
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{submitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
