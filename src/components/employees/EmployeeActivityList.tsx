'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';

export default function EmployeeActivityList({ userId }: { userId?: string }) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [userId]);

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const params = userId ? { userId } : {};
      const response = await apiClient('/execute', {
        method: 'POST',
        body: JSON.stringify({ cmd: 'staff.get_employee_activity', params }),
      });
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setTimeline(result.data);
      } else {
        setTimeline([]);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return 'Fecha no disp.';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? 'Fecha inválida'
      : `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading)
    return <div style={{ padding: 'var(--space-md)' }}>Cargando...</div>;

  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <h2>Actividad reciente</h2>
      {timeline.length === 0 ? (
        <p>No hay actividad registrada.</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          {timeline.map((event: any, index: number) => (
            <li
              key={index}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold' }}>{event.comando || event.command || 'Evento'}</span>
                  <small style={{ display: 'block' }}>
                    {JSON.stringify(event.payload || event.detalle || {})}
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <small>{formatDate(event.createdAt)}</small>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
