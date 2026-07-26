'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import UserCard from '../components/UserCard';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.post('/api/admin/command', {
      command: 'USER:filter',
      payload: {}
    })
    .then(res => {
      setUsers(res.data.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      setLoading(false);
    });
  };

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <h1 style={{ textAlign: 'center' }}>Panel Administrativo</h1>
      {loading ? <p style={{ textAlign: 'center' }}>Cargando usuarios...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {users.map((user: any) => (
            <UserCard 
              key={user.user_id} 
              user={user} 
              isExpanded={expandedUserId === user.user_id}
              onToggle={() => setExpandedUserId(expandedUserId === user.user_id ? null : user.user_id)}
              onUpdate={fetchUsers}
            />
          ))}
        </div>
      )}
    </main>
  );
}
