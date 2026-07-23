'use client';

import { useState } from 'react';
import { useLoading } from '../loading/LoadingProvider';
import { useToast } from '../toast/ToastProvider';
import { apiClient } from '../../lib/api';

// Importamos los estilos compartidos desde ClientManager
import { modalOverlayStyle, modalContentStyle, inputStyle, primaryButtonStyle, cancelButtonStyle } from './ClientManager';

function CreateClientModal({ onClose, onClientCreated }: { onClose: () => void, onClientCreated: () => void }) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { addToast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    try {
      const response = await apiClient('/api/commands', {
        method: 'POST',
        body: JSON.stringify({ 
            command: 'APP:self-register', 
            payload: { nombreCliente, username, password } 
        }),
      });
      const json = await response.json();
      if (json.status === 'success') {
        addToast(`Cliente ${nombreCliente} y usuario ${username} creados!`, 'success');
        onClientCreated();
        onClose();
      } else {
        throw new Error(json.error?.message || 'Error al registrar cliente');
      }
    } catch (error: any) {
      addToast(error.message, 'error');
    }
    stopLoading();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>Nuevo Registro de Cliente</h3>
        <form onSubmit={handleCreateClient}>
          <input 
            type="text" 
            placeholder="Nombre del Negocio" 
            value={nombreCliente} 
            onChange={(e) => setNombreCliente(e.target.value)} 
            style={inputStyle} 
            required 
          />
          <input 
            type="text" 
            placeholder="Usuario Administrador" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={inputStyle} 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={inputStyle} 
            required 
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancelar</button>
            <button type="submit" style={primaryButtonStyle}>Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateClientModal;
