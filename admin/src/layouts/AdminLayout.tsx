import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Compass, Image, MessageSquare, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg-light flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <Compass size={20} />
          </div>
          <h2 className="font-bold tracking-tight text-lg">Sync Admin</h2>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink 
            to="/portfolio"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`
            }
          >
            <Image size={20} />
            Portfolio
          </NavLink>
          <NavLink 
            to="/inquiries"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`
            }
          >
            <MessageSquare size={20} />
            Inquiries
          </NavLink>
        </nav>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors mt-auto"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
