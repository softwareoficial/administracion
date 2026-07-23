'use client';

interface ProfilePanelProps {
  user: any;
  subscription: {
    plan: string;
    trial_start_date: string;
    days_remaining: number | null;
  };
  onClose: () => void;
}

export default function ProfilePanel({ user, subscription, onClose }: ProfilePanelProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          padding: '1.5rem',
          borderRadius: '16px',
          width: '95%',
          maxWidth: '400px',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Mi Cuenta</h2>
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
          <p><strong>Usuario:</strong> {user.username}</p>
          <p><strong>Negocio:</strong> {user.cliente_nombre}</p>
          <p>
            <strong>Plan:</strong>{' '}
            <span style={{ fontWeight: 'bold', color: subscription.plan === 'pro' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              {subscription.plan.toUpperCase()}
            </span>
          </p>
          {subscription.days_remaining !== null && (
            <p>
              <strong>Días restantes de prueba:</strong> {subscription.days_remaining}
            </p>
          )}
          {subscription.trial_start_date && (
            <p>
              <strong>Inicio del plan:</strong> {new Date(subscription.trial_start_date).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
