import React from 'react';
import { clearAllAuthData, isAuthenticated, getCurrentUserRole, getUserData, getAuthToken } from '../../../utils/auth';

const DebugAuthPage = () => {
  const handleClearAuth = () => {
    clearAllAuthData();
    window.location.reload();
  };

  const checkAuthState = () => {
    console.log('🔍 Current Auth State:');
    console.log('isAuthenticated():', isAuthenticated());
    console.log('getCurrentUserRole():', getCurrentUserRole());
    console.log('getUserData():', getUserData());
    console.log('getAuthToken():', getAuthToken());
    console.log('localStorage keys:', Object.keys(localStorage));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Authentication State</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={checkAuthState} style={{ marginRight: '10px', padding: '10px' }}>
          Check Auth State
        </button>
        <button onClick={handleClearAuth} style={{ padding: '10px', backgroundColor: '#ff4444', color: 'white' }}>
          Clear All Auth Data
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current State:</h3>
        <p>isAuthenticated(): {isAuthenticated() ? 'true' : 'false'}</p>
        <p>Role: {getCurrentUserRole() || 'null'}</p>
        <p>Token: {getAuthToken() ? 'Present' : 'None'}</p>
      </div>

      <div>
        <h3>localStorage Contents:</h3>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(
            Object.keys(localStorage).reduce((acc, key) => {
              acc[key] = localStorage.getItem(key);
              return acc;
            }, {} as Record<string, string | null>),
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default DebugAuthPage;
