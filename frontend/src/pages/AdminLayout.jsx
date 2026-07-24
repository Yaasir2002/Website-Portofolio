import React, { useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, Tags, User, Mail, LogOut, ExternalLink, Shield } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Portofolio', path: '/admin/portfolios', icon: FolderKanban },
    { name: 'Kelola Kategori', path: '/admin/categories', icon: Tags },
    { name: 'Pengaturan Profil', path: '/admin/profile', icon: User },
    { name: 'Pesan Masuk', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans flex flex-col">
      {/* Top Navbar Header */}
      <header className="glass-panel border-b border-white/10 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-base text-white">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Navigation Tab Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-accent-cyan/15 text-accent-electric border border-accent-cyan/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-accent-cyan" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Status & Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card border border-white/10 text-xs font-medium text-gray-300 hover:text-white"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-accent-cyan" />
            </a>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

        </div>

        {/* Mobile Nav Subbar */}
        <div className="md:hidden flex items-center gap-1 px-4 pt-3 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-accent-cyan/20 text-accent-electric border border-accent-cyan/30'
                    : 'text-gray-300 bg-dark-800'
                }`
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </header>

      {/* Page Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
