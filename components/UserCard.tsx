import React, { useState, useEffect } from 'react';
import { User, ChevronDown, ChevronUp, Save, History, CreditCard, Edit3 } from 'lucide-react';
import api from '../services/api';

interface UserCardProps {
  user: any;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isExpanded, onToggle, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'history' | 'payments'>('edit');
  const [plan, setPlan] = useState(user.client.subscription.plan);
  const [meses, setMeses] = useState(user.client.subscription.meses_contratados || 0);
  const [auditData, setAuditData] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Cargar datos solo al expandir
  useEffect(() => {
    if (isExpanded) {
      api.post('/api/admin/command', {
        command: 'USER:audit-team',
        payload: { userId: user.user_id, limit: 5 }
      }).then(res => setAuditData(res.data.data.timeline || []));
    }
  }, [isExpanded, user.user_id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/admin/command', {
        command: 'USER:bulk-update',
        payload: { clienteIds: [user.client.id], action: 'update-plan', value: plan }
      });
      await api.post('/api/admin/command', {
        command: 'USER:update-path',
        payload: { clienteId: user.client.id, path: 'private_config.meses_contratados', value: parseInt(meses) }
      });
      alert('Cambios guardados');
      onUpdate();
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      padding: '16px', borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      transition: 'all 0.3s ease',
      display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div onClick={onToggle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={24} />
          <div>
            <strong style={{ display: 'block', fontSize: '1.1rem' }}>{user.username}</strong>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>Plan: {plan.toUpperCase()}</span>
          </div>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {isExpanded && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '12px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
            {[ { id: 'edit', icon: Edit3 }, { id: 'history', icon: History }, { id: 'payments', icon: CreditCard } ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === tab.id ? '#007AFF' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#555'
              }}>
                <tab.icon size={18} />
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'edit' && (
            <div>
              <label style={{ fontSize: '0.8rem' }}>Plan:</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', marginBottom: '10px' }}>
                <option value="free">FREE</option>
                <option value="pro">PRO</option>
              </select>
              <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: '#007AFF', color: 'white', border: 'none' }}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ fontSize: '0.8rem', maxHeight: '150px', overflowY: 'auto' }}>
              {auditData.length === 0 ? <p>No hay actividad reciente.</p> : auditData.map((log: any, i) => (
                <div key={i} style={{ marginBottom: '5px', borderBottom: '1px solid #eee' }}>{log.command} - {new Date(log.created_at).toLocaleDateString()}</div>
              ))}
            </div>
          )}
          
          {activeTab === 'payments' && <p style={{ fontSize: '0.8rem' }}>Historial de pagos no disponible.</p>}
        </div>
      )}
    </div>
  );
};

export default UserCard;
