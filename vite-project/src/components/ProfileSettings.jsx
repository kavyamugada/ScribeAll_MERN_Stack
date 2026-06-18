import React, { useState, useEffect } from 'react';

// Now perfectly accepts 'user' and 'onProfileUpdate' from your App.jsx!
const ProfileSettings = ({ user, onProfileUpdate }) => {
  
  // 1. Core form input states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '💼');

  // 2. Individual show/hide password text visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 3. Status banner messaging alerts states
  const [status, setStatus] = useState({ type: '', text: '' });

  // Keep avatar tracking synchronized if the global user object updates asynchronously
  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    // Explicitly target either 'id' or '_id' properties matching your MongoDB document structures
    const targetUserId = user?.id || user?._id;

    if (!targetUserId) {
      setStatus({ 
        type: 'error', 
        text: 'Active profile identity mapping could not be found. Please log out and sign back in to establish a session.' 
      });
      return;
    }

    // Client-side pre-validation checking password equality entries
    if (newPassword && newPassword !== confirmNewPassword) {
      setStatus({ type: 'error', text: 'New password and confirmation target inputs do not match.' });
      return;
    }

    try {
      const response = await fetch('https://scribeall-backend.onrender.com/api/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          avatarUrl,
          currentPassword,
          newPassword,
          confirmNewPassword
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Operational profile synchronization failure.');
      }

      setStatus({ type: 'success', text: data.message });
      
      // Fires your global React state modifier hook back to update App.jsx!
      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }

      // Flush passcodes out of form fields memory tracking variables upon success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '32px', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
      
      {/* HEADER ROW BANNER BLOCK */}
      <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Active Data Node Session</h3>
        <p style={{ margin: '6px 0 0 0', fontFamily: 'monospace', color: '#64748B', fontSize: '13px' }}>
          Database ID: {user?.id || user?._id || "Not Loaded"}
        </p>
      </div>

      {status.text && (
        <div style={{
          padding: '14px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          backgroundColor: status.type === 'success' ? '#D1FAE5' : '#FEE2E2', 
          border: `1px solid ${status.type === 'success' ? '#10B981' : '#EF4444'}`,
          color: status.type === 'success' ? '#065F46' : '#B91C1C',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {status.type === 'success' ? '✅' : '❌'} {status.text}
        </div>
      )}

      <form onSubmit={handleSaveProfile}>
        
        {/* SECTION 1: SYSTEM AVATAR GLYPH PICKER */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            1. System Profile Glyph
          </label>
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '36px', background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px' }}>
              {avatarUrl}
            </div>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569', fontWeight: '500' }}>Select an anchor token representing your core operational pipeline:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['💼', '🎓', '🩺', '⚖️', '🚀', '🧠', '💻', '🦊'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatarUrl(emoji)}
                    style={{
                      fontSize: '20px',
                      padding: '8px',
                      background: avatarUrl === emoji ? '#4F46E5' : '#fff',
                      color: avatarUrl === emoji ? '#fff' : '#000',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: IMMUTABLE CREDENTIALS */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            2. Immutable Credentials
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Account Name</label>
              <input type="text" disabled value={user?.name || "Loading..."} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Linked Email Address</label>
              <input type="text" disabled value={user?.email || "Loading..."} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', color: '#64748B', cursor: 'not-allowed' }} />
            </div>
          </div>
        </div>

        {/* SECTION 3: PASSCODE ARCHITECTURE */}
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '24px', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            3. Update Passcode Architecture
          </label>
          <p style={{ color: '#94A3B8', fontSize: '12px', margin: '0 0 16px 0' }}>Leave these fields completely blank if you only want to save your avatar token changes.</p>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Verify Current Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showCurrent ? "text" : "password"} 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                {showCurrent ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showNew ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirm ? "text" : "password"} 
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repeat new password"
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT ROW */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button 
            type="submit"
            style={{ padding: '12px 24px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
          >
            💾 Save Profile Modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;