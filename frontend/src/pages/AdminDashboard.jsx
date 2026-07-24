import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Users, Mail, Eye, TrendingUp, Compass, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import api from '../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 rounded-xl border border-white/10 text-xs shadow-xl space-y-1">
          <p className="font-bold text-white">{label}</p>
          <p className="text-accent-cyan font-semibold">{payload[0].value} Pengunjung</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-accent-cyan">
        <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totals = data?.totals || { portfolios: 0, visitors: 0, messages: 0, unreadMessages: 0 };
  const visitorChartData = data?.visitorChartData || [];
  const popularPortfolios = data?.popularPortfolios || [];
  const trafficSources = data?.trafficSources || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Dashboard Analytics & Ringkasan
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Pantau aktivitas pengunjung, statistik tayangan portofolio, dan pesan masuk.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl glass-card border border-accent-cyan/30 text-accent-electric text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <span>Sistem Aktif Real-Time</span>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Portofolio</span>
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/15 flex items-center justify-center text-accent-cyan">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <span className="block font-display font-black text-3xl text-white">{totals.portfolios}</span>
          <span className="text-xs text-gray-400">Karya aktif di galeri publik</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Pengunjung</span>
            <div className="w-10 h-10 rounded-xl bg-accent-violet/15 flex items-center justify-center text-accent-violet">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="block font-display font-black text-3xl text-accent-cyan">{totals.visitors}</span>
          <span className="text-xs text-gray-400">Sesi kunjungan tercatat</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pesan Masuk</span>
            <div className="w-10 h-10 rounded-xl bg-accent-pink/15 flex items-center justify-center text-accent-pink">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-3xl text-white">{totals.messages}</span>
            {totals.unreadMessages > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-accent-pink text-dark-900 text-xs font-bold">
                {totals.unreadMessages} Baru
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">Pesan dari formulir kontak</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Tingkat Interaksi</span>
            <div className="w-10 h-10 rounded-xl bg-accent-emerald/15 flex items-center justify-center text-accent-emerald">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="block font-display font-black text-3xl text-accent-emerald">High</span>
          <span className="text-xs text-gray-400">Kunjungan & tayangan aktif</span>
        </motion.div>
      </div>

      {/* Visitor Analytics Graph (Recharts Area Chart) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-cyan" />
              <span>Grafik Kunjungan Harian (7 Hari Terakhir)</span>
            </h3>
            <p className="text-xs text-gray-400">Statistik tren lalu lintas pengunjung situs secara real-time</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorChartData}>
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" stroke="#9CA3AF" fontSize={12} tickLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#06B6D4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#visitorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Most Popular Portfolios & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Popular Portfolios List */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
          <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent-violet" />
            <span>Portofolio Terpopuler (Paling Banyak Dilihat)</span>
          </h3>

          <div className="space-y-4">
            {popularPortfolios.map((item, idx) => (
              <div
                key={item._id || idx}
                className="flex items-center justify-between p-3 rounded-2xl glass-card border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                    <span className="text-xs text-accent-cyan font-medium">{item.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-violet/15 text-accent-violet text-xs font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views || 0} tayangan</span>
                </div>
              </div>
            ))}

            {popularPortfolios.length === 0 && (
              <p className="text-xs text-gray-400">Belum ada tayangan portofolio tercatat.</p>
            )}
          </div>
        </div>

        {/* Traffic Sources Bar Chart */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent-emerald" />
              <span>Sumber Traffic Pengunjung</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Asal referensi navigasi pengunjung</p>
          </div>

          <div className="space-y-3 pt-4">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300 truncate max-w-[200px]">{source.name}</span>
                  <span className="text-accent-emerald">{source.value} sesi</span>
                </div>
                <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-emerald to-accent-cyan rounded-full"
                    style={{ width: `${Math.min(100, (source.value / (totals.visitors || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-gray-400">
            Catatan: Analytics bersifat privasi-aman (tanpa pelacakan cookie sensitif).
          </div>
        </div>

      </div>
    </div>
  );
}
