'use client';
import { useState, useEffect } from 'react';
import Dock from '../components/Dock';
import ClientManager from '../components/admin/ClientManager';
import LoginPage from '../components/auth/LoginPage';
import RegisterPage from '../components/auth/RegisterPage';
import ProfilePanel from '../components/auth/ProfilePanel';
import { getProfile, logoutUser } from '../lib/auth';

type View =
  | 'home'
  | 'admin'
  | 'login'
  | 'register';

export default function WelcomePage() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const result = await getProfile();
    if (result.success) {
      setUser(result.profile);
      setCurrentView('home');
    } else {
      // Bypass login for admin panel development
      setUser({ username: 'AdminDev', role_name: 'DUEÑO' });
      setCurrentView('home');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setCurrentView('login');
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#f5f7fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#666', fontFamily: 'sans-serif' }}>
          Cargando aplicación...
        </p>
      </main>
    );
  }

  if (!user) {
    if (currentView === 'register') {
      return (
        <RegisterPage onNavigate={setCurrentView} onLoginSuccess={checkAuth} />
      );
    }
    return <LoginPage onNavigate={setCurrentView} onLoginSuccess={checkAuth} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'admin':
        return <ClientManager />;
      default:
        return (
          <div style={{ padding: '2rem' }}>
            <h1>Panel Administrativo: {user.username}</h1>
            <p>Selecciona una herramienta en el Dock para empezar.</p>
          </div>
        );
    }
  };

  return (
    <main
      style={{
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
      }}
    >
      {renderContent()}
      {isProfileOpen && user && (
        <ProfilePanel user={user} onClose={() => setIsProfileOpen(false)} />
      )}
      <Dock
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onOpenProfile={() => setIsProfileOpen(true)}
        role={user?.role_name || ''}
      />
    </main>
  );
}
