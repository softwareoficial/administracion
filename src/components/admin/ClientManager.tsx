'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '../loading/LoadingProvider';
import { useToast } from '../toast/ToastProvider';
import { apiClient } from '../../lib/api';
import Icon from '../Icon'; 

// --- Componente Modal creación usuario ---
function CreateUserModal({ clienteId, onClose, onUserCreated }: { clienteId: number, onClose: () => void, onUserCreated: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLEADO'); 
  const { addToast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    try {
      const response = await apiClient('/api/commands', {
        method: 'POST',
        body: JSON.stringify({ command: 'CLIENT:user-create', payload: { clienteId, username, password, role } }),
      });
      const json = await response.json();
      if (json.status === 'success') {
        addToast(`Usuario ${username} creado!`, 'success');
        onUserCreated();
        onClose();
      } else {
        throw new Error(json.error?.message || 'Error al crear usuario');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    }
    stopLoading();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>Crear Usuario para Cliente {clienteId}</h3>
        <form onSubmit={handleCreateUser}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
            <option value="EMPLEADO">Empleado</option>
            <option value="DUEÑO">Dueño</option>
          </select>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancelar</button>
            <button type="submit" style={primaryButtonStyle}>Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Estilos ---
export const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
export const modalContentStyle: React.CSSProperties = { backgroundColor: 'var(--color-background)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' };
export const inputStyle: React.CSSProperties = { width: '100%', padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-input-background)', color: 'var(--color-text)' };
export const selectStyle: React.CSSProperties = { width: '100%', padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-input-background)', color: 'var(--color-text)' };
export const primaryButtonStyle: React.CSSProperties = { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' };
export const cancelButtonStyle: React.CSSProperties = { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)', border: 'none', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', cursor: 'pointer' };

import CreateClientModal from './CreateClientModal';

export default function ClientManager() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { addToast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const getPlan = (client: any) => {
    return client.private_config?.subscription?.plan || client.private_config?.plan || 'free';
  };

  const fetchClients = async () => {
    startLoading();
    try {
      const response = await apiClient('/api/clients');
      const json = await response.json();
      if (json.status === 'success') {
        setClients(json.data.owners || []);
      } else {
        throw new Error(json.error?.message || 'Error al listar clientes');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    }
    stopLoading();
  };

  const updatePlan = async (clienteId: number, plan: string) => {
    startLoading();
    try {
      const response = await apiClient('/api/commands', { 
        method: 'POST',
        body: JSON.stringify({ command: 'APP:update-client-plan', payload: { clienteId, plan } }),
      });
      const json = await response.json();
      if (json.status === 'success') {
        addToast(`Plan actualizado a ${plan}`, 'success');
        fetchClients();
        setSelectedClient((prev: any) => prev ? { ...prev, private_config: { ...prev.private_config, plan } } : null);
      } else {
        throw new Error(json.error?.message || 'Error al actualizar plan');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    }
    stopLoading();
  };

  const calculateRemainingTime = (expiryDate: string) => {
    if (!expiryDate) return 'N/A';
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expirado';
    return `${diffDays} días restantes`;
  };

  return (
    <div style={{ padding: 'var(--space-md)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h2>Gestión de Clientes</h2>
        <button className="btn-primary" onClick={() => setIsCreateClientModalOpen(true)}>
          <Icon name="add" style={{ width: '20px', height: '20px', color: 'var(--color-on-primary)' }} />
        </button>
      </div>
      
      <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
        {clients.map((client) => (
          <div 
            key={client.id} 
            onClick={() => setSelectedClient(client)}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-soft)',
              cursor: 'pointer',
              padding: 'var(--space-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{client.cliente_nombre}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>{client.username}</span>
            </div>
            <p>Plan: <strong>{getPlan(client)}</strong></p>
            {client.private_config?.subscription?.plan_expiry_date && (
              <p>Expira: {calculateRemainingTime(client.private_config.subscription.plan_expiry_date)}</p>
            )}
            
            {selectedClient?.id === client.id && (
              <div style={{ marginTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <h4>Detalles y Acciones</h4>
                <select 
                  onChange={(e) => updatePlan(client.cliente_id, e.target.value)}
                  value={getPlan(client)}
                  style={{ padding: 'var(--space-sm)', width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro (30 días)</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <button className="btn-secondary" onClick={() => setIsCreateUserModalOpen(true)}>
                  <Icon name="add" style={{ width: '18px', height: '18px', marginRight: '5px' }} />Crear Usuario
                </button>
                <button className="btn-error" onClick={() => alert(`Eliminar cliente: ${client.cliente_nombre}`)}>Eliminar Cliente</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isCreateUserModalOpen && selectedClient && (
        <CreateUserModal 
          clienteId={selectedClient.cliente_id} 
          onClose={() => setIsCreateUserModalOpen(false)} 
          onUserCreated={fetchClients}
        />
      )}

      {isCreateClientModalOpen && (
        <CreateClientModal
          onClose={() => setIsCreateClientModalOpen(false)}
          onClientCreated={fetchClients}
        />
      )}
    </div>
  );
}
