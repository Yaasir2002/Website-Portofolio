import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  User,
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function AdminLogin() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';
  const initialToken = searchParams.get('token') || '';

  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot' | 'reset'
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register State
  const [regForm, setRegForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    secretKey: '',
  });

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset Password State
  const [resetToken, setResetToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');

  // General Feedback State
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialMode && initialToken) {
      setMode('reset');
      setResetToken(initialToken);
    }
  }, [initialMode, initialToken]);

  // LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Login gagal. Pastikan username & password benar.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // REGISTER HANDLER
  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await api.post('/auth/register', regForm);
      setStatus({
        type: 'success',
        text: res.data?.message || 'Akun Admin berhasil didaftarkan! Mencoba login...',
      });

      // Auto login after registration
      setTimeout(async () => {
        try {
          await login(regForm.username, regForm.password);
          navigate('/admin/dashboard');
        } catch (lErr) {
          setMode('login');
          setUsername(regForm.username);
        }
      }, 1200);
    } catch (err) {
      setStatus({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Gagal mendaftarkan akun admin baru. Jika database sudah berisi admin, wajib mengisikan Kode Keamanan (Secret Key).',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      setStatus({
        type: 'success',
        text: res.data?.message || 'Instruksi reset password telah dikirim ke email Anda!',
      });
      // In development mode, if API returns preview URL, show helper hint
      if (res.data?.resetUrl) {
        console.log('Reset Password Preview URL:', res.data.resetUrl);
      }
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Gagal memproses permintaan reset password.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // RESET PASSWORD HANDLER
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await api.post(`/auth/reset-password/${resetToken}`, { password: newPassword });
      setStatus({
        type: 'success',
        text: res.data?.message || 'Password berhasil diperbarui! Silakan login.',
      });

      setTimeout(() => {
        setMode('login');
        setStatus(null);
      }, 1500);
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Gagal menyetel ulang password.',
      });
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
          <h1 className="font-display font-extrabold text-2xl text-white">
            {mode === 'login' && 'Login Admin Panel'}
            {mode === 'register' && 'Registrasi Admin Baru'}
            {mode === 'forgot' && 'Lupa Password Admin'}
            {mode === 'reset' && 'Setel Password Baru'}
          </h1>
          <p className="text-xs text-gray-400">
            {mode === 'login' && 'Masuk untuk mengelola portofolio, kategori, profil, dan statistik.'}
            {mode === 'register' && 'Daftarkan akun admin baru dengan Kode Keamanan (Secret Key).'}
            {mode === 'forgot' && 'Masukkan email terdaftar untuk menerima tautan reset password.'}
            {mode === 'reset' && 'Masukkan password baru untuk akun admin Anda.'}
          </p>
        </div>

        {/* Tab Toggle (Login vs Register) */}
        {mode !== 'reset' && (
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl glass-card border border-white/10 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setStatus(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-accent-cyan/20 text-accent-electric border border-accent-cyan/40 shadow-glow-cyan' : 'text-gray-400 hover:text-white'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              onClick={() => {
                setMode('register');
                setStatus(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'register' ? 'bg-accent-cyan/20 text-accent-electric border border-accent-cyan/40 shadow-glow-cyan' : 'text-gray-400 hover:text-white'
              }`}
            >
              Daftar Admin Baru
            </button>
          </div>
        )}

        {/* Alert Status Notification */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 ${
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

        {/* FORM 1: LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-accent-violet" />
                  Password Admin
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setStatus(null);
                  }}
                  className="text-xs text-accent-cyan hover:underline font-medium"
                >
                  Lupa Password?
                </button>
              </div>
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
        )}

        {/* FORM 2: REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Username Admin *</label>
              <input
                type="text"
                required
                value={regForm.username}
                onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input"
                placeholder="Contoh: admin_utama"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Nama Pengelola *</label>
              <input
                type="text"
                required
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input"
                placeholder="Nama Anda"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Alamat Email (Untuk Reset Password) *</label>
              <input
                type="email"
                required
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input"
                placeholder="email@domain.com"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-300">Password (min 6 karakter) *</label>
              <input
                type="password"
                required
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input"
                placeholder="Password rahasia"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-accent-cyan flex items-center gap-1">
                <span>Kode Keamanan (Secret Key)</span>
                <HelpCircle className="w-3 h-3" title="Kunci rahasia pendaftaran dari file .env" />
              </label>
              <input
                type="password"
                value={regForm.secretKey}
                onChange={(e) => setRegForm({ ...regForm, secretKey: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input border-accent-cyan/30"
                placeholder="ADMIN_SECRET_KEY dari server .env"
              />
              <span className="text-[10px] text-gray-400 block">
                Biarkan kosong jika mendaftarkan akun admin pertama saat server belum punya admin.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold shadow-glow-cyan hover:scale-[1.01] transition-all disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4 inline mr-1.5" />
              <span>{submitting ? 'Mendaftarkan...' : 'Daftarkan Akun Admin'}</span>
            </button>
          </form>
        )}

        {/* FORM 3: FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-accent-cyan" />
                Alamat Email / Username Terdaftar
              </label>
              <input
                type="text"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                placeholder="email@domain.com atau username"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>{submitting ? 'Mengirim Email...' : 'Kirim Tautan Reset Password'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setStatus(null);
              }}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Kembali ke Halaman Login
            </button>
          </form>
        )}

        {/* FORM 4: RESET PASSWORD MODE */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Token Reset Password</label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono"
                placeholder="Tempelkan token reset di sini"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Password Baru (min 6 karakter) *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                placeholder="Masukkan password baru"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-cyan via-accent-electric to-accent-violet text-dark-900 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{submitting ? 'Menyimpan...' : 'Setel Ulang Password Sekarang'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setStatus(null);
              }}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Batal & Kembali ke Login
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}
