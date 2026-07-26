'use client';
import React from 'react';
import { LayoutDashboard, Users, CreditCard, Settings } from 'lucide-react';

const Dock = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--safe-area-bottom)',
      left: '10px',
      right: '10px',
      padding: '12px 20px',
      borderRadius: '24px',
      backgroundColor: 'var(--dock-bg)',
      backdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--dock-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <DockIcon icon={<LayoutDashboard size={28} />} />
      <DockIcon icon={<Users size={28} />} />
      <DockIcon icon={<CreditCard size={28} />} />
      <DockIcon icon={<Settings size={28} />} />
    </div>
  );
};

const DockIcon = ({ icon }: { icon: React.ReactNode }) => (
  <div style={{
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
  >
    {icon}
  </div>
);

export default Dock;
