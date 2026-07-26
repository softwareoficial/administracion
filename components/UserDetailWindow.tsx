import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api';

interface UserDetailWindowProps {
  user: any;
  onClose: () => void;
}

const UserDetailWindow: React.FC<UserDetailWindowProps> = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [plan, setPlan] = useState(user.client.subscription.plan);

  const handleSave = async () => {
    try {
      await api.post('/api/admin/command', {
        command: 'USER:bulk-update',
        payload: { clienteIds: [user.client.id], action: 'update-plan', value: plan }
      });
      alert('Cambios guardados');
      onClose();
    } catch (err) {
      alert('Error al guardar');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        width: '90%', maxWidth: '500px', borderRadius: '20px',
        backgroundColor: 'rgba(255,255,255,0.9)', padding: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Editar: {user.username}</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none' }}><X /></button>
        </div>
        
        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['edit', 'history', 'payments'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 16px', borderRadius: '15px', border: 'none',
              backgroundColor: activeTab === tab ? '#007AFF' : '#ddd', color: 'white'
            }}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'edit' && (
          <div>
            <label>Plan:</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '15px' }}>
              <option value="free">FREE</option>
              <option value="pro">PRO</option>
            </select>
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', borderRadius: '10px', backgroundColor: '#34c759', color: 'white', border: 'none', width: '100%', justifyContent: 'center' }}>
              <Save size={18} /> Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailWindow;
