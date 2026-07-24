import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, MailOpen, Calendar, User, Clock } from 'lucide-react';
import api from '../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pesan ini dari inbox?')) {
      try {
        await api.delete(`/messages/${id}`);
        fetchMessages();
      } catch (err) {
        alert('Gagal menghapus pesan.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Pesan Masuk (Form Kontak)
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Daftar penawaran dan pertanyaan yang dikirimkan oleh pengunjung melalui formulir kontak.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-6 rounded-3xl border transition-all ${
              msg.isRead
                ? 'glass-card border-white/5 opacity-80'
                : 'glass-panel border-accent-cyan/40 shadow-glow-cyan'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    msg.isRead ? 'bg-white/5 text-gray-400' : 'bg-accent-cyan/20 text-accent-cyan'
                  }`}
                >
                  {msg.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">{msg.name}</h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-accent-cyan hover:underline block"
                  >
                    {msg.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                <button
                  onClick={() => handleToggleRead(msg._id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    msg.isRead
                      ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                      : 'bg-accent-cyan/20 text-accent-electric border border-accent-cyan/40'
                  }`}
                >
                  {msg.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                </button>

                <button
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <span className="text-xs font-semibold text-accent-violet block">
                Subjek: {msg.subject}
              </span>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {msg.message}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && !loading && (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-2">
            <Mail className="w-10 h-10 text-gray-500 mx-auto opacity-50" />
            <h3 className="font-display font-bold text-lg text-white">Inbox Masih Kosong</h3>
            <p className="text-xs text-gray-400">Belum ada pesan yang dikirim dari formulir kontak.</p>
          </div>
        )}
      </div>
    </div>
  );
}
