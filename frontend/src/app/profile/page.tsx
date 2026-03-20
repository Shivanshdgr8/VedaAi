export default function ProfilePage() {
  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>My Profile</h1>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', padding: '24px', flex: 1, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>John Doe</h2>
            <p style={{ color: 'var(--text-muted)' }}>Delhi Public School, Bokaro Steel City</p>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Profile editing functionality coming soon!</p>
      </div>
    </div>
  );
}
