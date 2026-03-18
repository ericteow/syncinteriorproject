import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Portfolio from './pages/Portfolio';
import Inquiries from './pages/Inquiries';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light text-primary font-medium tracking-widest uppercase text-sm">
        Loading System...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/" 
          element={session ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Navigate to="/portfolio" replace />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="inquiries" element={<Inquiries />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
